"use client";

import { useCallback, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | string | null;
  isSuccess: boolean;
  isError: boolean;
}

export function useAsync<T = unknown, Args extends unknown[] = unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate = false,
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      }));

      try {
        const response = await asyncFunction(...args);
        setState({
          data: response,
          isLoading: false,
          error: null,
          isSuccess: true,
          isError: false,
        });
        return response;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred";
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
          isSuccess: false,
          isError: true,
        });
        throw err;
      }
    },
    [asyncFunction],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
