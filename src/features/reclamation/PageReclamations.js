import React from 'react';
import { useEffect, useState } from 'react';

import {
  Box,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import { calcLength } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LuBookMarked, LuPlus } from 'react-icons/lu';
import { Link, useSearchParams } from 'react-router-dom';

import {
  DataList,
  DataListCell,
  DataListEmptyState,
  DataListErrorState,
  DataListFooter,
  DataListHeader,
  DataListLoadingState,
  DataListRow,
} from '@/components/DataList';
import { Icon } from '@/components/Icons';
import { Page, PageContent } from '@/components/Page';
import {
  Pagination,
  PaginationButtonFirstPage,
  PaginationButtonLastPage,
  PaginationButtonNextPage,
  PaginationButtonPrevPage,
  PaginationInfo,
} from '@/components/Pagination';
import { ResponsiveIconButton } from '@/components/ResponsiveIconButton';
import { RclamationAction } from '@/features/reclamation/ReclamationActions';
import { useReclamationList } from '@/features/reclamation/service';

export default function PageReclamations() {
  const { t } = useTranslation(['repositories']);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams?.get('page') || 1);

  const pageSize = 20;
  const [reclamation, setReclamation] = useState(null);

  useEffect(() => {
    useReclamationList()
      .then((response) => {
        setReclamation(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
      });
  }, []);
  console.log(reclamation);
  return (
    <Page containerSize="lg">
      <PageContent>
        <HStack mb="4">
          <Heading size="md" flex={1}>
            Reclamation Management
          </Heading>
          <ResponsiveIconButton
            as={Link}
            to="/reclamation/create"
            variant="@primary"
            icon={<LuPlus />}
          >
            add Reclamation
          </ResponsiveIconButton>
        </HStack>

        <DataList>
          <DataListHeader isVisible={{ base: false, md: true }}>
            <DataListCell colName="title" colWidth="2">
              Title
            </DataListCell>
            <DataListCell
              colWidth="4rem"
              isVisible={{ base: false, lg: true }}
              colName="status"
            >
              status
            </DataListCell>
            <DataListCell
              colName="priority"
              isVisible={{ base: false, lg: true }}
            >
              priority
            </DataListCell>
            <DataListCell
              colName="authorities"
              isVisible={{ base: false, lg: true }}
            >
              type Reclamation
            </DataListCell>
            <DataListCell colName="actions" colWidth="4rem" align="flex-end" />
          </DataListHeader>
          {reclamation &&
            reclamation.map((Reclamation) => (
              <DataListRow as={LinkBox} key={Reclamation.id}>
                <DataListCell colWidth={1} colName="title">
                  <Text noOfLines={1} maxW="full" fontWeight="bold">
                    <LinkOverlay
                      as={Link}
                      to={`/reclamation/${Reclamation.id}`}
                    >
                      {Reclamation.titre}
                    </LinkOverlay>
                  </Text>
                </DataListCell>
                <DataListCell
                  colWidth={1}
                  colName="status"
                  isVisible={{ base: false, md: true }}
                >
                  <Text noOfLines={2} fontSize="sm">
                    {Reclamation.statut}
                  </Text>
                </DataListCell>
                <DataListCell
                  colWidth={1}
                  colName="priority"
                  isVisible={{ base: false, md: true }}
                >
                  <Text noOfLines={2} fontSize="sm">
                    {Reclamation.priorite}
                  </Text>
                </DataListCell>
                <DataListCell
                  colWidth={1}
                  colName="description"
                  isVisible={{ base: false, md: true }}
                >
                  <Text noOfLines={2} fontSize="sm">
                    {Reclamation.typeReclamation}
                  </Text>
                </DataListCell>

                <DataListCell colWidth="4rem" colName="actions">
                  <RclamationAction Reclamation={Reclamation} />
                </DataListCell>
              </DataListRow>
            ))}
        </DataList>
      </PageContent>
    </Page>
  );
}
