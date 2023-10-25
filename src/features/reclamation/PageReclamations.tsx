import React from 'react';

import {
  Box,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuBookMarked, LuPlus } from 'react-icons/lu';
import { Link, useSearchParams } from 'react-router-dom';

import {
  DataList,
  DataListCell,
  DataListEmptyState,
  DataListErrorState,
  DataListFooter,
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
  const reclamation = useReclamationList({
    page: page - 1,
    size: pageSize,
  });

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
          {reclamation.isLoading && <DataListLoadingState />}
          {reclamation.isError && (
            <DataListErrorState
              title="7ot titre"
              retry={() => reclamation.refetch()}
            />
          )}
          {reclamation.isSuccess && !reclamation.data.reclamation.length && (
            <DataListEmptyState />
          )}
          {reclamation.data?.reclamation?.map((Reclamation) => (
            <DataListRow as={LinkBox} key={Reclamation.id}>
              <DataListCell colWidth={1} colName="name">
                <HStack maxW="100%">
                  <Icon
                    icon={LuBookMarked}
                    fontSize="xl"
                    color="gray.400"
                    marginX={1}
                  />
                  <Box minW="0">
                    <Text noOfLines={1} maxW="full" fontWeight="bold">
                      <LinkOverlay
                        as={Link}
                        to={`/reclamation/${Reclamation.id}`}
                      >
                        {Reclamation.name}
                      </LinkOverlay>
                    </Text>

                    <Text
                      noOfLines={1}
                      maxW="full"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: 'gray.300' }}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {Reclamation.link}
                    </Text>
                  </Box>
                </HStack>
              </DataListCell>
              <DataListCell
                colWidth={1}
                colName="description"
                isVisible={{ base: false, md: true }}
              >
                <Text noOfLines={2} fontSize="sm">
                  {Reclamation.description}
                </Text>
              </DataListCell>
              <DataListCell colWidth="4rem" colName="actions">
                <RclamationAction Reclamation={Reclamation} />
              </DataListCell>
            </DataListRow>
          ))}
          <DataListFooter>
            <Pagination
              isLoadingPage={reclamation.isLoadingPage}
              setPage={(newPage) =>
                setSearchParams({ page: newPage.toString() })
              }
              page={page}
              pageSize={pageSize}
              totalItems={reclamation.data?.totalItems}
            >
              <PaginationButtonFirstPage />
              <PaginationButtonPrevPage />
              <PaginationInfo flex="1" />
              <PaginationButtonNextPage />
              <PaginationButtonLastPage />
            </Pagination>
          </DataListFooter>
        </DataList>
      </PageContent>
    </Page>
  );
}
