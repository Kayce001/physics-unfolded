// Cross-platform entry point for the upstream physics and equation-link checks.
import { spawnSync } from 'node:child_process';
const chapters = 'kinematics newton circular energy momentum oscillations rotation fluids electrostatics gauss potential capacitors circuits magnetism induction'.split(' ');
for (const file of [...chapters.map(c => `${c}/checks.mjs`), 'equations/check.mjs']) {
  const result = spawnSync(process.execPath, [file], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(file, result.stdout, result.stderr);
    process.exit(result.status || 1);
  }
  console.log(`PASS ${file}`);
}
