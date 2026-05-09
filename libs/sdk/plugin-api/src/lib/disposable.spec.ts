import { describe, it, expect, vi } from 'vitest';
import { DisposableBag } from './disposable';

describe('DisposableBag', () => {
  it('disposes items in reverse order', () => {
    const order: number[] = [];
    const bag = new DisposableBag();
    bag.add(() => order.push(1));
    bag.add(() => order.push(2));
    bag.add(() => order.push(3));
    bag.dispose();
    expect(order).toEqual([3, 2, 1]);
  });

  it('accepts both Disposable objects and plain functions', () => {
    const fn = vi.fn();
    const obj = { dispose: vi.fn() };
    const bag = new DisposableBag();
    bag.add(fn);
    bag.add(obj);
    bag.dispose();
    expect(fn).toHaveBeenCalledOnce();
    expect(obj.dispose).toHaveBeenCalledOnce();
  });

  it('swallows per-item errors so one cleanup never strands others', () => {
    const ok = vi.fn();
    const bag = new DisposableBag();
    bag.add(ok);
    bag.add(() => {
      throw new Error('boom');
    });
    expect(() => bag.dispose()).not.toThrow();
    expect(ok).toHaveBeenCalledOnce();
  });

  it('is idempotent — second dispose is a no-op', () => {
    const fn = vi.fn();
    const bag = new DisposableBag();
    bag.add(fn);
    bag.dispose();
    bag.dispose();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('disposes added-after-disposal items immediately to prevent leaks', () => {
    const fn = vi.fn();
    const bag = new DisposableBag();
    bag.dispose();
    bag.add(fn);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('reports size and disposed state', () => {
    const bag = new DisposableBag();
    expect(bag.size).toBe(0);
    expect(bag.isDisposed).toBe(false);
    bag.add(() => {});
    bag.add(() => {});
    expect(bag.size).toBe(2);
    bag.dispose();
    expect(bag.isDisposed).toBe(true);
    expect(bag.size).toBe(0);
  });
});
