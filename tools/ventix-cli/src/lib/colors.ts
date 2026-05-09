/**
 * Tiny ANSI color helpers. Avoiding `chalk` keeps deps minimal.
 * Auto-detects TTY support; respects NO_COLOR.
 */
const useColor =
  process.stdout.isTTY &&
  !process.env['NO_COLOR'] &&
  process.env['TERM'] !== 'dumb';

const wrap = (open: number) => (s: string): string =>
  useColor ? `\x1b[${open}m${s}\x1b[0m` : s;

export const c = {
  bold:   wrap(1),
  dim:    wrap(2),
  red:    wrap(31),
  green:  wrap(32),
  yellow: wrap(33),
  blue:   wrap(34),
  cyan:   wrap(36),
  gray:   wrap(90),
};
