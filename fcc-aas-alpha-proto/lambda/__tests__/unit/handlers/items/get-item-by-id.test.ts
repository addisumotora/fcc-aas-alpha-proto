import { getItemByIdHandler } from '../../../../src/handlers/items'; 
import { HEADERS, HTTP_STATUS } from '../../../../src/constants/constants';
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/items/get-item-by-id-success-event.json';
import * as failEvent from '../../../../events/items/get-item-by-id-fail-event.json';
import * as noPathParamEvent from '../../../../events/items/get-item-by-id-fail-event-no-path-param.json';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { GET_ITEMS_SUCCESS } from '../../../../responses/items/get-items-success';
  
describe('Test getItemByIdHandler', () => {
    beforeEach (() => {
        mockRDSDataClient.reset();
    });

    it('should successfully get item from postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            formattedRecords: JSON.stringify(GET_ITEMS_SUCCESS),
            numberOfRecordsUpdated: 0,
        })
        
        const result = await getItemByIdHandler(successEvent as any as APIGatewayProxyEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: JSON.stringify(GET_ITEMS_SUCCESS[0])
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
        
        const result = await getItemByIdHandler(successEvent as any as APIGatewayProxyEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.NOT_FOUND.CODE, 
            body: JSON.stringify({ Message: `Could not find item by id ${successEvent.pathParameters.itemId}`})
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail to get items from postgres database', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .rejects();

        const result = await getItemByIdHandler(successEvent as any as APIGatewayProxyEvent);
 
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE, 
            body: JSON.stringify({ Message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to missing path param', async () => {  
        const result = await getItemByIdHandler(noPathParamEvent as any as APIGatewayProxyEvent);
 
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.BAD_REQUEST.CODE, 
            body: JSON.stringify({ Message: 'Missing path parameter (itemId)' })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to incorrect http method', () => {  
        const result = getItemByIdHandler(failEvent as any as APIGatewayProxyEvent);
 
        expect(result).rejects.toThrow(`getItemById only accept GET method, you tried: ${failEvent.httpMethod}`); 
    });
});
