import { getSwaggerFileHandler } from '../../../../src/handlers/swagger'; 
import { HTTP_STATUS, HEADERS } from '../../../../src/constants/constants';
import * as fs from 'fs';
import * as jsonEvent from '../../../../events/swagger/swagger-json-event.json';
import * as htmlEvent from '../../../../events/swagger/swagger-html-event.json';
import * as invalidEvent from '../../../../events/swagger/swagger-invalid-method-event.json';
import * as failEvent from '../../../../events/swagger/swagger-fail-event.json';
import { APIGatewayEvent } from 'aws-lambda';
import { SWAGGER_JSON_RESPONSE } from 'lambda/responses/swagger/swagger-json';

const htmlFilePath = __dirname + '/../../../../responses/swagger/swagger-html.html';
const htmlResponse = fs.readFileSync(htmlFilePath, 'utf8');

const mockGetSwaggerFile = jest.fn(fileName => {
    let filePath;
    let swaggerDoc: {} = {};
  
    if (fileName === 'swagger.json') {
      filePath = __dirname + '/../../../../responses/swagger/swagger-json.json';
      swaggerDoc = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {};
    }
    return swaggerDoc;
});

let mockIsBufferedData = false;

jest.mock('aws-sdk', () => ({
      APIGateway: jest.fn(() => ({
          getExport: jest.fn(({ restApiId, accepts, exportType }) => {
            const fileName = exportType as string + '.' + (accepts as string).split('/')[1];
            const expectedSwaggerDoc = mockGetSwaggerFile(fileName);
            const resolvedBody = mockIsBufferedData ? Buffer.from(JSON.stringify(expectedSwaggerDoc)) : expectedSwaggerDoc;
            return {
              promise: () => Promise.resolve({ body: resolvedBody })
            };
          }),
        })),
    }));

describe('Test getSwaggerFileHandler', () => {  
    beforeEach(() => {
        mockIsBufferedData = false;
    });

    it('should get the swagger json', async () => {
        const result = await getSwaggerFileHandler(jsonEvent as any as APIGatewayEvent); 
 
        const expectedResult = { 
            headers: {
                ...HEADERS
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: SWAGGER_JSON_RESPONSE
        }; 
 
        expect(result).toEqual(expectedResult); 
    }); 

    it('should get the buffer swagger json', async () => { 
      mockIsBufferedData = true;
      const bufferBody = "{\"swagger\":\"2.0\",\"info\":{\"version\":\"1.0\",\"title\":\"fcc-aas-alpha-RESTAPI\"},\"host\":\"ptw3v2jfl3.execute-api.us-east-1.amazonaws.com\",\"basePath\":\"/Prod\",\"schemes\":[\"https\"],\"paths\":{\"/api/dbinit\":{\"get\":{\"responses\":{}}},\"/api/docs/{file}\":{\"get\":{\"parameters\":[{\"name\":\"file\",\"in\":\"path\",\"required\":true,\"type\":\"string\"}],\"responses\":{}}},\"/api/item\":{\"post\":{\"responses\":{}},\"put\":{\"responses\":{}}},\"/api/item/{itemId}\":{\"get\":{\"parameters\":[{\"name\":\"itemId\",\"in\":\"path\",\"required\":true,\"type\":\"string\"}],\"responses\":{}},\"delete\":{\"parameters\":[{\"name\":\"itemId\",\"in\":\"path\",\"required\":true,\"type\":\"string\"}],\"responses\":{}}},\"/api/items\":{\"get\":{\"responses\":{}}}}}";

      const result = await getSwaggerFileHandler(jsonEvent as any as APIGatewayEvent); 

      const expectedResult = { 
          headers: {
              ...HEADERS
          },
          statusCode: HTTP_STATUS.SUCCESS.CODE,
          body: bufferBody
      }; 

      expect(result).toEqual(expectedResult);
  }); 

    it('should get the swagger html', async () => { 
        const result = await getSwaggerFileHandler(htmlEvent as any as APIGatewayEvent); 
 
        const expectedResult = { 
            headers: {
                ...HEADERS,
                "Content-Type": "text/html"
            },
            statusCode: HTTP_STATUS.SUCCESS.CODE, 
            body: htmlResponse
        }; 
 
        expect(result).toEqual(expectedResult); 
    }); 

    it('should fail due to incorrect http method', () => {  
      const result = getSwaggerFileHandler(invalidEvent as any as APIGatewayEvent);

      expect(result).rejects.toThrow(`getSwaggerFile only accept GET method, you tried: ${invalidEvent.httpMethod}`); 
  });

  it('should fail due to missing path param', async () => { 
    const result = await getSwaggerFileHandler(failEvent as any as APIGatewayEvent); 

    const expectedResult = { 
        headers: {
            ...HEADERS
        },
        statusCode: HTTP_STATUS.BAD_REQUEST.CODE, 
        body: JSON.stringify({ Message: 'Missing path parameter (file)' })
    }; 

    expect(result).toEqual(expectedResult); 
}); 
}); 
 