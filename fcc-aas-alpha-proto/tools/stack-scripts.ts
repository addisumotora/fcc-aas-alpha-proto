const { spawn, execSync } = require('child_process');
const { Command } = require('commander');

/**
 * Highlight a string (in purple)
 */
const highlight = str => `\x1b[35m${str}\x1b[0m`;

/**
 * Logs a command and runs it
 */
const runCommand = (cmd, options = {}) => {
  console.info(`Running ${highlight(cmd)}`);
  return (execSync(cmd, options) ?? '').toString().trim();
};

/**
 * Get an output from cloudformation
 */
const getOutput = (stackName, region, profile, output) => {
  if (!stackName) throw new Error('stackName is required');
  if (!region) throw new Error('region is required');
  if (!output) throw new Error('output is required');

  let command = `aws cloudformation describe-stacks --stack-name ${stackName} --region ${region} --query "Stacks[0].Outputs[?OutputKey=='${output}'].OutputValue" --output text`;
  if (profile) {
    command.concat(` --profile ${profile}`);
  }

  return runCommand(command);
};

/**
 * Calculate the difference in Minutes and Seconds
 * @param {*} start
 * @param {*} end
 * @returns A string of Minutes and Seconds
 */
const calculateTime = (start, end) => {
  const numSec = Math.round((end - start) / 1000);
  let numMin = 0;
  let retString = '';

  if (numSec > 60) {
    numMin = Math.floor(numSec / 60);
    retString = `${numMin} Minutes and ${numSec % 60} Seconds`;
  } else {
    retString = `${numSec} seconds`;
  }

  return retString;
};

/**
 * Get status from cloudformation stack
 */
const getStackStatus = (options) => {
  console.info('stackname is : ', options.stackName);
  console.info('region is : ', options.region);
  if (!options.stackName) throw new Error('stackName is required');
  if (!options.region) throw new Error('region is required');

  if (stackExists(options.stackName, options.region)) {
    console.info('Stack Exists running status');
    return runCommand(
      `aws cloudformation describe-stacks --stack-name ${options.stackName} --region ${options.region} --query "Stacks[0].StackStatus" --output text`
    );
  }
  return 'NOT_FOUND';
};

/**
 * Create the program
 */
const createProgram = (argv = process.argv) => {
  const program = new Command();
  program.name('fcc-aas-alpha').description('CLI to build and deploy fcc aas alpha components').version('1.0.0');

  /**
   * Runs sam build
   */
  program
    .command('build:sam')
    .description('Build the SAM application')
    .option('-l --log', 'Log output from command')
    .action(async options => {
      buildSAM(options);
    });

  /**
   * Runs sam deploy
   */
  program
    .command('deploy:sam')
    .description('Deploy the SAM application')
    .option('-r --region [string]', 'AWS Region', 'us-east-2')
    .option('-s --stack-name [string]', 'SAM Stack Name', 'fcc-aas-proto')
    .option('-p --profile [string]', 'AWS Profile', '')
    .option('-l --log', 'Log output from command')
    .action(async options => {
      deploySAM(options);
    });

  /**
   * Builds web app
   */
  program
    .command('build:app')
    .description('Builds the web applications')
    .option('-l --log', 'Log output from command')
    .action(async options => {
      buildApp(options);
    });

  /**
   * Deploys web app
   */
  program
    .command('deploy:app')
    .description('Deploys the web application')
    .option('-r --region [string]', 'AWS Region', 'us-east-2')
    .option('-s --stack-name [string]', 'SAM Stack Name', 'fcc-aas-proto')
    .option('-p --profile [string]', 'AWS Profile', '')
    .action(async options => {
      deployApp(options);
    });
    
  /**
   * Runs build and Deploy for both UI and SAM
   */
  program
    .command('build-deploy-all')
    .description('Build the SAM application')
    .option('-r --region [string]', 'AWS Region', 'us-east-2')
    .option('-s --stackname [string]', 'Default StackName', '')
    .option('-e --env [string]', 'Environment', 'local')
    .option('-d --dev [string]', 'Development Stage', false)
    .action(async (options) => {
      const start = new Date();

      // Build and deploy BE
      buildSAM(options);
      await deploySAM(options);;

      // Build and deploy FE
      buildApp(options);
      deployApp(options);;

      // Sync DB changes
      // TODO: create a dbSynce function 
      //await dbSync(stackName, options.region);

      const end = new Date();
      console.info(
        `Task (build-deploy-all) completed in ${highlight(
          calculateMinSec(start, end)
        )}`
      );
    });

  /**
   * Runs sam delete
   */
  program
    .command('teardown')
    .description('Destroys the SAM application')
    .option('-r --region [string]', 'AWS Region', 'us-east-2')
    .option('-s --stack-name [string]', 'SAM Stack Name', 'fcc-aas-proto')
    .option('-p --profile [string]', 'AWS Profile', '')
    .option('-l --log', 'Log output from command')
    .action(async options => {
      destroy(options);
    });

  /** 
   * Initialize environment variables 
  */ 
  program
    .command('init')
    .description('Set Local Encironment Variables')
    .option('-e --env [string]', 'Environment', 'local')
    .option('-s --stackname [string]', 'Default Stack Name', '')
    .option('-r --region [string]', 'Default Region', 'us-east-2')
    .action((options) => {

    });
  /**
   * Show StackName based on environment
   */
  program
    .command('stackName')
    .description('Get Local Stack Name')
    .option('-e --env [string]', 'Environment', 'local')
    .option('-s --stackname [string]', 'Default Stack Name', '')
    .option('-r --region [string]', 'Default Region', 'us-east-2')
    .action((options) => {
      console.info(`Stack Name: ${(options.env)}`);
    });

    /**
   * Initialize the app
   */
  program
    .command('stackstatus')
    .description('Checks the current status of a Cloudformation stack in AWS')
    .option('-d --directory [string]', 'Directory to upload files', 'input')
    .option('-r --region [string]', 'AWS Region', 'us-east-2')
    .option('-s --stackname [string]', 'SAM Stack Name', '')
    .option('-e --env [string]', 'Default Environment', 'local')
    .action(async (options) => {
      console.info('stackname passed into args is : ', options.stackName);
      console.info(
        `Stack: ${highlight(options.stackName)}  Region: ${highlight(
          options.region
        )}  Status: ${highlight(getStackStatus(options))}`
      );
    });

  program.parse(argv);
  return program;
};

/**
 * Calculate the difference in Minutes and Seconds
 * @param {*} start
 * @param {*} end
 * @returns A string of Minutes and Seconds
 */
function calculateMinSec(start, end) {
  const numSec = Math.round((end - start) / 1000);
  let numMin = 0;
  let retString = '';

  if (numSec > 60) {
    numMin = Math.floor(numSec / 60);
    retString = `${numMin} Minutes and ${numSec % 60} Seconds`;
  } else {
    retString = `${numSec} seconds`;
  }

  return retString;
}


const buildSAM = async (options) => {
  const start = new Date();
  runCommand('npm ci', { cwd: './' });
  runCommand('sam validate', { cwd: './' });

  console.info(`Running ${highlight('sam build --parallel')}`);

  const build = spawn('sam', ['build', '--parallel']);

  if(options.log) {
    build.stdout.setEncoding('utf8')
    build.stdout.on('data', data => console.info(data));
  }

  build.on('close', () => {
    const end = new Date();
    console.info(`Done!`);
    console.info(`Task (build:sam) completed in ${highlight(calculateTime(start, end))}`);
  });
  build.on('error', error => console.info(`error: ${error.message}`));
}

const deploySAM = async (options) => {
  const start = new Date();
  const args = [
    `--region=${options.region}`,
    `--stack-name=${options.stackName}`,
    `--no-confirm-changeset`,
    '--no-fail-on-empty-changeset',
    `--resolve-s3`,
  ];

  if(options.profile) {
    args.concat(`--profile=${options.profile}`);
  }

  console.info(`Running ${highlight(`sam deploy ${args.join(' ')}`)}`);
  const deploy = spawn('sam', ['deploy', ...args]);

  if(options.log) {
    deploy.stdout.setEncoding('utf8')
    deploy.stdout.on('data', data => console.info(data));
  }

  deploy.on('close', () => {
    const endpoint = getOutput(options.stackName, options.region, options.profile, 'RESTEndpointProd');
    const end = new Date();
    console.info(`Done!`);
    console.info(``);
    console.info(`========================================`);
    console.info(`API_ENDPOINT: ${endpoint}`);
    console.info(``);
    console.info(`Task (deploy:sam) completed in ${highlight(calculateTime(start, end))}`);
  });
  deploy.on('error', error => console.info(`error: ${error.message}`));
}

const buildApp = async (options) => {
  const start = new Date();
  runCommand('npm ci', { cwd: './webapp' });

  console.info(`Running ${highlight('npm run build')}`);
  const build = spawn('npm', ['run', 'build'], { cwd: './webapp' });

  if(options.log) {
    build.stdout.setEncoding('utf8')
    build.stdout.on('data', data => console.info(data));
  }

  build.on('close', () => {
    const end = new Date();
    console.info(`Done!`);
    console.info(`Task (build:app) completed in ${highlight(calculateTime(start, end))}`);
  });
  build.on('error', error => console.info(`error: ${error.message}`));
}

const deployApp = async (options) => {
  const start = new Date();
  const s3_bucket = getOutput(options.stackName, options.region, options.profile, 'AppS3Bucket');
  const url = getOutput(options.stackName, options.region, options.profile, 'WebEndpoint');
  const distributionId = getOutput(options.stackName, options.region, options.profile, 'CloudFrontDistribution');

  let s3SyncCommand = `aws s3 sync --region ${options.region} dist/fcc-aas-alpha "s3://${s3_bucket}"`;
  let cloudfrontCommand = `aws cloudfront create-invalidation --distribution-id ${distributionId} --region ${options.region} --paths "/*"`;

  if(options.profile) {
    s3SyncCommand.concat(` --profile ${options.profile}`);
    cloudfrontCommand.concat(` --profile ${options.profile}`);
  }

  runCommand(s3SyncCommand, { cwd: './webapp' });
  runCommand(cloudfrontCommand);

  const end = new Date();
  console.info(`Done!`);
  console.info(``);
  console.info(`========================================`);
  console.info(`Cloudfront Web URL: ${url}`);
  console.info(``);
  console.info(`Task (deploy:app) completed in ${highlight(calculateTime(start, end))}`);
}

const destroy = async (options) => {
  const start = new Date();
  const args = [
    `--region=${options.region}`,
    `--stack-name=${options.stackName}`,
    `--no-prompts`,
  ];

  if(options.profile) {
    args.concat(`--profile=${options.profile}`);
  }

  console.info(`Running ${highlight(`sam delete ${args.join(' ')}`)}`);
  const destroy = spawn('sam', ['delete', ...args]);

  if(options.log) {
    destroy.stdout.setEncoding('utf8')
    destroy.stdout.on('data', data => console.info(data));
  }

  destroy.on('close', () => {
    const end = new Date();
    console.info(`Done!`);
    console.info(`Task (teardown) completed in ${highlight(calculateTime(start, end))}`);
  });
  destroy.on('error', error => console.info(`error: ${error.message}`));
}

/**
 * Verify CloudFormation Stack Exists
 */
const stackExists = (stackName, region) => {
    let stackExist = true;
    try {
      const stackInfo = JSON.parse(
        runCommand(
          `aws cloudformation describe-stacks --output json --region ${region}`
        )
      );
      let index = stackInfo.Stacks.findIndex((stack) => {
        return stack.StackName === stackName;
      });
      if (index < 0) {
        stackExist = false;
      }
    } catch (e) {
      //logger.info(`${e}`);
      stackExist = false;
    }
    return stackExist;
  };

/* istanbul ignore next */
if (!module.parent) {
  createProgram(process.argv);
}

module.exports = {
  runCommand,
  getOutput,
  createProgram,
};