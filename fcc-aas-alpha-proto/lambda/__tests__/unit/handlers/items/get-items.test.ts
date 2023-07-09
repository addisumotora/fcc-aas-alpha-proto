import { getItemsHandler } from '../../../../src/handlers/items'; 
import { HEADERS, HTTP_STATUS } from '../../../../src/constants/constants';
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/items/get-items-success-event.json';
import * as failEvent from '../../../../events/items/get-items-fail-event.json';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { GET_ITEMS_SUCCESS } from '../../../../responses/items/get-items-success';
import { GET_ITEMS_NOT_FOUND } from '../../../../responses/items/get-items-not-found';
  
describe('Test getItemsHandler', () => {
    beforeEach (() => {
        mockRDSDataClient.reset();
    });

    it('should successfully get items from postgres database', async () => {
        mockRDSDataClient
            .on(ExecuteStatementCommand)
            .resolvesOnce({
                formattedRecords: JSON.stringify(GET_ITEMS_SUCCESS),
                numberOfRecordsUpdated: 0,
            })
        
        const result = await getItemsHandler(successEvent as APIGatewayProxyEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: JSON.stringify(GET_ITEMS_SUCCESS)
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should find no items in postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            formattedRecords: JSON.stringify([]),
            numberOfRecordsUpdated: 0,
        })
        
        const result = await getItemsHandler(successEvent as APIGatewayProxyEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.NOT_FOUND.CODE, 
            body: JSON.stringify(GET_ITEMS_NOT_FOUND)
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail to get items from postgres database', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .rejects();

        const result = await getItemsHandler(successEvent as APIGatewayProxyEvent);
 
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE, 
            body: JSON.stringify({ Message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to incorrect http method', () => {  
        const result = getItemsHandler(failEvent as APIGatewayProxyEvent);
 
        expect(result).rejects.toThrow(`getItems only accept GET method, you tried: ${failEvent.httpMethod}`); 
    });
});
