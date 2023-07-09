import { APIGatewayEvent } from 'aws-lambda';
import { Item } from '../../models/items/item';
import { 
    HEADERS, 
    HTTP_STATUS, 
 } from '../../constants/constants';
import { RDSDataService } from '../../services/rds/rds-data.service';
import { HttpResponse } from 'lambda/src/models/http/http-response';

/**
 * @function
 * @async
 * @exports getItemsHandler
 * @description Handler for GET /api/items endpoint
 * @param {JSON} event - The event object
 */
export const getItemsHandler = async (event: APIGatewayEvent): Promise<HttpResponse> => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getItems only accept GET method, you tried: ${event.httpMethod}`);
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

        const sql = 'SELECT * FROM items';

        const pgResult = await rdsService.executeSQLQuery({ sql });
        console.info('pgResult:', pgResult);

        if(!pgResult.formattedRecords) {
            throw new Error('No formatted records were returned from postgres.');
        }

        const data: Item[] = JSON.parse(pgResult.formattedRecords);

        if(data.length > 0) {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.SUCCESS.CODE,
                body: JSON.stringify(data)
            };
        } else {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.NOT_FOUND.CODE,
                body: JSON.stringify({ Message: 'No items found' })
            };
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
