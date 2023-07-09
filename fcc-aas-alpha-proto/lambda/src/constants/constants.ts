export const DEFAULT_REGION = process.env.AWS_REGION;
export const DB_NAME = process.env.DB_NAME;
export const DB_CLUSTER_ARN = process.env.DB_CLUSTER_ARN;
export const DB_SECRET_ARN = process.env.DB_SECRET_ARN;
export const ITEMS_SQS_QUEUE = process.env.ItemsSQSQueue;

export const DEFAULT_PAGE_SIZE = 50;


export const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
}

export const HTTP_STATUS = {
    SUCCESS: { CODE: 200, MESSAGE: 'Success' },
    BAD_REQUEST: { CODE: 400, MESSAGE: 'Bad Request' },
    NOT_FOUND: { CODE: 404, MESSAGE: 'Not Found' },
    INTERNAL_SERVER_ERROR: { CODE: 500, MESSAGE: 'Internal Server Error' },
};

export const parseRequest = (request: string): {} => JSON.parse(Buffer.from(request, "base64").toString("utf-8")) as {};

export const TABLE_NAMES = {
    ITEMS: "Items",
};

export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
} as const;
  