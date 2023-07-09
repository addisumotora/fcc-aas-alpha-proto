export const SWAGGER_JSON_RESPONSE = {
    swagger: "2.0",
    info: {
      "version": "1.0",
      "title": "fcc-aas-alpha-RESTAPI"
    },
    host: "ptw3v2jfl3.execute-api.us-east-1.amazonaws.com",
    basePath: "/Prod",
    schemes: [
      "https"
    ],
    paths: {
      "/api/dbinit": {
        "get": {
          "responses": {}
        }
      },
      "/api/docs/{file}": {
        "get": {
          "parameters": [
            {
              "name": "file",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {}
        }
      },
      "/api/item": {
        "post": {
          "responses": {}
        },
        "put": {
          "responses": {}
        }
      },
      "/api/item/{itemId}": {
        "get": {
          "parameters": [
            {
              "name": "itemId",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {}
        },
        "delete": {
          "parameters": [
            {
              "name": "itemId",
              "in": "path",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {}
        }
      },
      "/api/items": {
        "get": {
          "responses": {}
        }
      }
    }
  }