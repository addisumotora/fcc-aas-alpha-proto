import {
    deleteByIdQuery,
    getByIdQuery,
    // getQuery,
    postQuery,
    putQuery,
  } from '../../db-queries';
  import { DbException } from '../../exceptions';
  import { DeleteResponse, PostResponse, PutResponse } from '../../models/http/http-response';
  import { RDSDataService } from '../../services/rds/rds-data.service';
  import { WildCard } from '../../types';
  import {
    processGetResponse,
    processPostResponse,
  } from '../../utilities/parsers/response-processor.util';
  /*
  export const executeSQLQuery = async (sqlStatement: string) => {
    const rdsService = new RDSDataService();
  
    let response = [];
  
    try {
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
  
      response = processGetResponse(rdsResponse);
    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
  
    return response;
  };
  */
  /*
  export const getDataByQuery = async (sqlStatement: string) => {
    const rdsService = new RDSDataService();
  
    let response = [];
  
    try {
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
  
      response = processGetResponse(rdsResponse);
    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
  
    return response;
  };
  */
  
  /*
  export const getData = async (
    tableName: string,
    selectors = '*',
    params: WildCard
  ) => {
    const rdsService = new RDSDataService();
  
    let response = [];
  
    try {
      const sqlStatement = getQuery(tableName, selectors, params);
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
  
      response = processGetResponse(rdsResponse);
    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
  
    return response;
  };
  */

  export const getDataById = async (
    tableName: string,
    recordIdKey: string,
    id: string
  ): Promise<WildCard[]> => {
    const rdsService = new RDSDataService();
  
    let response = [];
  
    try {
      const sqlStatement = getByIdQuery(tableName, recordIdKey, id);
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
  
      response = processGetResponse(rdsResponse);
    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
    return response;
  };
  
  export const postData = async (
    tableName: string,
    recordIdKey: string,
    request: WildCard
  ): Promise<PostResponse> => {
    const rdsService = new RDSDataService();
  
    const response: PostResponse = {
      recordCreated: 0,
    };
  
    try {
      const sqlStatement = postQuery(tableName, recordIdKey, request);
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
      console.info('rdsResponse: ', JSON.stringify(rdsResponse));
      const unusedResponse = processPostResponse(rdsResponse);
      console.info('unusedResponse: ', JSON.stringify(unusedResponse));
      response.recordCreated = rdsResponse.numberOfRecordsUpdated ?? 0;
    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
  
    return response;
  };
  
  export const putData = async (
    tableName: string,
    recordIdKey: string,
    request: WildCard
  ): Promise<PutResponse> => {
    const rdsService = new RDSDataService();
  
    const response: PutResponse = {
      recordUpdated: 0,
    };
  
    try {
      const sqlStatement = putQuery(tableName, recordIdKey, request);
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
  
      response.recordUpdated = rdsResponse.numberOfRecordsUpdated ?? 0;
    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
  
    return response;
  };
  
  export const deleteDataById = async (
    tableName: string,
    recordIdKey: string,
    id: string
  ): Promise<DeleteResponse> => {
    const rdsService = new RDSDataService();

    const response: DeleteResponse = {
        recordDeleted: 0,
    }
  
    try {
      const sqlStatement = deleteByIdQuery(tableName, recordIdKey, id);
      console.info('sqlStatement: ', sqlStatement);
      const rdsResponse = await rdsService.executeSQLQuery({
        sql: sqlStatement,
      });
      response.recordDeleted = rdsResponse.numberOfRecordsUpdated ?? 0;

    } catch (e: unknown) {
      throw new DbException((e as Error).message);
    }
    return response;
  };
  