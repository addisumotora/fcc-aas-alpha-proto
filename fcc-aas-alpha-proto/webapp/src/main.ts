import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';
import { environment } from './app/environment';

const awsconfig = {
  userPoolId: environment.USER_POOL_ID,
  userPoolWebClientId: environment.USER_POOL_WEB_CLIENT_ID,
  oauth: {
    domain: environment.OAUTH_DOMAIN,
    scope: ['phone', 'email', 'profile', 'openid'],
    redirectSignIn: `${window.location.origin}`,
    redirectSignOut: `${window.location.origin}`,
    responseType: 'code',
  },
};
Amplify.configure(awsconfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
