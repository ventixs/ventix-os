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
export class DisposableBag implements Disposable {
  private items: Disposable[] = [];
  private disposed = false;

  add(item: DisposableInput): void {
    if (this.disposed) {
      // already torn down — dispose immediately rather than leak
      toDisposable(item).dispose();
      return;
    }
    this.items.push(toDisposable(item));
  }

  get size(): number {
    return this.items.length;
  }

  get isDisposed(): boolean {
    return this.disposed;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    while (this.items.length > 0) {
      const item = this.items.pop();
      try {
        item?.dispose();
      } catch (err) {
        // Per ADR-0021: never let one cleanup strand others.
        // eslint-disable-next-line no-console
        console.error('[VENTIX] disposable threw on dispose', err);
      }
    }
  }
}

function toDisposable(d: DisposableInput): Disposable {
  return typeof d === 'function' ? { dispose: d } : d;
}
