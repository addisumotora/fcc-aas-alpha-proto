import { ExecuteStatementCommandOutput } from '@aws-sdk/client-rds-data';
import { WildCard } from '../../types';

export const processGetResponse = (
  data: ExecuteStatementCommandOutput
): WildCard[] => (data.formattedRecords && JSON.parse(data.formattedRecords)) as WildCard[];

export const processPostResponse = (
  data: ExecuteStatementCommandOutput
): WildCard => (data.formattedRecords && JSON.parse(data.formattedRecords)[0]) as WildCard;

