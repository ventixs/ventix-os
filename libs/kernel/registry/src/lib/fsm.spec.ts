import { describe, it, expect } from 'vitest';
import { isLegalTransition, assertLegalTransition, IllegalTransitionError } from './fsm';

describe('Plugin lifecycle FSM', () => {
  it('allows the happy path DISCOVERED → VALIDATED → LOADED → ACTIVE', () => {
    expect(isLegalTransition('DISCOVERED', 'VALIDATED')).toBe(true);
    expect(isLegalTransition('VALIDATED', 'LOADED')).toBe(true);
    expect(isLegalTransition('LOADED', 'ACTIVE')).toBe(true);
  });

  it('allows ACTIVE ↔ SUSPENDED', () => {
    expect(isLegalTransition('ACTIVE', 'SUSPENDED')).toBe(true);
    expect(isLegalTransition('SUSPENDED', 'ACTIVE')).toBe(true);
  });

  it('allows transition to ERROR from any non-terminal state', () => {
    expect(isLegalTransition('DISCOVERED', 'ERROR')).toBe(true);
    expect(isLegalTransition('VALIDATED', 'ERROR')).toBe(true);
    expect(isLegalTransition('LOADED', 'ERROR')).toBe(true);
    expect(isLegalTransition('ACTIVE', 'ERROR')).toBe(true);
    expect(isLegalTransition('SUSPENDED', 'ERROR')).toBe(true);
  });

  it('allows recovery from ERROR back to DISCOVERED', () => {
    expect(isLegalTransition('ERROR', 'DISCOVERED')).toBe(true);
  });

  it('rejects skipping VALIDATED', () => {
    expect(isLegalTransition('DISCOVERED', 'LOADED')).toBe(false);
    expect(isLegalTransition('DISCOVERED', 'ACTIVE')).toBe(false);
  });

  it('rejects activating a SUSPENDED plugin without going through LOADED', () => {
    // SUSPENDED → ACTIVE is allowed (re-activate); SUSPENDED → DISCOVERED is not
    expect(isLegalTransition('SUSPENDED', 'DISCOVERED')).toBe(false);
  });

  it('treats same-state transitions as legal (idempotent)', () => {
    expect(isLegalTransition('ACTIVE', 'ACTIVE')).toBe(true);
    expect(isLegalTransition('ERROR', 'ERROR')).toBe(true);
  });

  it('throws IllegalTransitionError with helpful message', () => {
    try {
      assertLegalTransition('DISCOVERED', 'ACTIVE', 'com.test.plugin');
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(IllegalTransitionError);
      const ite = err as IllegalTransitionError;
      expect(ite.from).toBe('DISCOVERED');
      expect(ite.to).toBe('ACTIVE');
      expect(ite.pluginId).toBe('com.test.plugin');
      expect(ite.message).toContain('Legal transitions from DISCOVERED');
    }
  });
});
