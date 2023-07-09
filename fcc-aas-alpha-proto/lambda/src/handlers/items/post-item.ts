import { APIGatewayEvent } from 'aws-lambda';
import { Item } from '../../models/items/item';
import { 
    HEADERS, 
    HTTP_STATUS, 
    TABLE_NAMES, 
    parseRequest
 } from '../../constants/constants';

import { postData } from '../../utilities/database/crud-operations.util';
import * as UUID from 'uuid';
import { HttpResponse } from 'lambda/src/models/http/http-response';

/**
 * @function
 * @async
 * @exports postItemHandler
 * @description Handler for POST /api/item endpoint
 * @param {JSON} event - The event object
 */
export const postItemHandler = async (event: APIGatewayEvent): Promise<HttpResponse> => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postItem only accept POST method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    let response: HttpResponse = {
        headers: { ...HEADERS },
        statusCode: HTTP_STATUS.SUCCESS.CODE,
        body: JSON.stringify({ Message: HTTP_STATUS.SUCCESS.MESSAGE })
    };
    
    try {
        if(!event.body) {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.BAD_REQUEST.CODE,
                body: JSON.stringify({ Message: 'Missing request body' })
            };
            return response;
        }

        const request: Item = parseRequest(event.body);

        request.uuid = UUID.v4();
        
        const pgResult= await postData( TABLE_NAMES.ITEMS,'uuid',request);
        console.info('pgResult:', pgResult);

        if(pgResult.recordCreated > 0) {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.SUCCESS.CODE,
                body: JSON.stringify(request)
            };
        } else {
            response = {
                headers: { ...HEADERS },
                statusCode: HTTP_STATUS.BAD_REQUEST.CODE,
                body: JSON.stringify({ Message: 'Could not post new item' })
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