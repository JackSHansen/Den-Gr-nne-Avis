"use client";

import { useCallback, useEffect, useState } from "react";
import { newsletterService } from "../lib/services/newsletterService";
import { MessageResponse, Newsletter } from "../lib/types";

export function useNewsletter(autoFetch = false) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const fetchNewsletters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await newsletterService.getAll();
      setNewsletters(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Kunne ikke hente nyhedsbrevmodtagere";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const data = await newsletterService.getAll();
        if (!ignore) {
          setNewsletters(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : "Kunne ikke hente nyhedsbrevmodtagere";
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [autoFetch]);

  const subscribe = useCallback(
    async (email: string, token?: string): Promise<Newsletter> => {
      setIsSubmitting(true);
      setMutationError(null);
      try {
        const result = await newsletterService.subscribe({ email }, token);
        setNewsletters((prev) => [...prev, result]);
        return result;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke tilmelde nyhedsbrev";
        setMutationError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const unsubscribe = useCallback(
    async (email: string, token?: string): Promise<MessageResponse> => {
      setIsSubmitting(true);
      setMutationError(null);
      try {
        const result = await newsletterService.unsubscribe(
          { email },
          token,
        );
        setNewsletters((prev) => prev.filter((item) => item.email !== email));
        return result;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke afmelde nyhedsbrev";
        setMutationError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const resetMutationError = useCallback(() => {
    setMutationError(null);
  }, []);

  return {
    newsletters,
    data: newsletters,
    isLoading,
    error,
    refetch: fetchNewsletters,
    subscribe,
    unsubscribe,
    isSubmitting,
    mutationError,
    resetMutationError,
  };
}
