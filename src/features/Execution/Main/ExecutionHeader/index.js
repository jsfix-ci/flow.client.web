import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import FeatureHeader from "Components/FeatureHeader";
import moment from "moment";
import styles from "./executionHeader.module.scss";

ExecutionHeader.propTypes = {
  workflowExecutionData: PropTypes.object.isRequired
};

function ExecutionHeader({ history, workflow, workflowExecutionData }) {
  const { state } = history.location;
  const { teamName, initiatedByUserName, trigger, creationDate } = workflowExecutionData;

  return (
    <FeatureHeader includeBorder>
      <div className={styles.container}>
        <section>
          <div className={styles.subtitle}>
            <Link to={state ? state.fromUrl : "/activity"}>{state ? state.fromText : "Activity"}</Link>
            <p style={{ margin: "0 0.5rem" }}>/</p>
            <p>{workflow.name}</p>
          </div>
          <h1 className={styles.title}>Workflow run detail</h1>
        </section>
        <div className={styles.content}>
          <div className={styles.data}>
            <p className={styles.dataTitle}>Team</p>
            <p className={styles.dataValue}>{teamName}</p>
          </div>
          <div className={styles.data}>
            <p className={styles.dataTitle}>Initiated by</p>
            {initiatedByUserName ? (
              <p className={styles.dataValue}>{initiatedByUserName}</p>
            ) : (
              <span aria-label="robot" aria-hidden={false} role="img">
                {"🤖"}
              </span>
            )}
          </div>
          <div className={styles.data}>
            <p className={styles.dataTitle}>Trigger</p>
            <p className={styles.dataValue}>{trigger}</p>
          </div>
          <div className={styles.data}>
            <p className={styles.dataTitle}>Team</p>
            <p className={styles.dataValue}>{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</p>
          </div>
        </div>
      </div>
    </FeatureHeader>
  );
}

export default withRouter(ExecutionHeader);