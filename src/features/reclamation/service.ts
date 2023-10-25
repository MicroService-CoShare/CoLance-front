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

const reclamation_BASE_URL = '/reclamation/api/reclamations/';

const reclamationKeys = createQueryKeys('reclamationService', {
  reclamation: (params: { page?: number; size?: number }) => [params],
  Reclamation: (params: { id?: number }) => [params],
  ReclamationForm: null,
});

export const useReclamationList = async () => {
  const response = await Axios.get(reclamation_BASE_URL);
  return response;
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
    Pick<
      Reclamation,
      | 'titre'
      | 'description'
      | 'statut'
      | 'priorite'
      | 'notesInternes'
      | 'feedbackUtilisateur'
      | 'typeReclamation'
    >
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const response = await Axios.post(reclamation_BASE_URL, payload);
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
    Pick<Reclamation, 'id'>
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (Reclamation) => {
      await Axios.delete(`/reclamation/api/reclamations/${Reclamation.id}`);
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
