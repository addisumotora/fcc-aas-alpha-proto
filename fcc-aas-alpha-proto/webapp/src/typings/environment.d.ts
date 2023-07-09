interface Process {
  env: Env
}

interface Env {
  USER_POOL_ID: string,
  USER_POOL_WEB_CLIENT_ID: string,
  OAUTH_DOMAIN: string
}

interface GlobalEnvironment {
  process: Process
}