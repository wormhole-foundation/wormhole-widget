const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const WORK_ROOT = process.env['WORK_ROOT'];

const thirdPartyPkgs = {
  '@mayanfinance/wormhole-sdk-route': 'wormhole-sdk-route',
  '@wormhole-foundation/sdk-definitions-ntt':
    'example-native-token-transfers/sdk/definitions',
  '@wormhole-foundation/sdk-route-ntt':
    'example-native-token-transfers/sdk/route',
  '@wormhole-foundation/sdk-solana-ntt':
    'example-native-token-transfers/solana',
  '@wormhole-foundation/sdk-evm-ntt': 'example-native-token-transfers/evm/ts',
  ntt: 'example-native-token-transfers',
};

if (!WORK_ROOT) {
  console.error(
    'Please export a WORK_ROOT env var containing the absolute path to a directory containing the following repos:\n- wormhole-sdk-ts\n- example-native-token-transfers',
  );
  process.exit(1);
}

const SDK_PATH = path.join(WORK_ROOT, 'wormhole-sdk-ts');

let sdkPackages = {};

for (let packageName in thirdPartyPkgs) {
  const packageDir = thirdPartyPkgs[packageName];
  sdkPackages[packageName] = path.join(WORK_ROOT, packageDir);
}

// This script builds, packs, and installs sdkv2 from a local directory
async function main() {
  const sdkPackageJsonPath = path.join(SDK_PATH, './package.json');

  // Get SDKv2 version
  const { workspaces } = JSON.parse(
    await fs.readFile(sdkPackageJsonPath, 'utf8'),
  );

  // Load all workspace package.json files in parallel
  const workspacePromises = workspaces
    .filter((workspace) => !workspace.includes('examples'))
    .map(async (workspace) => {
      const workspacePackageJson = path.join(
        SDK_PATH,
        workspace,
        'package.json',
      );
      const { name } = JSON.parse(
        await fs.readFile(workspacePackageJson, 'utf8'),
      );
      return { name, path: path.join(SDK_PATH, workspace) };
    });

  const workspaceResults = await Promise.all(workspacePromises);
  workspaceResults.forEach(({ name, path }) => {
    sdkPackages[name] = path;
  });

  const validPackages = Object.entries(sdkPackages).filter(
    ([name]) => !name.includes('examples'),
  );

  const total = validPackages.length * 2;
  let progress = 0;

  // Run first round of npm links concurrently
  const firstLinkPromises = validPackages.map(async ([_, packagePath]) => {
    await execAsync('npm link', { cwd: packagePath });
    progress += 1;
    progressBar(progress, total);
  });

  await Promise.all(firstLinkPromises);

  // Run second round of npm links concurrently
  const secondLinkPromises = validPackages.map(async ([_, packagePath]) => {
    await linkLocalSdkPackages(packagePath);
    progress += 1;
    progressBar(progress, total);
  });

  await Promise.all(secondLinkPromises);

  // Final link
  await execAsync(`npm link ${Object.keys(sdkPackages).join(' ')}`, {
    cwd: path.join(__dirname, '../'),
  });

  console.log('\nLinking complete!');
}

async function linkLocalSdkPackages(dir) {
  const keys = Object.keys(sdkPackages);
  if (keys.length === 0) return;
  await execAsync(`npm link --force ${keys.join(' ')}`, { cwd: dir });
}

function progressBar(completed, total) {
  const percentage = Math.round((completed / total) * 100);
  const barLength = 50;
  const filledLength = Math.round((barLength * percentage) / 100);
  const bar = '░'.repeat(filledLength) + '-'.repeat(barLength - filledLength);
  process.stdout.write(`\rLinking... [${bar}] ${percentage}%`);
}

// Run the main function
main().catch(console.error);
