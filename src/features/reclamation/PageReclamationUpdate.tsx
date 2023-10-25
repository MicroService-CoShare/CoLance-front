import React from 'react';

import {
  Button,
  ButtonGroup,
  Heading,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorPage } from '@/components/ErrorPage';
import {
  Page,
  PageBottomBar,
  PageContent,
  PageTopBar,
} from '@/components/Page';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { ReclamationForm } from '@/features/reclamation/ReclamationForm';
import {
  useReclamationFormQuery,
  useReclamationUpdate,
} from '@/features/reclamation/service';
import { Loader } from '@/layout/Loader';

export default function PageReclamationUpdate() {
  const { t } = useTranslation(['common', 'repositories']);

  const params = useParams();
  const navigate = useNavigate();
  const Reclamation = useReclamationFormQuery(Number(params?.id));

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const updateReclamation = useReclamationUpdate({
    onError: (error) => {
      if (error.response) {
        const { title, errorKey } = error.response.data;
        toastError({
          title: t('repositories:update.feedbacks.updateError.title'),
          description: title,
        });
        if (errorKey === 'name_already_used') {
          form.setErrors({
            name: t('repositories:data.name.alreadyUsed'),
          });
        }
      }
    },
    onSuccess: () => {
      toastSuccess({
        title: t('repositories:update.feedbacks.updateSuccess.title'),
      });
      navigate(-1);
    },
  });

  const form = useForm({
    ready: !Reclamation.isLoading,
    initialValues: Reclamation.data,
    onValidSubmit: (values) => {
      if (!Reclamation.data?.id) return null;
      updateReclamation.mutate({
        id: Reclamation.data?.id,
        ...values,
      });
    },
  });

  return (
    <Page containerSize="md" isFocusMode>
      <PageTopBar showBack onBack={() => navigate(-1)}>
        {Reclamation.isLoading && <SkeletonText maxW="6rem" noOfLines={2} />}
        {Reclamation.isSuccess && (
          <>
            <Heading size="md">{Reclamation.data?.name}</Heading>
            <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.300' }}>
              {t('repositories:data.id.label')}: {Reclamation.data?.id}
            </Text>
          </>
        )}
      </PageTopBar>
      {Reclamation.isLoading && <Loader />}
      {Reclamation.isError && <ErrorPage />}
      {Reclamation.isSuccess && (
        <Formiz connect={form}>
          <form noValidate onSubmit={form.submit}>
            <PageContent>
              <ReclamationForm />
            </PageContent>
            <PageBottomBar>
              <ButtonGroup justifyContent="space-between">
                <Button onClick={() => navigate('/reclamation')}>
                  {t('common:actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="@primary"
                  isLoading={updateReclamation.isLoading}
                >
                  {t('repositories:update.action.save')}
                </Button>
              </ButtonGroup>
            </PageBottomBar>
          </form>
        </Formiz>
      )}
    </Page>
  );
}
