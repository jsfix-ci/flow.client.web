import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import NavigateBack from "Components/NavigateBack";
import TimeProgressBar from "Components/TimeProgressBar";
import DiagramApplication from "Utilities/DiagramApplication";
import TaskExecutionInfo from "./TaskExecutionInfo";
import WorkflowSummary from "./WorfklowSummary";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import "./styles.scss";

class Main extends Component {
  static propTypes = {
    dag: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    taskId: PropTypes.string,
    workflowData: PropTypes.object.isRequired,
    workflowExecutionData: PropTypes.object.isRequired,
    updateActiveNode: PropTypes.func,
    version: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication({ dag: props.dag, modelIsLocked: true });
  }

  render() {
    const { workflowExecutionData, taskId, updateActiveNode, location } = this.props;
    const hasStarted =
      workflowExecutionData.steps &&
      workflowExecutionData.steps.find(step => step.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED);
    const selectedTask =
      workflowExecutionData.steps && workflowExecutionData.steps.length && taskId
        ? workflowExecutionData.steps.find(step => step.taskId === taskId)
        : undefined;

    return (
      <div className="c-workflow-execution">
        <nav style={{ marginBottom: "1rem", width: "15rem", gridArea: "header" }}>
          <NavigateBack
            to={location.state ? location.state.fromUrl : "/activity"}
            text={`Back to ${location.state ? location.state.fromText : "Activity"}`}
          />
        </nav>
        <TimeProgressBar updateActiveNode={updateActiveNode} workflowExecution={workflowExecutionData} />
        {
          <div className="c-workflow-diagram-execution">
            {hasStarted ? (
              <DiagramWidget
                className="c-diagram-canvas"
                diagramEngine={this.diagramApp.getDiagramEngine()}
                maxNumberPointsPerLink={0}
                deleteKeys={[]}
                allowLooseLinks={false}
                allowCanvasTranslation={true}
                allowCanvasZoo={false}
              />
            ) : (
              <LoadingAnimation theme="bmrg-white" message="Your workflow will be with you shortly" />
            )}
          </div>
        }
        <aside style={{ gridArea: "sidebar" }}>
          <WorkflowSummary
            workflowData={this.props.workflowData}
            version={this.props.version}
            duration={workflowExecutionData.duration}
            status={workflowExecutionData.status}
          />
          {selectedTask && <TaskExecutionInfo task={selectedTask} flowActivityId={workflowExecutionData.id} />}
        </aside>
      </div>
    );
  }
}

export default withRouter(Main);
