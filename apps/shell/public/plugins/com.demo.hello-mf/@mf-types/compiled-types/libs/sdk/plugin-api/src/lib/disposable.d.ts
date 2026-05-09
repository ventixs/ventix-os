/**
 * Lifecycle primitives. Conforms to ADR-0011 (disposables auto-bound).
 *
 * Every kernel-provided registration call returns a Disposable AND auto-binds
 * it to the ambient bag in PluginContext. On deactivate the kernel disposes
 * the bag in reverse order, swallowing per-item errors. Authors who want
 * fine-grained control hold the returned Disposable themselves.
 */
export interface Disposable {
    dispose(): void;
}
export type DisposableInput = Disposable | (() => void);
/**
 * Collects disposables and disposes them in reverse order. Errors from any
 * single dispose call are swallowed (logged via console.error) so one broken
 * cleanup never strands others — fault isolation per ADR-0021.
 *
 * @example
 * const bag = new DisposableBag();
 * bag.add(ctx.events.on('foo', handler));
 * bag.add(() => clearInterval(timer));
 * bag.dispose(); // releases everything in reverse order
 */
export declare class DisposableBag implements Disposable {
    private items;
    private disposed;
    add(item: DisposableInput): void;
    get size(): number;
    get isDisposed(): boolean;
    dispose(): void;
}
