import React, { useState } from "react";
import moment from "moment";
import cx from "classnames";
import { settings } from "carbon-components";
import { Box } from "reflexbox";
import {
  ButtonSkeleton,
  ComboBox,
  DataTable,
  DataTableSkeleton,
  Error404,
  ErrorMessage,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  Pagination,
} from "@boomerang-io/carbon-addons-boomerang-react";
import NoTeamsRedirectPrompt from "Components/NoTeamsRedirectPrompt";
import WombatMessage from "Components/WombatMessage";
import DeleteToken from "./DeleteToken";
import CreateToken from "./CreateToken";
import { arrayPagination, sortByProp } from "Utils/arrayHelper";
import { FlowTeam, Token } from "Types";
import { UserRole } from "Constants";
import styles from "./tokensComponent.module.scss";

const { prefix } = settings;

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [DEFAULT_PAGE_SIZE, 20, 50, 100];

const headers = [
  {
    header: "Created By",
    key: "creatorName",
    sortable: true,
  },
  {
    header: "Description",
    key: "description",
    sortable: true,
  },
  {
    header: "Date Created",
    key: "creationDate",
    sortable: true,
  },
  {
    header: "Expires (UTC)",
    key: "expiryDate",
    sortable: true,
  },
  {
    header: "",
    key: "delete",
    sortable: false,
  },
];

interface FeatureLayoutProps {
  children: React.ReactNode;
}

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header
        className={styles.header}
        includeBorder={false}
        header={
          <>
            <HeaderTitle className={styles.headerTitle}>Team Tokens</HeaderTitle>
          </>
        }
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

interface TeamTokensTableProps {
  activeTeam: FlowTeam|null;
  tokens: Token[];
  isLoading: boolean;
  hasError: any;
  setActiveTeam(args: FlowTeam): void;
  deleteToken(tokenId: string): void;
  teams: FlowTeam[];
  userType: string;
}

function TeamTokenComponent({ deleteToken, tokens, hasError, isLoading, activeTeam, setActiveTeam, teams, userType }: TeamTokensTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("DESC");
  const deleteTokenAvailable = userType === UserRole.Admin;

  const renderCell = (tokenItemId: string, cellIndex: number, value: string) => {
    const tokenDetails = tokens.find((token: Token) => token.id === tokenItemId);
    const column = headers[cellIndex];
    switch (column.key) {
      case "creationDate":
      case "expiryDate":
        return (
          <p className={styles.tableTextarea}>
            {value ? moment(value).utc().startOf("day").format("MMMM DD, YYYY") : "---"}
          </p>
        );
      case "delete":
        return tokenDetails && tokenDetails.id && deleteTokenAvailable ? (
          <DeleteToken tokenItem={tokenDetails} deleteToken={deleteToken} />
        ) : (
          ""
        );
      default:
        return <p className={styles.tableTextarea}>{value || "---"}</p>;
    }
  };

  const handlePaginationChange = ({ page, pageSize }: {page:number; pageSize: number;}) => {
    setPage(page);
    setPageSize(pageSize);
  };

  function handleSort(e: any, { sortHeaderKey }: {sortHeaderKey: string}) {
    const order = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortKey(sortHeaderKey);
    setSortDirection(order);
  }

  const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable;

  if (isLoading) {
    return (
      <FeatureLayout>
        <ButtonSkeleton className={styles.buttonSkeleton} small />
        <DataTableSkeleton
          data-testid="token-loading-skeleton"
          className={cx(`${prefix}--skeleton`, `${prefix}--data-table`, styles.tableSkeleton)}
          rowCount={DEFAULT_PAGE_SIZE}
          columnCount={headers.length}
          headers={headers.map((header) => header.header)}
        />
      </FeatureLayout>
    );
  }

  if (hasError) {
    return (
      <FeatureLayout>
        <ErrorMessage />
      </FeatureLayout>
    );
  }

  return (
    <FeatureLayout>
      {
        teams.length === 0 ? (
          <NoTeamsRedirectPrompt />
        ) : (
          <>
            <div className={styles.tokenContainer}>
              <div className={styles.dropdown}>
                <ComboBox
                  data-testid="team-tokens-combobox"
                  id="team-tokens-select"
                  initialSelectedItem={activeTeam?.id ? activeTeam : null}
                  items={sortByProp(teams, "name")}
                  itemToString={(item: { name: string }) => item?.name ?? ""}
                  label="Teams"
                  onChange={({ selectedItem }: { selectedItem: FlowTeam }) => {
                    setActiveTeam(selectedItem);
                  }}
                  placeholder="Select a team"
                  shouldFilterItem={({ item, inputValue }: { item: any; inputValue: string }) =>
                    item?.name?.toLowerCase()?.includes(inputValue.toLowerCase())
                  }
                />
              </div>
              {(activeTeam?.id ) && (
                <CreateToken activeTeam={activeTeam}/>
              )}
            </div>
            {tokens?.length > 0 ? (
              <>
                <DataTable
                  rows={arrayPagination(tokens, page, pageSize, sortKey, sortDirection)}
                  sortRow={(rows: any) => sortByProp(rows, sortKey, sortDirection.toLowerCase())}
                  headers={headers}
                  render={({ rows, headers, getHeaderProps }: {rows: any, headers: Array<{header:string; key: string; sortable: boolean;}>, getHeaderProps: any}) => (
                    <TableContainer>
                      <Table isSortable>
                        <TableHead>
                          <TableRow className={styles.tableHeadRow}>
                            {headers.map((header: {header:string; key: string; sortable: boolean;}) => (
                              <TableHeader
                                id={header.key}
                                {...getHeaderProps({
                                  header,
                                  className: `${styles.tableHeadHeader} ${styles[header.key]}`,
                                  isSortable: header.sortable,
                                  onClick: handleSort,
                                })}
                                isSortHeader={sortKey === header.key}
                                sortDirection={sortDirection}
                              >
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody className={styles.tableBody}>
                          {rows.map((row: any) => (
                            <TableRow key={row.id} >
                              {row.cells.map((cell: any, cellIndex: number) => (
                                <TableCell key={cell.id} style={{ padding: "0" }}>
                                  <div className={styles.tableCell}>{renderCell(row.id, cellIndex, cell.value)}</div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                />
                <Pagination
                  onChange={handlePaginationChange}
                  page={page}
                  pageSize={pageSize}
                  pageSizes={PAGE_SIZES}
                  totalItems={tokens?.length}
                />
              </>
            ) : 
            activeTeam ? (
              <>
                <DataTable
                  rows={tokens}
                  headers={headers}
                  render={({ headers }: {headers: Array<{header:string; key: string; sortable: boolean;}>}) => (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow className={styles.tableHeadRow}>
                            {headers.map((header: {header:string; key: string; sortable: boolean;}) => (
                              <TableHeader
                                key={header.key}
                                id={header.key}
                                className={`${styles.tableHeadHeader} ${styles[header.key]}`}
                              >
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
                  )}
                />
                <Error404 title="No teams tokens found" header={null} message={null} theme="boomerang" />
              </>
            ) : (
              <Box maxWidth="20rem" margin="0 auto">
                <WombatMessage title="Select a team" />
              </Box>
                
            )}
          </>
        )
      }
    </FeatureLayout>
  );

}

export default TeamTokenComponent;
