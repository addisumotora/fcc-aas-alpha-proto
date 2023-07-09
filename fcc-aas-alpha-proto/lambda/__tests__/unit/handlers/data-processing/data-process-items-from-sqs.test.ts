import { dataProcessItemsFromSQSHandler } from '../../../../src/handlers/data-processing'; 
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/data-processing/data-process-items-success-event.json';
import * as successEvent2 from '../../../../events/data-processing/data-process-items-success-event-with-timestamp.json';
import * as failEvent from '../../../../events/data-processing/data-process-items-fail-event.json';
  
describe('Test dataProcessItemsFromSQSHandler', () => {
    beforeEach (() => {
        mockRDSDataClient.reset();
    });

    it('should successfully process message from SQS queue', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolves({
            formattedRecords: JSON.stringify({ numberOfRecordsUpdated: 1, generatedFields: [] }),
            numberOfRecordsUpdated: 0,
        })

        const result = await dataProcessItemsFromSQSHandler(successEvent);

        expect(result).toEqual(true);
    });

    it('should also successfully process message from SQS queue', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolves({
            formattedRecords: JSON.stringify({ numberOfRecordsUpdated: 1, generatedFields: [] }),
            numberOfRecordsUpdated: 0,
        })

        const result = await dataProcessItemsFromSQSHandler(successEvent2);

        expect(result).toEqual(true);
    });

    it('should fail to process message from SQS queue', async () => {
        const result = await dataProcessItemsFromSQSHandler(failEvent);

        expect(result).toEqual(false);
    });
});
