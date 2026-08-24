"use client";

import { useCallback, useEffect, useState } from "react";
import { commentService } from "../lib/services/commentService";
import {
  Comment,
  CommentWithUser,
  CreateCommentInput,
  MessageResponse,
} from "../lib/types";

export function useComments(productId?: number | string | null) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(productId));
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!productId) {
      setComments([]);
      setIsLoading(false);
      return [];
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await commentService.getByProductId(productId);
      setComments(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Kunne ikke hente kommentarer";
      setError(msg);
      setComments([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const data = await commentService.getByProductId(productId!);
        if (!ignore) {
          setComments(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : "Kunne ikke hente kommentarer";
          setError(msg);
          setComments([]);
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
  }, [productId]);

  return {
    comments,
    data: comments,
    isLoading,
    error,
    refetch: fetchComments,
  };
}

export function useCommentMutations() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(
    async (
      data: CreateCommentInput,
      token?: string,
    ): Promise<Comment> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await commentService.create(data, token);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke oprette kommentar";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteComment = useCallback(
    async (
      id: number | string,
      token?: string,
    ): Promise<MessageResponse> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await commentService.delete(id, token);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke slette kommentar";
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
    addComment,
    deleteComment,
    isSubmitting,
    error,
    resetError,
  };
}
