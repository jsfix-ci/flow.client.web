//@ts-nocheck
import React from "react";
import { useQuery } from "Hooks";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import axios from "axios";
import { useParams, useHistory, Prompt, matchPath } from "react-router-dom";
import { useMutation, queryCache } from "react-query";
import { InlineNotification, Loading, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyState from "Components/EmptyState";
import Header from "../Header";
import { formatErrorMessage } from "@boomerang-io/utils";
import { TaskTemplateStatus } from "Constants";
import { TemplateRequestType } from "../constants";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { appLink, AppPath } from "Config/appConfig";
import styles from "./taskTemplateYamlEditor.module.scss";
import ReactMarkdown from "react-markdown";

// import CodeMirror from "codemirror";
import { Controlled as CodeMirrorReact } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/comment/comment.js";
import "./markdown.css";

const yamlInstructions =
  "# Getting started with a Task\nTasks in Boomerang Flow follow the Tekton Task model along with Kubernetes standards and allow you to define what you want to happen at the execution of the task as well as parameters that are needed.\nFor more information, see [Getting to know Tasks](https://www.useboomerang.io/docs/boomerang-flow/getting-to-know/tasks).\n## Creating a Task in YAML\nThe YAML specification has three important sections to be aware of: metadata, params, and steps. \nIts important to note that the full Tekton task specification is not yet fully supported. We cannot run multi step tasks, nor do we allow resources to be specified. For more information, see [Known Issues and Limitations](https://www.useboomerang.io/docs/boomerang-flow/introduction/known-issues-limitations)\n### Metadata\nThis is the area where we store a series of annotations related to the end user experience.\n### Params\nThis is where you define Parametes that are needed for the exeuction of the task.\n### Steps\nThis is where xyz.";

type TaskTemplateYamlEditorProps = {
  taskTemplates: any[];
  editVerifiedTasksEnabled: any;
};

export function TaskTemplateYamlEditor({ taskTemplates, editVerifiedTasksEnabled }: TaskTemplateYamlEditorProps) {
  const cancelRequestRef = React.useRef();

  const params = useParams();
  const history = useHistory();

  // const [{ data: yamlData, loading: yamlLoading, error: yamlError }, fetchYaml] = useAxios(
  //   {
  //     url: serviceUrl.getTaskTemplateYaml({ id: params.taskId, revision: params.version }),
  //     method: "get",
  //     headers: {
  //       "Content-type": "application/x-yaml",
  //     },
  //   }
  //   // { manual: true }
  // );

  const { data: yamlData, loading: yamlLoading, error: yamlError } = useQuery(
    serviceUrl.getTaskTemplateYaml({ id: params.taskId, revision: params.version })
  );

  const invalidateQueries = () => {
    queryCache.invalidateQueries(serviceUrl.getTaskTemplates());
    queryCache.invalidateQueries(serviceUrl.getFeatureFlags());
  };

  const [uploadTaskYamlMutation, { isLoading: yamlUploadIsLoading }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.putCreateTaskYaml(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: invalidateQueries,
    }
  );

  const [uploadTaskTemplateMutation, { isLoading }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.putCreateTaskTemplate(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: invalidateQueries,
    }
  );

  const [restoreTaskTemplateMutation, { isLoading: restoreIsLoading }] = useMutation(resolver.putRestoreTaskTemplate, {
    onSuccess: invalidateQueries,
  });

  let selectedTaskTemplate = taskTemplates.find((taskTemplate) => taskTemplate.id === params.taskId) ?? {};
  const canEdit = !selectedTaskTemplate?.verified || (editVerifiedTasksEnabled && selectedTaskTemplate?.verified);

  const isActive = selectedTaskTemplate.status === TaskTemplateStatus.Active;
  const invalidVersion = params.version === "0" || params.version > selectedTaskTemplate.currentVersion;

  // Checks if the version in url are a valid one. If not, go to the latest version
  // Need to improve this
  const currentRevision = selectedTaskTemplate?.revisions
    ? invalidVersion
      ? selectedTaskTemplate.revisions[selectedTaskTemplate.currentVersion - 1]
      : selectedTaskTemplate.revisions.find((revision) => revision?.version?.toString() === params.version)
    : {};

  const isOldVersion = !invalidVersion && params.version !== selectedTaskTemplate?.currentVersion?.toString();
  const templateNotFound = !selectedTaskTemplate.id;

  const handleSaveTaskTemplate = async (values, resetForm, requestType, setRequestError, closeModal) => {
    const newRevisions = [].concat(selectedTaskTemplate.revisions);
    const newVersion = selectedTaskTemplate.revisions.length + 1;

    let body = {};
    let newRevisionConfig = {};

    if (requestType === TemplateRequestType.Copy) {
      newRevisionConfig = {
        ...currentRevision,
        version: newVersion,
        changelog: {
          reason: `Copy new version from ${values.currentConfig.version}`,
        },
      };
      newRevisions.push(newRevisionConfig);
      body = {
        ...selectedTaskTemplate,
        currentVersion: newVersion,
        revisions: newRevisions,
      };
    }
    // else if (requestType === TemplateRequestType.Overwrite) {
    //   newRevisionConfig = {
    //     version: selectedTaskTemplate.currentVersion,
    //     image: values.image,
    //     command: values.command,
    //     arguments: values.arguments.trim().split(/\s{1,}/),
    //     config: values.currentConfig,
    //     changelog: {
    //       reason: values.comments,
    //     },
    //   };
    //   newRevisions.splice(selectedTaskTemplate.currentVersion - 1, 1, newRevisionConfig);
    //   body = {
    //     ...selectedTaskTemplate,
    //     name: values.name,
    //     icon: values.icon,
    //     description: values.description,
    //     category: values.category,
    //     enableLifecycle: values.enableLifecycle,
    //     revisions: newRevisions,
    //   };
    // } else {
    //   newRevisionConfig = {
    //     version: newVersion,
    //     image: values.image,
    //     command: values.command,
    //     arguments: values.arguments.trim().split(/\s{1,}/),
    //     config: values.currentConfig,
    //     changelog: {
    //       reason: values.comments,
    //     },
    //   };
    //   newRevisions.push(newRevisionConfig);
    //   body = {
    //     ...selectedTaskTemplate,
    //     name: values.name,
    //     icon: values.icon,
    //     description: values.description,
    //     category: values.category,
    //     enableLifecycle: values.enableLifecycle,
    //     currentVersion: newVersion,
    //     revisions: newRevisions,
    //   };
    // }

    try {
      if (requestType !== TemplateRequestType.Copy) {
        typeof setRequestError === "function" && setRequestError(null);
      }
      let response;
      if (requestType === TemplateRequestType.Copy) {
        response = await uploadTaskTemplateMutation({ body });
      } else if (requestType === TemplateRequestType.Overwrite) {
        response = await uploadTaskYamlMutation({
          id: params.taskId,
          revision: parseInt(params.version),
          body: values.yaml,
        });
      } else {
        response = await uploadTaskYamlMutation({
          id: params.taskId,
          revision: parseInt(params.version) + 1,
          body: values.yaml,
        });
      }
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Updated"}
          // subtitle={`Request to update ${body.name} succeeded`}
          subtitle={`Request to update succeeded`}
          data-testid="create-update-task-template-notification"
        />
      );
      resetForm();
      history.push(
        //@ts-ignore
        appLink.manageTaskTemplateYaml({
          teamId: params?.teamId,
          taskId: params.taskId,
          version: response.data.currentVersion,
        })
      );
      updateTemplateInState(response.data);
      if (requestType !== TemplateRequestType.Copy) {
        typeof closeModal === "function" && closeModal();
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        if (requestType !== TemplateRequestType.Copy) {
          const { title, message: subtitle } = formatErrorMessage({
            error: err,
            defaultMessage: "Request to save task template failed.",
          });
          setRequestError({ title, subtitle });
        } else {
          notify(
            <ToastNotification
              kind="error"
              title={"Update Task Template Failed"}
              subtitle={"Something's Wrong"}
              data-testid="update-task-template-notification"
            />
          );
        }
      }
    }
  };

  const handleputRestoreTaskTemplate = async () => {
    try {
      let response = await restoreTaskTemplateMutation({ id: selectedTaskTemplate.id });
      notify(
        <ToastNotification
          kind="success"
          title={"Task Template Restore"}
          subtitle={`Request to restore ${selectedTaskTemplate.name} succeeded`}
          data-testid="restore-task-template-notification"
        />
      );
      updateTemplateInState(response);
    } catch (err) {
      notify(
        <ToastNotification
          kind="error"
          title={"Restore Task Template Failed"}
          subtitle={"Something's Wrong"}
          data-testid="restore-task-template-notification"
        />
      );
    }
  };

  if (yamlLoading || yamlUploadIsLoading) {
    return <Loading />;
  }

  if (templateNotFound || yamlError)
    return (
      <EmptyState title="Task Template not found" message="Crikey. We can't find the template you are looking for." />
    );

  return (
    <Formik
      initialValues={{
        yaml: yamlData ?? "",
      }}
      enableReinitialize={true}
    >
      {(formikProps) => {
        const { setFieldValue, values, dirty: isDirty, isSubmitting } = formikProps;

        return (
          <div className={styles.container}>
            <Helmet>
              <title>{`Task manager - ${selectedTaskTemplate.name}`}</title>
            </Helmet>
            <Prompt
              message={(location) => {
                let prompt = true;
                const templateMatch = matchPath(location.pathname, {
                  path: AppPath.TaskTemplateEdit,
                });
                if (isDirty && !location.pathname.includes(templateMatch?.params?.id) && !isSubmitting) {
                  prompt = "Are you sure you want to leave? You have unsaved changes.";
                }
                if (
                  isDirty &&
                  templateMatch?.params?.version !== selectedTaskTemplate.currentVersion &&
                  !isSubmitting
                ) {
                  prompt = "Are you sure you want to change the version? Your changes will be lost.";
                }
                return prompt;
              }}
            />
            {(isLoading || restoreIsLoading) && <Loading />}
            <Header
              editVerifiedTasksEnabled={editVerifiedTasksEnabled}
              selectedTaskTemplate={selectedTaskTemplate}
              currentRevision={currentRevision}
              formikProps={formikProps}
              handleputRestoreTaskTemplate={handleputRestoreTaskTemplate}
              handleSaveTaskTemplate={handleSaveTaskTemplate}
              isActive={isActive}
              isLoading={isLoading}
              isOldVersion={isOldVersion}
              cancelRequestRef={cancelRequestRef}
            />
            <div className={styles.content}>
              <section className={styles.taskActionsSection}>
                <p className={styles.description}>Build the definition requirements for this task.</p>
                {!canEdit && (
                  <InlineNotification
                    lowContrast
                    kind="info"
                    title="Verified tasks are not editable"
                    subtitle="Admins can adjust this in global settings"
                  />
                )}
              </section>
              <section className={styles.yamlContainer}>
                <CodeMirrorReact
                  className={styles.codeMirrorContainer}
                  //   editorDidMount={(cmeditor) => {
                  //     editor.current = cmeditor;
                  //     setDoc(cmeditor.getDoc());
                  //   }}
                  value={values.yaml}
                  options={{
                    mode: "yaml",
                    // readOnly: props.readOnly,
                    theme: "material",
                    // extraKeys: {
                    //   "Ctrl-Space": "autocomplete",
                    //   "Ctrl-Q": foldCode,
                    //   "Cmd-/": toggleComment,
                    //   "Shift-Alt-A": blockComment,
                    //   "Shift-Opt-A": blockComment,
                    // },
                    lineWrapping: true,
                    foldGutter: true,
                    lineNumbers: true,
                    gutters: ["CodeMirrorReact-linenumbers", "CodeMirror-foldgutter"],
                    // ...languageParams,
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setFieldValue("yaml", value);
                  }}
                  //TB: trying to get autocomplete to work
                  //   onKeyUp={(cm, event) => {
                  //     if (
                  //       !cm.state.completionActive /*Enables keyboard navigation in autocomplete list*/ &&
                  //       event.keyCode !== 13
                  //     ) {
                  //       /*Enter - do not open autocomplete list just after item has been selected in it*/
                  //       autoComplete(cm);
                  //     }
                  //   }}
                />
                <div className={styles.markdownContainer}>
                  <ReactMarkdown className="markdown-body" source={yamlInstructions} />
                </div>
              </section>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default TaskTemplateYamlEditor;
