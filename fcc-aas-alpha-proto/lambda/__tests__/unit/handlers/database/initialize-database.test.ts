import { initializeDatabaseHandler } from '../../../../src/handlers/database'; 
import { HEADERS, HTTP_STATUS } from '../../../../src/constants/constants';
import { mockRDSDataClient } from '../../mocks';
import { ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import * as successEvent from '../../../../events/database/initialize-database-success-event.json';
import * as failEvent from '../../../../events/database/initialize-database-fail-event.json';

describe('Test initializeDatabaseHandler', () => {

    beforeEach (() => {
        mockRDSDataClient.reset();        
    });

    it('should successfully initialize database', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .resolves({
            formattedRecords: JSON.stringify([])
        });
        
        const result = await initializeDatabaseHandler(successEvent);

        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: JSON.stringify({ Message: HTTP_STATUS.SUCCESS.MESSAGE })
        }; 
 
        expect(result).toEqual(expectedResult); 
    });

    it('should fail to initialize database', async () => {  
        mockRDSDataClient
        .on(ExecuteStatementCommand)
        .rejects();

        const result = await initializeDatabaseHandler(successEvent);
 
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
        const result = initializeDatabaseHandler(failEvent);
 
        expect(result).rejects.toThrow(`initializeDatabase only accept GET method, you tried: ${failEvent.httpMethod}`); 
    });
});
