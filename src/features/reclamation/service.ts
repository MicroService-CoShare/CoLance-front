import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';

import {
  Reclamation,
  ReclamationList,
  zReclamation,
  zReclamationList,
} from '@/features/reclamation/schema';

type ReclamationMutateError = ApiErrorResponse & {
  errorKey: 'name_already_used';
};

const reclamation_BASE_URL = '/reclamation';

const reclamationKeys = createQueryKeys('reclamationService', {
  reclamation: (params: { page?: number; size?: number }) => [params],
  Reclamation: (params: { id?: number }) => [params],
  ReclamationForm: null,
});

export const useReclamationList = (
  { page = 0, size = 10 } = {},
  queryOptions: UseQueryOptions<ReclamationList> = {}
) => {
  const query = useQuery({
    queryKey: reclamationKeys.reclamation({ page, size }).queryKey,
    queryFn: async () => {
      const response = await Axios.get(reclamation_BASE_URL, {
        params: { page, size, sort: 'id,desc' },
      });
      return zReclamationList().parse({
        reclamation: response.data,
        totalItems: response.headers?.['x-total-count'],
      });
    },
    keepPreviousData: true,
    ...queryOptions,
  });

  const reclamation = query.data?.reclamation;
  const totalItems = query.data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / size);
  const hasMore = page + 1 < totalPages;
  const isLoadingPage = query.isFetching;

  return {
    reclamation,
    totalItems,
    hasMore,
    totalPages,
    isLoadingPage,
    ...query,
  };
};

export const useReclamation = (
  ReclamationId?: number,
  queryOptions: UseQueryOptions<Reclamation> = {}
) => {
  return useQuery({
    queryKey: reclamationKeys.Reclamation({ id: ReclamationId }).queryKey,
    queryFn: async () => {
      const response = await Axios.get(
        `${reclamation_BASE_URL}/${ReclamationId}`
      );
      return zReclamation().parse(response.data);
    },

    enabled: !!ReclamationId,
    ...queryOptions,
  });
};

export const useReclamationFormQuery = (
  ReclamationId?: number,
  queryOptions: UseQueryOptions<Reclamation> = {}
) =>
  useReclamation(ReclamationId, {
    queryKey: reclamationKeys.ReclamationForm.queryKey,
    staleTime: Infinity,
    cacheTime: 0,
    ...queryOptions,
  });

export const useReclamationUpdate = (
  config: UseMutationOptions<
    Reclamation,
    AxiosError<ReclamationMutateError>,
    Reclamation
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const response = await Axios.put(reclamation_BASE_URL, payload);
      return zReclamation().parse(response.data);
    },
    {
      ...config,
      onSuccess: (data, payload, ...args) => {
        queryClient.cancelQueries(reclamationKeys.reclamation._def);
        queryClient
          .getQueryCache()
          .findAll(reclamationKeys.reclamation._def)
          .forEach(({ queryKey }) => {
            queryClient.setQueryData<ReclamationList | undefined>(
              queryKey,
              (cachedData) => {
                if (!cachedData) return;
                return {
                  ...cachedData,
                  content: (cachedData.reclamation || []).map((Reclamation) =>
                    Reclamation.id === data.id ? data : Reclamation
                  ),
                };
              }
            );
          });
        queryClient.invalidateQueries(reclamationKeys.reclamation._def);
        queryClient.invalidateQueries(
          reclamationKeys.Reclamation({ id: payload.id })
        );

        config?.onSuccess?.(data, payload, ...args);
      },
    }
  );
};

export const useReclamationCreate = (
  config: UseMutationOptions<
    Reclamation,
    AxiosError<ReclamationMutateError>,
    Pick<Reclamation, 'name' | 'link' | 'description'>
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const response = await Axios.post('/reclamation', payload);
      return zReclamation().parse(response.data);
    },
    {
      ...config,
      onSuccess: async (...args) => {
        await queryClient.invalidateQueries(reclamationKeys.reclamation._def);
        await config?.onSuccess?.(...args);
      },
    }
  );
};

export const useReclamationRemove = (
  config: UseMutationOptions<
    void,
    AxiosError<ApiErrorResponse>,
    Pick<Reclamation, 'id' | 'name'>
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (Reclamation) => {
      await Axios.delete(`/reclamation/${Reclamation.id}`);
    },
    {
      ...config,
      onSuccess: async (...args) => {
        await queryClient.invalidateQueries(reclamationKeys.reclamation._def);
        await config?.onSuccess?.(...args);
      },
    }
  );
};
