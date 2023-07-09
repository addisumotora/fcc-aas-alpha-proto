export const ID_TOKEN_MOCK = {
  signInUserSession: {
    idToken: {
      payload: {
        name: 'John',
        family_name: 'Doe',
        authorities: [],
        email: 'test@tmail.com',
        'cognito:username': 'test',
        'cognito:groups': ['']
      }
    }
  }
}