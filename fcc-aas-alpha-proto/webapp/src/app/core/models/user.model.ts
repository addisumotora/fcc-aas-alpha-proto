export class User {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  authorities?: string[];

  constructor(idTokenPayload: any) {
    this.email = idTokenPayload['email'];
    this.firstName = idTokenPayload['name'];
    this.lastName = idTokenPayload['family_name'];
    this.username = idTokenPayload['cognito:username'];
    this.authorities = idTokenPayload['cognito:groups'] ?? undefined;
  }
}
