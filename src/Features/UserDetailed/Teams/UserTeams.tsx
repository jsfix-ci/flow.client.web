import React from "react";
import { Helmet } from "react-helmet";
import sortBy from "lodash/sortBy";
import {
  Search,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Link } from "react-router-dom";
import EmptyState from "Components/EmptyState";
import ms from "match-sorter";
import { appLink } from "Config/appConfig";
import { FlowUser } from "Types";
import styles from "./UserTeams.module.scss";

interface UserTeamsProps {
  user: FlowUser;
}

function UserTeams({ user }: UserTeamsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userTeams = user.userTeams ?? [];
  const filteredTeamsList = searchQuery ? ms(userTeams, searchQuery, { keys: ["name"] }) : userTeams;

  return (
    <section aria-label={`${user.name} Teams`} className={styles.container}>
      <Helmet>
        <title>{`Teams - ${user.name}`}</title>
      </Helmet>
      <section className={styles.actionsContainer}>
        <div className={styles.leftActions}>
          <p className={styles.featureDescription}>{`These are ${user.name}'s teams`}</p>
          <p className={styles.teamCountText}>
            Showing {filteredTeamsList.length} team{filteredTeamsList.length !== 1 ? "s" : ""}
          </p>
          <Search
            labelText="teams search"
            id="teams-search"
            placeHolderText="Search for a team"
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
      </section>
      {filteredTeamsList.length > 0 ? (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Name</StructuredListCell>
              <StructuredListCell head />
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {sortBy(filteredTeamsList, "name").map((team) => (
              <StructuredListRow key={team.id}>
                <StructuredListCell>{team.name}</StructuredListCell>
                <StructuredListCell>
                  <Link
                    className={styles.viewTeamLink}
                    to={{
                      pathname: appLink.team({ teamId: team.id }),
                      state: { fromUser: { name: user.name, id: user.id } },
                    }}
                  >
                    View team
                  </Link>
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

export default UserTeams;
