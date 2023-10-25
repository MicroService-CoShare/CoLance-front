import React from 'react';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuEdit3, LuEye, LuTrash2 } from 'react-icons/lu';
import { Link } from 'react-router-dom';

import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Icon } from '@/components/Icons';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { Reclamation } from '@/features/reclamation/schema';
import { useReclamationRemove } from '@/features/reclamation/service';

export type RclamationActionProps = Omit<MenuProps, 'children'> & {
  Reclamation: Reclamation;
};

export const RclamationAction = ({
  Reclamation,
  ...rest
}: RclamationActionProps) => {
  const { t } = useTranslation(['common', 'repositories']);

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const ReclamationRemove = useReclamationRemove({
    onSuccess: (_) => {
      toastSuccess({
        title: t('repositories:create.feedbacks.updateError.title'),
        description: 'name',
      });
    },
    onError: (_) => {
      toastError({
        title: 'hot haga',
        description: 'hot haga',
      });
    },
  });

  return (
    <Menu placement="left-start" {...rest}>
      <MenuButton as={ActionsButton} isLoading={ReclamationRemove.isLoading} />
      <Portal>
        <MenuList>
          <MenuItem
            as={Link}
            to={`/reclamation/${Reclamation.id}`}
            icon={<Icon icon={LuEye} fontSize="lg" color="gray.400" />}
          >
            {t('repositories:list.actions.view')}
          </MenuItem>
          <MenuItem
            as={Link}
            to={`/reclamation/${Reclamation.id}/update`}
            icon={<Icon icon={LuEdit3} fontSize="lg" color="gray.400" />}
          >
            {t('common:actions.edit')}
          </MenuItem>
          <ConfirmModal
            title={t('repositories:deleteModal.title')}
            message="hot message"
            onConfirm={() => ReclamationRemove.mutate(Reclamation)}
            confirmText={t('common:actions.delete')}
            confirmVariant="@danger"
            size="sm"
          >
            <MenuItem
              icon={<Icon icon={LuTrash2} fontSize="lg" color="gray.400" />}
            >
              {t('common:actions.delete')}
            </MenuItem>
          </ConfirmModal>
        </MenuList>
      </Portal>
    </Menu>
  );
};
