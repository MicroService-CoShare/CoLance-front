import React from 'react';

import { Card, CardBody, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/components/FieldInput';
import { FieldTextarea } from '@/components/FieldTextarea';

export const ReclamationForm = () => {
  const { t } = useTranslation(['common', 'repositories']);

  return (
    <Card>
      <CardBody>
        <Stack spacing={4}>
          <FieldInput
            name="titre"
            label="title"
            required={t('repositories:data.name.required')}
          />
          <FieldTextarea
            name="description"
            label="Description"
            required={t('repositories:data.name.required')}
          />
          <FieldInput
            name="statut"
            label="status"
            required={t('repositories:data.name.required')}
          />
          <FieldInput
            name="priorite"
            label="priority"
            required={t('repositories:data.name.required')}
          />
          <FieldTextarea
            name="notesInternes"
            label="notes Interne"
            required={t('repositories:data.name.required')}
          />
          <FieldTextarea
            name="feedbackUtilisateur"
            label="Feedback User"
            required={t('repositories:data.name.required')}
          />
          <FieldInput
            name="typeReclamation"
            label="type Reclamation"
            required={t('repositories:data.name.required')}
          />
        </Stack>
      </CardBody>
    </Card>
  );
};
