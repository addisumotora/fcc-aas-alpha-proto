import { WildCard } from '../types';
import {
  InsertQueryBuilder,
  // SelectQueryBuilder,
  SetQueryBuilder,
} from '../utilities';

export const getByIdQuery = (
  tableName: string,
  recordIdKey: string,
  recordIdValue: string
): string => `SELECT * FROM ${tableName} WHERE ${recordIdKey} = '${recordIdValue}'`;
/*
export const getQuery = (
  tableName: string,
  selectors: string,
  params?: GetRequestParameters
): string => {
  const processedParams = SelectQueryBuilder(params);

  return `SELECT ${selectors} FROM ${tableName} ${processedParams.values}`;
};
*/
/*
export const getDuplicateQuery = (
  tableName: string,
  params: WildCard
): string => {
  const processedParams = SelectDuplicateQueryBuilder(params);

  return `SELECT * FROM ${tableName} WHERE ${processedParams.values}`;
};
*/
export const postQuery = (
  tableName: string,
  recordIdKey: string,
  params: WildCard
): string => {
  const processedParams = InsertQueryBuilder(params);
  return `INSERT into ${tableName} ${processedParams.fields}\
            VALUES ${processedParams.values}\
            RETURNING ${recordIdKey}`;
};

export const putQuery = (
  tableName: string,
  recordId: string,
  params: WildCard
): string => {
  const { [recordId]: recordIdValue , ...restParams } = params;
  const processedParams = SetQueryBuilder(restParams);
  
  return `UPDATE ${tableName} \
    SET ${processedParams.values} \
    WHERE ${recordId} = '${recordIdValue as string}'`;
};

export const deleteByIdQuery = (
  tableName: string,
  recordIdKey: string,
  recordIdValue: string
): string => `DELETE FROM ${tableName} WHERE ${recordIdKey} = '${recordIdValue}'`;
