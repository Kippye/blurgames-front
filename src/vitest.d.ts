/// <reference types="vitest/globals" />
/// <reference types="@vue/test-utils" />
/// <reference types="jsdom" />

// Extend global interface for Vitest mocks
declare global {
  namespace Vi {
    interface MockInstance<T extends (...args: unknown[]) => unknown> {
      mockClear(): this;
      mockReset(): this;
      mockRestore(): void;
      mockImplementation(fn: T): this;
      mockImplementationOnce(fn: T): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockReturnValueOnce(value: ReturnType<T>): this;
      mockResolvedValue(value: Promise<ReturnType<T>>): this;
      mockResolvedValueOnce(value: Promise<ReturnType<T>>): this;
      mockRejectedValue(value: Error): this;
      mockRejectedValueOnce(value: Error): this;
    }
  }
}
