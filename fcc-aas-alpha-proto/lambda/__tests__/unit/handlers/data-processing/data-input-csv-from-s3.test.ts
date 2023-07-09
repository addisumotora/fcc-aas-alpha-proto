import { dataInputCSVtoSQSfromS3Handler, ReadFromStream } from '../../../../src/handlers/data-processing'; 
import * as successEvent from '../../../../events/data-processing/data-input-success-event.json';
import * as failEvent from '../../../../events/data-processing/data-input-fail-event.json';

const jsonForBuffer = {
    colOne: 'one',
    colTwo: 'two',
};

const mockStream = [
    { Records: { Payload: Buffer.from(JSON.stringify(jsonForBuffer)) } },
    { Records: { Payload: false } }, // skipped payload log
    { Stats: { Details: { BytesProcessed: 1 } } },
    { Ignore: undefined }, // else path
    { End: 'test' },
];

const mockSelectObjectContent = jest.fn(() => ({
      Payload: mockStream,
    }));

const mockSQSSendMessage = jest.fn(() => ({
        MessageId: 'test',
    }));
  
jest.mock('aws-sdk', () => ({
        S3: jest.fn(() => ({
            selectObjectContent: jest.fn(() => ({
                promise: () => mockSelectObjectContent(),
            })),
        })),
        SQS: jest.fn(() => ({
            sendMessage: jest.fn(() => ({
                promise: () => mockSQSSendMessage(),
            })),
        })),
    }));
  
describe('Test DataInputCSVtoSQSfromS3Handler', () => {
    it('should fail to send message to items SQS queue', async () => {
        mockSelectObjectContent.mockImplementation(() => {
            throw new Error();
        })
        const result = await dataInputCSVtoSQSfromS3Handler(failEvent);

        expect(result).toEqual(false);
    });

    it('should send message to items SQS queue successfully', async () => {
        mockSelectObjectContent.mockImplementation(() => ({
                Payload: mockStream,
              }))
        mockSQSSendMessage.mockReturnValueOnce({
            MessageId: 'test',
        });

        const result = await dataInputCSVtoSQSfromS3Handler(successEvent);

        expect(result).toEqual(true);
    });
});

describe('ReadFromStream', () => {
    it('should process all parts of event stream and populate eventRecords', async () => {        
        const result = await ReadFromStream(mockStream);

        const expectedResult = '{"colOne":"one","colTwo":"two"}';

        expect(result).toEqual(expectedResult);
    });
    
    it('should return empty eventRecords, if error is caught', async () => {
        const errorEvent = [{ Stats: 'will-throw-error' }];

        const result = await ReadFromStream(errorEvent);

        const expectedResult = '';

        expect(result).toEqual(expectedResult);
    });
});