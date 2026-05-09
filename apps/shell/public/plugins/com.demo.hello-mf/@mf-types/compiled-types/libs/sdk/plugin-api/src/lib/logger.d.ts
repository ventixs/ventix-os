/**
 * Structured logger. Auto-tagged with the plugin id by the kernel.
 * Forwards to OpenTelemetry in prod, console in dev.
 */
export type LogFields = Readonly<Record<string, unknown>>;
export interface Logger {
    debug(msg: string, fields?: LogFields): void;
    info(msg: string, fields?: LogFields): void;
    warn(msg: string, fields?: LogFields): void;
    error(msg: string, err?: unknown, fields?: LogFields): void;
    /** Returns a child logger with the given fields merged into every log. */
    child(fields: LogFields): Logger;
}
