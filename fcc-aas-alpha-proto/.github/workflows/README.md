# GitHub Actions CI/CD

The `deploy-ENV.yaml` files define CI/CD pipelines which will orchestrate the required tests, scans, and deployments on pushes to one of our mainline branches.

The following environment variables are required to be configured in the [Actions configuration](https://github.com/OctoConsulting/fcc-aas-alpha/settings/secrets/actions) (Settings > Security > Secrets and variables > Actions > New repository secret):

- `AWS_ACCESS_KEY_ID`: AWS access key for an account with sufficient privileges
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for an account with sufficient privileges
- `SONAR_TOKEN_LAMBDA`: token for your SonarCloud project for the Lambda code
- `SONAR_TOKEN_WEBAPP`: token for your SonarCloud project for the Webapp code
