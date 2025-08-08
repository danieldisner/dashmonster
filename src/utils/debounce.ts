/**
 * Utility functions for debouncing and throttling operations
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedFunction = function (this: unknown, ...args: any[]) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T & { cancel: () => void };

  debouncedFunction.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let lastCallTime = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: unknown, ...args: any[]) {
    const now = Date.now();

    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      return func.apply(this, args);
    }
  } as T;
}

/**
 * Creates a request deduplicator to prevent duplicate API calls
 */
export class RequestDeduplicator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, request: () => Promise<T>): Promise<T> {
    // Check if there's already a pending request for this key
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Create and store the new request
    const promise = request()
      .finally(() => {
        // Clean up when the request completes
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  cancel(key: string) {
    this.pendingRequests.delete(key);
  }

  cancelAll() {
    this.pendingRequests.clear();
  }
}

/**
 * Hook for managing async operations with loading states
 */
export function useAsyncOperation() {
  const operations = new Set<string>();

  const isOperationPending = (operationId: string) => {
    return operations.has(operationId);
  };

  const executeOperation = async <T>(
    operationId: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    if (operations.has(operationId)) {
      throw new Error(`Operation ${operationId} is already in progress`);
    }

    operations.add(operationId);
    try {
      return await operation();
    } finally {
      operations.delete(operationId);
    }
  };

  return {
    isOperationPending,
    executeOperation
  };
}
