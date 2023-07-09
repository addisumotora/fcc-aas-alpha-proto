import { Item } from "../../models/items/item";
import { RDSDataService } from '../../services/rds/rds-data.service';
import * as UUID from 'uuid';
import { SQSEvent } from "aws-lambda";

/**
 * @function
 * @async
 * @exports dataProcessItemsFromSQSHandler
 * @description AWS Lambda Function Handler that is triggered on a new SQS event 
 * It in turn inserts a new record in Postgres
 * @param {JSON} "event" - object contains info from the invoking service (SQS)
 * @returns {Boolean} returns boolean 
 */
export const dataProcessItemsFromSQSHandler = async (event: SQSEvent): Promise<boolean> => {
    // All log statements are written to CloudWatch
    console.info('received:', event);

    try {
        const rdsService = new RDSDataService();

        for (const record of event.Records) {
            console.info('Record: ', JSON.stringify(record));
            const eventBody = JSON.parse(record.body);
            console.info('Event Body: ', JSON.stringify(eventBody));

            const item: Item = {
                uuid: UUID.v4(),
                name: eventBody.Name ?? '',
                timestamp: eventBody.Timestamp
            };

            if(!item.timestamp) {
                item.timestamp = new Date().toLocaleDateString();
            }

            const sql = `INSERT INTO items VALUES ('${item.uuid!}', '${item.name!}', '${item.timestamp}')`;

            const pgResult = await rdsService.executeSQLQuery({ sql });
            console.info('pgResult:', pgResult);
        }
        return true;
    } catch (err) {
        console.info('error: ', err);
    }
    return false;
}
