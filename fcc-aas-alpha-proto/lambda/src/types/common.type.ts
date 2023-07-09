export type WildCard = {
    [key: string]: unknown;
  };
  
  export type CustomAuthorizer = {
    requestContext: {
      routeKey?: string;
      authorizer: {
        userCreds: string;
      };
    };
  };
  
  export type ValueOf<T> = T[keyof T];
  