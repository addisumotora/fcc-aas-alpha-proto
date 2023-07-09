import { deleteItemByIdHandler } from '../../../../src/handlers/items'; 
import { HEADERS, HTTP_STATUS } from '../../../../src/constants/constants';
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/items/delete-item-by-id-success-event.json';
import * as failEvent from '../../../../events/items/delete-item-by-id-fail-event.json';
import * as noPathParamEvent from '../../../../events/items/delete-item-by-id-fail-event-no-path-param.json';

  
describe('Test deleteItemByIdHandler', () => {
    beforeEach (() => {
        mockRDSDataClient.reset();
    });

    it('should successfully delete item from postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            numberOfRecordsUpdated: 1,
        })
        
        const result = await deleteItemByIdHandler(successEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: JSON.stringify({ Message: HTTP_STATUS.SUCCESS.MESSAGE })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should find no items in postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            numberOfRecordsUpdated: 0,
        })
        
        const result = await deleteItemByIdHandler(successEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.NOT_FOUND.CODE, 
            body: JSON.stringify({ Message: `Could not delete item by id ${successEvent.pathParameters.itemId}`})
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail to delete item from postgres database', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .rejects();

        const result = await deleteItemByIdHandler(successEvent);
 
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
        const result = await deleteItemByIdHandler(noPathParamEvent);
 
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
        const result = deleteItemByIdHandler(failEvent);
 
        expect(result).rejects.toThrow(`deleteItemById only accept DELETE method, you tried: ${failEvent.httpMethod}`); 
    });
});
