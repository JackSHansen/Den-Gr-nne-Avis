"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryService } from "../lib/services/categoryService";
import { Category } from "../lib/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke hente kategorier";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await categoryService.getAll();
        if (!ignore) {
          setCategories(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Kunne ikke hente kategorier";
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
  }, []);

  return {
    categories,
    data: categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}

export function useCategory(id?: number | string | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) {
      setCategory(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getById(id);
      setCategory(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke hente kategori";
      setError(msg);
      setCategory(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const data = await categoryService.getById(id!);
        if (!ignore) {
          setCategory(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Kunne ikke hente kategori";
          setError(msg);
          setCategory(null);
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
  }, [id]);

  return {
    category,
    data: category,
    isLoading,
    error,
    refetch: fetchCategory,
  };
}
