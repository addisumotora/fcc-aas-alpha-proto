import { postItemHandler } from '../../../../src/handlers/items'; 
import { HEADERS, HTTP_STATUS } from '../../../../src/constants/constants';
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/items/post-item-success-event.json';
import * as failEvent from '../../../../events/items/post-item-fail-event.json';
import * as invalidEvent from '../../../../events/items/post-item-invalid-event.json';
  
describe('Test postItemHandler', () => {
    beforeEach (() => {
        mockRDSDataClient.reset();
    });

    it('should successfully post item to postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            numberOfRecordsUpdated: 1,
        })
        
        const result = await postItemHandler(successEvent);
         
        expect(result.statusCode).toEqual(HTTP_STATUS.SUCCESS.CODE); 
    });

    it('should fail to post item in postgres database', async () => {
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolvesOnce({
            numberOfRecordsUpdated: 0,
        })
        
        const result = await postItemHandler(successEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.BAD_REQUEST.CODE, 
            body: JSON.stringify({ Message: 'Could not post new item'})
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail due to postgres database server error', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .rejects();

        const result = await postItemHandler(successEvent);
 
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
        const result = await postItemHandler(failEvent);
 
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
        const result = postItemHandler(invalidEvent);
 
        expect(result).rejects.toThrow(`postItem only accept POST method, you tried: ${invalidEvent.httpMethod}`); 
    });
});
