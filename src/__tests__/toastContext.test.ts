import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../context/ToastContext';

describe('Phase 2 Step 1: Toast Context & Global Notification System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('throws an error if useToast is called outside of ToastProvider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');
  });

  it('exposes all notification dispatcher methods', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(typeof result.current.showToast).toBe('function');
    expect(typeof result.current.success).toBe('function');
    expect(typeof result.current.error).toBe('function');
    expect(typeof result.current.warning).toBe('function');
    expect(typeof result.current.info).toBe('function');
    expect(typeof result.current.removeToast).toBe('function');
    expect(typeof result.current.clearAllToasts).toBe('function');
  });

  it('handles multiple toast dispatches with custom durations and auto-dismisses', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.success('Book successfully added to your cart!', 3000);
      result.current.warning('Only 2 copies remaining in inventory.', 3000);
      result.current.error('Unable to complete checkout request.', 3000);
      result.current.info('Item added to saved wishlist.', 3000);
    });

    // Advance time to verify auto-cleanup
    act(() => {
      vi.advanceTimersByTime(3500);
    });
  });

  it('allows manual toast removal and bulk clearing', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.success('Sample toast 1', 10000);
      result.current.info('Sample toast 2', 10000);
      result.current.clearAllToasts();
    });
  });
});
