"use client";

import { useCallback, useEffect, useState } from "react";
import { productService } from "../lib/services/productService";
import {
  CreateProductInput,
  MessageResponse,
  Product,
  ProductSummary,
  UpdateProductInput,
} from "../lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke hente produkter";
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
        const data = await productService.getAll();
        if (!ignore) {
          setProducts(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Kunne ikke hente produkter";
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
    products,
    data: products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(slug?: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setProduct(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getBySlug(slug);
      setProduct(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke hente produkt";
      setError(msg);
      setProduct(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const data = await productService.getBySlug(slug!);
        if (!ignore) {
          setProduct(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Kunne ikke hente produkt";
          setError(msg);
          setProduct(null);
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
  }, [slug]);

  return {
    product,
    data: product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

export function useProductsByCategory(categorySlug?: string | null) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(categorySlug));
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!categorySlug) {
      setProducts([]);
      setIsLoading(false);
      return [];
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getByCategorySlug(categorySlug);
      setProducts(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Kunne ikke hente produkter for kategorien";
      setError(msg);
      setProducts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    if (!categorySlug) {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const data = await productService.getByCategorySlug(categorySlug!);
        if (!ignore) {
          setProducts(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : "Kunne ikke hente produkter for kategorien";
          setError(msg);
          setProducts([]);
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
  }, [categorySlug]);

  return {
    products,
    data: products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProductMutations() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(
    async (data: CreateProductInput, token?: string): Promise<Product> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await productService.create(data, token);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke oprette produkt";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (
      id: number | string,
      data: UpdateProductInput,
      token?: string,
    ): Promise<Product> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await productService.update(id, data, token);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke opdatere produkt";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteProduct = useCallback(
    async (
      id: number | string,
      token?: string,
    ): Promise<MessageResponse> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await productService.delete(id, token);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Kunne ikke slette produkt";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    isSubmitting,
    error,
    resetError,
  };
}
