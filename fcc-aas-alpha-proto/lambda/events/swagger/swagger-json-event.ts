export const SWAGGER_JSON_EVENT = { 
    httpMethod: "GET", 
    path: "/docs/file/:file",
    pathParameters: { 
        file: "swagger.json" 
    },
    requestContext: {
        apiId: "test-swagger-api-id"
    }
} 