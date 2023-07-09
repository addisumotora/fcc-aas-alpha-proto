import { APIGatewayEvent } from 'aws-lambda';
import { HttpResponse } from 'lambda/src/models/http/http-response';
import { 
    HEADERS, 
    HTTP_STATUS, 
 } from '../../constants/constants';
import { RDSDataService } from '../../services/rds/rds-data.service';

/**
 * @function
 * @async
 * @exports initializeDatabaseHandler
 * @description Handler for GET /api/dbinit endpoint
 * @param {JSON} event - The event object
 */
export const initializeDatabaseHandler = async (event: APIGatewayEvent): Promise<HttpResponse> => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`initializeDatabase only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    let response: HttpResponse = {
        headers: { ...HEADERS },
        statusCode: HTTP_STATUS.SUCCESS.CODE,
        body: JSON.stringify({ Message: HTTP_STATUS.SUCCESS.MESSAGE })
    };
    try {
        const rdsService = new RDSDataService();

        const sqlStatements: string[] = [
            `CREATE TABLE IF NOT EXISTS items(uuid UUID, name VARCHAR, timestamp TIMESTAMP)`
        ];

        for(const sql of sqlStatements) {
            const pgResult = await rdsService.executeSQLQuery({ sql });
            console.info('pgResult:', pgResult);
        }
        
    } catch (err) {
        console.info('error: ', err);
        response = {
            headers: { ...HEADERS },
            statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR.CODE,
            body: JSON.stringify({ Message: HTTP_STATUS.INTERNAL_SERVER_ERROR.MESSAGE })
        };
    }


    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
