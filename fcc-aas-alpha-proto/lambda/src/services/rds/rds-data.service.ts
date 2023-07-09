import {
  ExecuteStatementCommand,
  ExecuteStatementCommandInput,
  ExecuteStatementCommandOutput,
  RDSDataClient,
  RecordsFormatType,
} from '@aws-sdk/client-rds-data';

import {
  DB_SECRET_ARN,
  DB_CLUSTER_ARN,
  DB_NAME,
  DEFAULT_REGION,
} from '../../constants/constants';

export class RDSDataService {
  RDSClient: RDSDataClient;
  RDSRequest: ExecuteStatementCommandInput;
  constructor() {
    this.RDSClient = new RDSDataClient({ region: DEFAULT_REGION });
    this.RDSRequest = {
      resourceArn: DB_CLUSTER_ARN,
      secretArn: DB_SECRET_ARN,
      database: DB_NAME,
      formatRecordsAs: RecordsFormatType.JSON,
      sql: '',
    };
  }

  executeSQLQuery(
    params: Pick<ExecuteStatementCommandInput, 'sql'>
  ): Promise<ExecuteStatementCommandOutput> {
    const command = new ExecuteStatementCommand({
      ...this.RDSRequest,
      ...params,
    });
    return this.RDSClient.send(command);
  }
}
