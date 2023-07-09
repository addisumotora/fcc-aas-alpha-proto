import { mockClient } from 'aws-sdk-client-mock';
import {
    RDSDataClient,
  } from '@aws-sdk/client-rds-data';

export const mockRDSDataClient = mockClient(RDSDataClient);