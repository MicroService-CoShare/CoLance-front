import React from 'react';

import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  HStack,
  Heading,
  IconButton,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuEdit3, LuExternalLink, LuTrash2 } from 'react-icons/lu';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConfirmModal } from '@/components/ConfirmModal';
import { ErrorPage } from '@/components/ErrorPage';
import { Icon } from '@/components/Icons';
import { Page, PageContent, PageTopBar } from '@/components/Page';
import { ResponsiveIconButton } from '@/components/ResponsiveIconButton';
import { useToastError, useToastSuccess } from '@/components/Toast';
import {
  useReclamation,
  useReclamationRemove,
} from '@/features/reclamation/service';
import { Loader } from '@/layout/Loader';

export default function PageReclamation() {
  const { t } = useTranslation(['common', 'repositories']);
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const params = useParams();
  const navigate = useNavigate();
  const Reclamation = useReclamation(Number(params?.id));
  const ReclamationRemove = useReclamationRemove({
    onSuccess: (_, { name }) => {
      toastSuccess({
        title: 'hot titre',
        description: 'hot desciption',
      });
      navigate('/reclamation');
    },
    onError: (_, { name }) => {
      toastError({
        title: 'hot titre',
        description: 'hot desciption',
      });
    },
  });

  return (
    <Page containerSize="lg">
      <PageTopBar zIndex={0} showBack onBack={() => navigate('/reclamation')}>
        <HStack>
          <Box flex={1}>
            {Reclamation.isLoading && (
              <SkeletonText maxW="6rem" noOfLines={2} />
            )}
            {Reclamation.isSuccess && (
              <Heading size="md">{Reclamation.data?.name}</Heading>
            )}
          </Box>
          <ButtonGroup>
            <ResponsiveIconButton as={Link} to="update" icon={<LuEdit3 />}>
              {t('common:actions.edit')}
            </ResponsiveIconButton>

            <ConfirmModal
              title={t('repositories:deleteModal.title')}
              message="hot message confirmation"
              onConfirm={() =>
                Reclamation.data && ReclamationRemove.mutate(Reclamation.data)
              }
              confirmText={t('common:actions.delete')}
              confirmVariant="@danger"
              size="sm"
            >
              <IconButton
                aria-label={t('common:actions.delete')}
                icon={<LuTrash2 />}
                isDisabled={!Reclamation.data}
                isLoading={ReclamationRemove.isLoading}
              />
            </ConfirmModal>
          </ButtonGroup>
        </HStack>
      </PageTopBar>
      <PageContent>
        {Reclamation.isLoading && <Loader />}
        {Reclamation.isError && <ErrorPage />}
        {Reclamation.isSuccess && (
          <Card>
            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {t('repositories:data.name.label')}
                  </Text>
                  <Text>{Reclamation.data?.name}</Text>
                </Box>
                <Box
                  role="group"
                  as="a"
                  href={Reclamation.data?.link}
                  target="_blank"
                >
                  <Text fontSize="sm" fontWeight="bold">
                    {t('repositories:data.link.label')}
                    <Icon marginLeft={1} icon={LuExternalLink} />
                  </Text>

                  <Text _groupHover={{ textDecoration: 'underline' }}>
                    {Reclamation.data?.link}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {t('repositories:data.description.label')}
                  </Text>
                  <Text>
                    {Reclamation.data?.description || <small>-</small>}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        )}
      </PageContent>
    </Page>
  );
}
