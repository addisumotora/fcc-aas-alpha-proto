import { putItemHandler } from '../../../../src/handlers/items'; 
import { HEADERS, HTTP_STATUS } from '../../../../src/constants/constants';
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/items/put-item-success-event.json';
import * as failEvent from '../../../../events/items/put-item-fail-event.json';
import * as invalidEvent from '../../../../events/items/put-item-invalid-event.json';
import { APIGatewayEvent } from 'aws-lambda';
import { PUT_ITEM_SUCCESS_RESPONSE } from '../../../../responses/items/put-item-success';

describe('Test putItemHandler', () => {
    beforeEach (() => {
        mockRDSDataClient.reset();
    });

    it('should successfully update item in postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            numberOfRecordsUpdated: 1,
        })
        
        const result = await putItemHandler(successEvent as APIGatewayEvent);
         
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: JSON.stringify(PUT_ITEM_SUCCESS_RESPONSE)
        }; 

        expect(result).toEqual(expectedResult); 
    });

    it('should fail to update an item in postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            numberOfRecordsUpdated: 0,
        })
        
        const result = await putItemHandler(successEvent as APIGatewayEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.BAD_REQUEST.CODE, 
            body: JSON.stringify({ Message: 'Could not update item'})
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to postgres database server error', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .rejects();

        const result = await putItemHandler(successEvent as APIGatewayEvent);
 
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE, 
            body: JSON.stringify({ Message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to missing request body', async () => {  
        const result = await putItemHandler(failEvent as APIGatewayEvent);
 
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.BAD_REQUEST.CODE, 
            body: JSON.stringify({ Message: 'Missing request body' })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to incorrect http method', () => {  
        const result = putItemHandler(invalidEvent as APIGatewayEvent);
 
        expect(result).rejects.toThrow(`putItem only accept PUT method, you tried: ${invalidEvent.httpMethod}`); 
    });
});
