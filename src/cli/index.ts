import { init } from './init.js';

const VERSION = '0.1.0';

const HELP = `
  RadTools - Visual Dev Tools for Next.js + Tailwind v4

  Usage:
    radtools <command> [options]

  Commands:
    init          Install RadTools in your Next.js project

  Options:
    --help, -h    Show this help message
    --version, -v Show version number

  Examples:
    npx radtools init
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (args.includes('--help') || args.includes('-h') || !command) {
    console.log(HELP);
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log(`radtools v${VERSION}`);
    process.exit(0);
  }

  switch (command) {
    case 'init':
      await init();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
