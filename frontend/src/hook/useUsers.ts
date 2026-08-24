"use client";

import { useCallback, useEffect, useState } from "react";
import { userService } from "../lib/services/userService";
import {
  CreateUserInput,
  MessageResponse,
  UpdateUserInput,
  User,
  UserDetail,
  UserSummary,
} from "../lib/types";

export function useUsers() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke hente brugere";
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
        const data = await userService.getAll();
        if (!ignore) {
          setUsers(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Kunne ikke hente brugere";
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
    users,
    data: users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
}

export function useUser(id?: number | string | null) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getById(id);
      setUser(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke hente bruger";
      setError(msg);
      setUser(null);
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
        const data = await userService.getById(id!);
        if (!ignore) {
          setUser(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : "Kunne ikke hente bruger";
          setError(msg);
          setUser(null);
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
    user,
    data: user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}

export function useUserMutations() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(
    async (data: CreateUserInput): Promise<User> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await userService.create(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Kunne ikke oprette bruger";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const updateUser = useCallback(
    async (
      id: number | string,
      data: UpdateUserInput,
    ): Promise<User> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await userService.update(id, data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Kunne ikke opdatere bruger";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteUser = useCallback(
    async (id: number | string): Promise<MessageResponse> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await userService.delete(id);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Kunne ikke slette bruger";
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
    createUser,
    updateUser,
    deleteUser,
    isSubmitting,
    error,
    resetError,
  };
}
