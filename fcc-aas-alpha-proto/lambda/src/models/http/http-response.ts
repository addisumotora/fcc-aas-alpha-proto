import { HEADERS } from '../../constants';

export type HttpResponse = {
  headers: typeof HEADERS;
  statusCode: number;
  body: string;
};

export type GetResponse = {
  formattedRecords: string;
};

export type PostResponse = {
  recordCreated: number;
};

export type PutResponse = {
  recordUpdated: number;
};

export type DeleteResponse = {
  recordDeleted: number;
};

export type ErrorResponse = {
  statusCode: number;
  body: string;
};
