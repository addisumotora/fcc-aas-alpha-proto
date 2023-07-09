import { APIGatewayEvent } from 'aws-lambda';
import { HEADERS, HTTP_STATUS } from '../../constants/constants';
import * as AWS from 'aws-sdk';

const APIGATEWAY = new AWS.APIGateway();

/**
 * @function
 * @async
 * @exports getSwaggerFileHandler
 * @description Handler for GET /api/docs/{file} endpoint
 * @param {JSON} event - The event object
 * @returns {Promise<any>} returns Promise of swagger file
 */
export const getSwaggerFileHandler = async (event: APIGatewayEvent): Promise<any>  => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSwaggerFile only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const swaggerFile = event.pathParameters?.file;

    if(!swaggerFile) {
        const response = {
            headers: { ...HEADERS },
            statusCode: HTTP_STATUS.BAD_REQUEST.CODE,
            body: JSON.stringify({ Message: 'Missing path parameter (file)' })
        };
        return response;
    }

    let swaggerContentType = 'text/html';
    const swaggerFileName = swaggerFile.split('.')[0];
    const swaggerFileExt = swaggerFile.split('.')[1];
    let responseBody = '';

    switch(swaggerFile) {
        case 'swagger.html': {
            swaggerContentType = 'text/html';

            const requestDomain = event.requestContext.domainName!;
            const requestStage = event.requestContext.stage;
            const requestSwaggerURL = `https://${requestDomain}/${requestStage}/api/docs/swagger.json`;
            console.info('requestDomain:', requestDomain);
            console.info('requestStage:', requestStage);
            console.info('requestSwaggerURL:', requestSwaggerURL);
    
            // Create the swagger UI html
            responseBody = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="SwaggerUI" />
	<title>SwaggerUI</title>
	<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
</head>
<body>
	<div id="swagger-ui"></div>
	<script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
	<script>
		window.onload = () => {
			window.ui = SwaggerUIBundle({
				url: '${requestSwaggerURL}',
				dom_id: '#swagger-ui',
			});
		};
	</script>
</body>
</html>`;
            break;
        }
        case 'swagger.json': {
            swaggerContentType = 'application/' + swaggerFileExt;
            const exportParams = {
                restApiId: event.requestContext.apiId,
                accepts: swaggerContentType,
                exportType: swaggerFileName,
                stageName: 'Prod',
              };
              console.info('exportParams:', exportParams);
              const exportData = await APIGATEWAY.getExport(exportParams).promise();
      
              let exportOutput = exportData.body;
              if (Buffer.isBuffer(exportOutput)) {
                console.info('exportOutput isBuffer:', Buffer.isBuffer(exportOutput));
                exportOutput = exportOutput.toString('utf8');
              } else {
                // throw error for undefined
              }
      
            responseBody = exportOutput as string;
            break;
        }
    }
    
    const response = {
        headers: { ...HEADERS, 'Content-Type': swaggerContentType },
        statusCode: HTTP_STATUS.SUCCESS.CODE,
        body: responseBody
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
