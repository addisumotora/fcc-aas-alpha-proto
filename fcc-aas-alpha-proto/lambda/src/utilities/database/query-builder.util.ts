import { WildCard } from '../../types';
/*
export const SelectQueryBuilder = (
  params: GetRequestParameters | undefined
): Pick<QueryBuilderResponse, 'values'> => {
  let values = '';
  if (params?.query) {
    if (values.includes('WHERE')) values += ' AND ' + params.query;
    else values += ' WHERE ' + params.query;
  }
  if (params?.sort) {
    values += ` ORDER BY ${params.sort} `;
  }
  if (params?.page) {
    const pageSize = params?.limit ? params.limit : DEFAULT_PAGE_SIZE;
    const offset = (params.page - 1) * pageSize;

    values += ` OFFSET ${offset} `;
    values += ` LIMIT ${pageSize} `;
  }

  return { values };
};
*/
/*
export const SelectDuplicateQueryBuilder = (
  params: WildCard
): Pick<QueryBuilderResponse, 'values'> => {
  const valueArray = [];
  for (const [k, v] of Object.entries(params)) {
    if (v) {
      valueArray.push(`${k} = '${v}'`);
    }
  }

  const values = `${valueArray.join(' AND ')}`;

  return { values };
};
*/

export const InsertQueryBuilder = (params: WildCard): QueryBuilderResponse => {
  const fieldArray = [];
  const valueArray = [];
  for (const [k, v] of Object.entries(params)) {
    if (v) {
      fieldArray.push(`${k}`);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      valueArray.push(`'${v}'`);
    }
  }
  const fields = `(${fieldArray.join(',')})`;
  const values = `(${valueArray.join(',')})`;

  return {
    fields,
    values,
  };
};


export const SetQueryBuilder = (
  params: WildCard
): Pick<QueryBuilderResponse, 'values'> => {
  const valueArray = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      valueArray.push(`${k} = '${v}'`);
    }
  }

  const values = `${valueArray.join(',')}`;

  return { values };
};

type QueryBuilderResponse = {
  fields: string;
  values: string;
};
