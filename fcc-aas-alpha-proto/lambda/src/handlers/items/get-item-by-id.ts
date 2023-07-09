import { APIGatewayEvent } from 'aws-lambda';
import { Item } from '../../models/items/item';
import { 
    HEADERS, 
    HTTP_STATUS,
    TABLE_NAMES, 
 } from '../../constants/constants';
import { getDataById } from '../../utilities/database/crud-operations.util';
import { HttpResponse } from 'lambda/src/models/http/http-response';

/**
 * @function
 * @async
 * @exports getItemByIdHandler
 * @description Handler for GET /api/item endpoint
 * @param {JSON} event - The event object
 */
export const getItemByIdHandler = async (event: APIGatewayEvent): Promise<HttpResponse> => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getItemById only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    let response: HttpResponse = {
        headers: { ...HEADERS },
        statusCode: HTTP_STATUS.SUCCESS.CODE,
        body: JSON.stringify({ Message: HTTP_STATUS.SUCCESS.MESSAGE })
    };
    
    try {
        if(!event.pathParameters?.itemId) {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.BAD_REQUEST.CODE,
                body: JSON.stringify({ Message: 'Missing path parameter (itemId)' })
            };
            return response;
        }

        const request: Item = {
            uuid: event.pathParameters.itemId
        };

        const data = await getDataById( TABLE_NAMES.ITEMS,'uuid', request.uuid! );
        console.info('pgResult:', data);


        if(data.length > 0) {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.SUCCESS.CODE,
                body: JSON.stringify(data[0])
            };
        } else {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.NOT_FOUND.CODE,
                body: JSON.stringify({ Message: `Could not find item by id ${request.uuid!}` })
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