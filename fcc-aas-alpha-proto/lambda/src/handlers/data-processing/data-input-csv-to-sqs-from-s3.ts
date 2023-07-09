import { S3Event } from "aws-lambda";
import { ITEMS_SQS_QUEUE } from "../../constants/constants";
import * as AWS from 'aws-sdk';
import { SelectObjectContentEventStream, SelectObjectContentOutput } from "aws-sdk/clients/s3";
import { SendMessageRequest } from "aws-sdk/clients/sqs";

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

/**
 * @function
 * @async
 * @exports dataInputCSVtoSQSfromS3Handler
 * @description AWS Lambda Function Handler that is triggered upon the creation of new S3 object. 
 * It in turn parses the S3 file, and publishes an SQS message
 * @param {JSON} "event" - object contains info from the invoking service (S3)
 * @returns {Boolean} returns boolean
 */
export const dataInputCSVtoSQSfromS3Handler = async (event: S3Event): Promise<boolean> => {
    // All log statements are written to CloudWatch
    console.info('received:', event);

    try {
        if (!ITEMS_SQS_QUEUE) {
            throw new Error('No SQS Queue was defined');
        }

        const fileDelimiter = ',';
 
		for (const record of event.Records) {
			console.info('record:', JSON.stringify(record));

			const fileName = record.s3.object.key.replace('.csv', '');
			console.info('fileName:', fileName);

            const fileSize = record.s3.object.size;
            const batchSize = 1048576; // 1000000;
            const fileBatches = Math.ceil(fileSize / batchSize);
            console.info('fileSize: ', fileSize);
            console.info('batchSize: ', batchSize);
            console.info('fileBatches: ', fileBatches);

            for (let i = 0; i < fileBatches; i++) {
                const startRange = i * batchSize;
                let endRange = (i + 1) * batchSize;
                if (endRange >= fileSize) {
                endRange = fileSize - 1;
                }
                console.info('startRange: ', startRange);
                console.info('endRange: ', endRange);

                const s3SelectAllRangeParams = {
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key,
                ExpressionType: 'SQL',
                Expression: `SELECT * FROM s3object s `,
                InputSerialization: {
                    CSV: {
                    FileHeaderInfo: 'USE',
                    FieldDelimiter: fileDelimiter,
                    // RecordDelimiter: recordDelimiter,
                    },
                    CompressionType: 'NONE',
                },
                OutputSerialization: {
                    // CSV: {
                    // 	FieldDelimiter: fileDelimiter,
                    // },
                    JSON: {
                    RecordDelimiter: ',',
                    },
                },
                ScanRange: {
                    Start: startRange,
                    End: endRange,
                },
                };
                console.info('s3SelectAllRangeParams:', JSON.stringify(s3SelectAllRangeParams));

                /** filters the contents of an Amazon S3 object based on a simple structured query language (SQL) statement */
                const s3SelectAllRangeData: SelectObjectContentOutput = await s3.selectObjectContent(s3SelectAllRangeParams).promise();
                console.info('s3SelectAllRangeData:', JSON.stringify(s3SelectAllRangeData));
                const eventPayload = s3SelectAllRangeData.Payload;

                if (!eventPayload) {
                    throw new Error('No payload was returned');
                }   
                
                const eventRecords = await ReadFromStream(eventPayload);

                console.info("eventPayload:", JSON.stringify(eventPayload));
                console.info("eventRecords:", JSON.stringify(eventRecords));
                
                const s3SelectAllRangeString = eventRecords.replace(/(?:\\[rn])+/g, '').slice(0);
                const s3SelectAllRangeJSON = JSON.parse('[' + s3SelectAllRangeString + ']');
                
                for(let j = 0; j < s3SelectAllRangeJSON.length; j++) {
                const rec = s3SelectAllRangeJSON[j];

                const params: SendMessageRequest = {
                    MessageBody: JSON.stringify(rec),
                    QueueUrl: ITEMS_SQS_QUEUE
                }
                console.info('params:', params);
                
                // Send to SQS
                const result = await sqs.sendMessage(params).promise()
                console.info('result:', result);
                }
            }
                }
            return true;
        
    } catch (err) {
        console.info('error: ', err);
    }
    return false;
}

export const ReadFromStream = async (event: SelectObjectContentEventStream): Promise<string> => {
    console.info('ReadFromStream Received:', JSON.stringify(event));
	let eventRecords = '';

	/** convert record from plaintext to UTF-8  */
	for await (const eventStream of event) {
		try {
            if (typeof eventStream === 'string' || eventStream instanceof Buffer) {
                throw new Error(`eventStream is not a SelectObjectContentEventStream`);
            }
			if (eventStream.Records) {
				if (eventStream.Records.Payload) {
					eventRecords += eventStream.Records.Payload.toString('utf8');
				} else {
					console.info('skipped eventStream, payload: ', eventStream.Records.Payload);
				}
			} else if (eventStream.Stats) {
				console.info(`Processed ${eventStream.Stats.Details?.BytesProcessed ?? 'unknown number of'} bytes`);
			} else if (eventStream.End) {
				console.info('eventStream completed');
			}
		} catch (err) {
			console.info('eventStream error: ', err);
		}
	}

	return eventRecords;
}
