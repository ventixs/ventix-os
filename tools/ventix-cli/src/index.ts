/**
 * `ventix` CLI entry point. Conforms to ADR-0022 — uses node:util.parseArgs
 * instead of oclif for Phase 0. Phase 1 migration is mechanical.
 */
import { parseArgs } from 'node:util';
import { c } from './lib/colors';
import { createPlugin } from './commands/create-plugin';
import { validate } from './commands/validate';
import { doctor } from './commands/doctor';
import { build } from './commands/build';
import { dev } from './commands/dev';

const argv = process.argv.slice(2);

const HELP = `
${c.bold('ventix')} ${c.gray('— VENTIX OS command-line tool')}

${c.bold('USAGE')}
  ventix ${c.cyan('<command>')} [options]

${c.bold('COMMANDS')}
  ${c.cyan('create plugin')}    scaffold a new plugin under libs/plugins/
  ${c.cyan('validate')}         validate a ventix.plugin.json against RFC-0001
  ${c.cyan('build')}            deploy a plugin to the shell (one-shot)
  ${c.cyan('dev')}              watch a plugin and auto-deploy on save
  ${c.cyan('doctor')}           print environment + workspace health
  ${c.cyan('help')}             this message

${c.bold('EXAMPLES')}
  ${c.dim('# scaffold:')}
  ventix create plugin --id com.acme.crm-plus --name "Acme CRM+"

  ${c.dim('# build (one-shot):')}
  ventix build --plugin com.acme.crm-plus

  ${c.dim('# dev (watch mode):')}
  ventix dev --plugin com.acme.crm-plus

  ${c.dim('# validate manifest:')}
  ventix validate                        ${c.gray('# uses ./ventix.plugin.json')}

  ${c.dim('# doctor:')}
  ventix doctor
`;

async function main(): Promise<number> {
  if (argv.length === 0 || argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    process.stdout.write(HELP);
    return 0;
  }

  try {
    const [verb, ...rest] = argv;
    switch (verb) {
      case 'create': {
        const subject = rest[0];
        if (subject !== 'plugin') {
          throw new Error(`[UNKNOWN_SUBJECT] ${subject ?? ''}\n  fix: try 'ventix create plugin --id <reverse.dns>'`);
        }
        const { values } = parseArgs({
          args: rest.slice(1),
          options: {
            id:      { type: 'string' },
            name:    { type: 'string' },
            vendor:  { type: 'string' },
            license: { type: 'string' },
          },
        });
        if (!values['id']) {
          throw new Error("[ARG_REQUIRED] --id is required\n  fix: ventix create plugin --id com.acme.foo");
        }
        await createPlugin({
          id: values['id'] as string,
          ...(values['name']    !== undefined ? { name:    values['name']    as string } : {}),
          ...(values['vendor']  !== undefined ? { vendor:  values['vendor']  as string } : {}),
          ...(values['license'] !== undefined ? { license: values['license'] as string } : {}),
        });
        return 0;
      }
      case 'validate': {
        const positionals = rest.filter((s) => !s.startsWith('--'));
        await validate({ ...(positionals[0] ? { path: positionals[0] } : {}) });
        return 0;
      }
      case 'build': {
        const { values } = parseArgs({
          args: rest,
          options: { plugin: { type: 'string' } },
        });
        await build({ ...(values['plugin'] ? { plugin: values['plugin'] as string } : {}) });
        return 0;
      }
      case 'dev': {
        const { values } = parseArgs({
          args: rest,
          options: { plugin: { type: 'string' } },
        });
        await dev({ ...(values['plugin'] ? { plugin: values['plugin'] as string } : {}) });
        return 0;
      }
      case 'doctor': {
        await doctor();
        return 0;
      }
      default:
        process.stderr.write(`${c.red('error')}: unknown command '${verb}'\n\n${HELP}`);
        return 2;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`${c.red('error')}: ${message}\n`);
    return 2;
  }
}

main().then((code) => process.exit(code));
