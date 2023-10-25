import React from 'react';

import { Button, ButtonGroup, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Page,
  PageBottomBar,
  PageContent,
  PageTopBar,
} from '@/components/Page';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { ReclamationForm } from '@/features/reclamation/ReclamationForm';
import { useReclamationCreate } from '@/features/reclamation/service';

export default function PageReclamationCreate() {
  const { t } = useTranslation(['common', 'repositories']);
  const navigate = useNavigate();

  const toastError = useToastError();
  const toastSuccess = useToastSuccess();

  const createReclamation = useReclamationCreate({
    onError: (error) => {
      if (error.response) {
        const { title, errorKey } = error.response.data;
        toastError({
          title: t('repositories:create.feedbacks.updateError.title'),
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
        title: t('repositories:create.feedbacks.updateSuccess.title'),
      });
      navigate('../');
    },
  });

  const form = useForm<TODO>({
    id: 'create-Reclamation-form',
    onValidSubmit: (newReclamation) => {
      createReclamation.mutate(newReclamation);
    },
  });

  return (
    <Page containerSize="md" isFocusMode>
      <Formiz connect={form}>
        <form noValidate onSubmit={form.submit}>
          <PageTopBar showBack onBack={() => navigate('/reclamation')}>
            <Heading size="md">Create New Reclamation</Heading>
          </PageTopBar>
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
                isLoading={createReclamation.isLoading}
              >
                Creat Reclamation
              </Button>
            </ButtonGroup>
          </PageBottomBar>
        </form>
      </Formiz>
    </Page>
  );
}
