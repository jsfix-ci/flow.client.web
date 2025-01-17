import portForwardMap from "../setupPortForwarding";
import axios, { CancelToken } from "axios";
import { HttpMethod } from "Constants";

// Set defaults, change them if Cypress is NOT defined
export let CORE_SERVICE_ENV_URL = "/api";
let REACT_APP_PORT_FORWARD;

if (typeof Cypress === "undefined") {
  if (process.env.NODE_ENV === "production" && window._SERVER_DATA) {
    CORE_SERVICE_ENV_URL = window._SERVER_DATA.CORE_SERVICE_ENV_URL;
  }

  REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;
}

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL : "/api";

/**
 * if port forwarding is enabled, then check to see if service is in config map
 * If it is, set the url request to be only the serviceContextPath so the url is relativet to the root of the app
 * CRA will proxy the request as seen in setupProxy.js
 * @param {string} baseUrl - base of the serivce url
 * @param {sring} serviceContextPath - additional path for the service context e.g. /admin
 */
function determineUrl(baseUrl, serviceContextPath) {
  if (REACT_APP_PORT_FORWARD && portForwardMap[serviceContextPath]) {
    return serviceContextPath;
  } else {
    return baseUrl + serviceContextPath;
  }
}

export const BASE_URL = determineUrl(PRODUCT_SERVICE_ENV_URL, "/workflow");
export const BASE_CORE_URL = CORE_SERVICE_ENV_URL;
export const BASE_CORE_USERS_URL = determineUrl(CORE_SERVICE_ENV_URL, "/users");

export const serviceUrl = {
  deleteArchiveTaskTemplate: ({ id }) => `${BASE_URL}/tasktemplate/${id}`,
  deleteCancelWorkflow: ({ executionId }) => `${BASE_URL}/activity/${executionId}/cancel`,
  deleteToken: ({ tokenId }) => `${BASE_URL}/token/${tokenId}`,
  deleteSchedule: ({ scheduleId }) => `${BASE_URL}/schedules/${scheduleId}`,
  getActivitySummary: ({ query }) => `${BASE_URL}/activity/summary${query ? "?" + query : ""}`,
  getActivity: ({ query }) => `${BASE_URL}/activity${query ? "?" + query : ""}`,
  getActionsSummary: ({ query }) => `${BASE_URL}/actions/summary${query ? "?" + query : ""}`,
  getActions: ({ query }) => `${BASE_URL}/actions${query ? "?" + query : ""}`,
  getDefaultQuotas: () => `${BASE_URL}/quotas/default`,
  getFeatureFlags: () => `${BASE_URL}/features`,
  getFlowTeamUsers: ({ teamId }) => `${BASE_URL}/teams/${teamId}/members`,
  getFlowNavigation: ({ query }) => `${BASE_URL}/navigation${query}`,
  getGlobalConfiguration: () => `${BASE_URL}/config`,
  getGlobalProperty: ({ id }) => `${BASE_URL}/config/${id}`,
  getGlobalTokens: () => `${BASE_URL}/tokens/global-tokens`,
  getInsights: ({ query }) => `${BASE_URL}/insights${query ? "?" + query : ""}`,
  getManageTeamsCreate: () => `${BASE_URL}/manage/teams`,
  getManageTeam: ({ teamId }) => `${BASE_URL}/manage/teams/${teamId}`,
  getManageTeamUser: ({ teamId }) => `${BASE_URL}/manage/teams/${teamId}/members`,
  getManageTeamLabels: ({ teamId }) => `${BASE_URL}/manage/teams/${teamId}/labels`,
  getManageTeams: ({ query }) => `${BASE_URL}/manage/teams${query ? "?" + query : ""}`,
  getManageUsers: ({ query }) => `${BASE_URL}/manage/users${query ? "?" + query : ""}`,
  // getPlatformConfig: () => `${BASE_CORE_USERS_URL}/navigation`,
  getPlatformConfig: () => `${BASE_URL}/users/navigation`,
  getSchedules: ({ query }) => `${BASE_URL}/schedules${query ? "?" + query : ""}`,
  getSchedule: ({ scheduleId }) => `${BASE_URL}/schedules/${scheduleId}`,
  getSchedulesCalendars: ({ query }) => `${BASE_URL}/schedules/calendar${query ? "?" + query : ""}`,
  getScheduleCalendar: ({ scheduleId, query }) =>
    `${BASE_URL}/schedules/${scheduleId}/calendar${query ? "?" + query : ""}`,
  getScheduleCronValidation: ({ expression }) => `${BASE_URL}/schedules/validate/cron?cron=${expression}`,
  getSystemWorkflows: () => `${BASE_URL}/workflows/system`,
  getTaskTemplates: ({ query }) => `${BASE_URL}/tasktemplate${query ? "?" + query : ""}`,
  getTaskTemplateYaml: ({ id, revision }) => `${BASE_URL}/tasktemplate/${id}/yaml${revision ? `/${revision}` : ""}`,
  getTeams: () => `${BASE_URL}/teams`,
  getTeamProperty: ({ teamId, configurationId }) => `${BASE_URL}/teams/${teamId}/properties/${configurationId}`,
  getTeamProperties: ({ id }) => `${BASE_URL}/teams/${id}/properties`,
  getTeamQuotas: ({ id }) => `${BASE_URL}/teams/${id}/quotas`,
  getTeamTokens: ({ teamId }) => `${BASE_URL}/tokens/team/${teamId}`,
  getUsers: () => `${BASE_URL}/users`,
  getUser: ({ userId }) => `${BASE_URL}/users/${userId}`,
  getUserTeams: ({ email }) => `${BASE_URL}/teams?userEmail=${email}`,
  // getUserProfile: () => `${BASE_CORE_USERS_URL}/profile`,
  getUserProfile: () => `${BASE_URL}/users/profile`,
  getUserProfileImage: ({ userEmail }) => `${BASE_CORE_USERS_URL}/image/${userEmail}`,
  getUserWorkflows: () => `${BASE_URL}/workflows/user`,
  getWorkflow: ({ id }) => `${BASE_URL}/workflow/${id}`,
  getWorkflowChangelog: ({ workflowId, query }) =>
    `${BASE_URL}/workflow/${workflowId}/changelog${query ? "?" + query : ""}`,
  getWorkflowImport: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  getWorkflowExecution: ({ executionId }) => `${BASE_URL}/activity/${executionId}`,
  getWorkflowExecutionLog: ({ flowActivityId, flowTaskId }) =>
    `${BASE_URL}/activity/${flowActivityId}/log/${flowTaskId}`,
  getWorkflowRevision: ({ workflowId, revisionNumber }) =>
    `${BASE_URL}/workflow/${workflowId}/revision${revisionNumber ? "/" + revisionNumber : ""}`,
  getWorkflowSummary: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/summary`,
  getWorkflowSchedules: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/schedules`,
  getWorkflowSchedulesCalendar: ({ workflowId, query }) =>
    `${BASE_URL}/workflow/${workflowId}/schedules/calendar${query ? "?" + query : ""}`,
  getWorkflowTaskTemplates: ({ workflowId }) => `${BASE_URL}/tasktemplate/workflow/${workflowId}`,
  patchUpdateWorkflowProperties: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/properties`,
  patchUpdateWorkflowSummary: () => `${BASE_URL}/workflow`,
  patchSchedule: ({ scheduleId }) => `${BASE_URL}/schedules/${scheduleId}`,
  postCreateWorkflow: () => `${BASE_URL}/workflow`,
  postCreateWorkflowRevision: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/revision`,
  postCreateWorkflowToken: ({ workflowId, label }) => `${BASE_URL}/workflow/${workflowId}/token?label=${label}`,
  postDuplicateWorkflow: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/duplicate`,
  postExecuteWorkflow: ({ id }) => `${BASE_URL}/execute/${id}`,
  postGlobalToken: () => `${BASE_URL}/global-token`,
  postSchedule: () => `${BASE_URL}/schedules`,
  postTeamToken: () => `${BASE_URL}/team-token`,
  postValidateYaml: () => `${BASE_URL}/tasktemplate/yaml/validate`,
  // postImportWorkflow: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  // putActivationApp: () => `${BASE_CORE_USERS_URL}/register`,
  putActivationApp: () => `${BASE_URL}/users/register`,
  putRestoreTaskTemplate: ({ id }) => `${BASE_URL}/tasktemplate/${id}/activate`,
  putTaskTemplateYaml: ({ id, revision, comment }) =>
    `${BASE_URL}/tasktemplate/${id}/yaml${`/${revision}`}${comment ? "?" + comment : ""}`,
  putTeamQuotasDefault: ({ id }) => `${BASE_URL}/teams/${id}/quotas/default`,
  putWorkflowAction: () => `${BASE_URL}/actions/action`,
  resourceApproverGroups: ({ teamId, groupId }) =>
    `${BASE_URL}/teams/${teamId}/approvers${groupId ? "/" + groupId : ""}`,
  resourceManageUser: ({ userId }) => `${BASE_URL}/manage/users/${userId}`,
  resourceSettings: () => `${BASE_URL}/settings`,
  workflowAvailableParameters: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/available-parameters`,
  workflowTemplates: () => `${BASE_URL}/workflows/template`,
};

export const cancellableResolver = ({ url, method, body, headers, ...config }) => {
  // Create a new CancelToken source for this request
  const source = CancelToken.source();
  const promise = axios({
    ...config,
    headers,
    method,
    url,
    data: body,
    cancelToken: source.token,
  });
  return { promise, cancel: () => source.cancel("cancel") };
};

export const resolver = {
  query: (url) => () => axios.get(url).then((response) => response.data),
  postMutation: (request) => axios.post(request),
  patchMutation: (request) => axios.patch(request),
  putMutation: (request) => axios.put(request),
  deleteApproverGroup: ({ teamId, groupId }) => axios.delete(serviceUrl.resourceApproverGroups({ teamId, groupId })),
  deleteArchiveTaskTemplate: ({ id }) => axios.delete(serviceUrl.deleteArchiveTaskTemplate({ id })),
  deleteCancelWorkflow: ({ executionId }) => axios.delete(serviceUrl.deleteCancelWorkflow({ executionId })),
  deleteGlobalPropertyRequest: ({ id }) => axios.delete(serviceUrl.getGlobalProperty({ id })),
  deleteTeamPropertyRequest: ({ teamId, configurationId }) =>
    axios.delete(serviceUrl.getTeamProperty({ teamId, configurationId })),
  deleteWorkflow: ({ id }) => axios.delete(serviceUrl.getWorkflow({ id })),
  deleteSchedule: ({ scheduleId }) => axios.delete(serviceUrl.deleteSchedule({ scheduleId })),
  deleteToken: ({ tokenId }) => axios.delete(serviceUrl.deleteToken({ tokenId })),
  patchGlobalPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalProperty({ id }), body, method: HttpMethod.Patch }),
  patchManageTeamUser: ({ teamId, body }) => axios.patch(serviceUrl.getManageTeamUser({ teamId }), body),
  patchManageTeamLabels: ({ teamId, body }) => axios.patch(serviceUrl.getManageTeamLabels({ teamId }), body),
  patchManageUser: ({ body, userId }) =>
    cancellableResolver({ url: serviceUrl.resourceManageUser({ userId }), body, method: HttpMethod.Patch }),
  patchSchedule: ({ scheduleId, body }) => axios.patch(serviceUrl.patchSchedule({ scheduleId }), body),
  postValidateYaml: ({ body }) =>
    axios({
      method: HttpMethod.Post,
      url: serviceUrl.postValidateYaml(),
      data: body,
      headers: {
        "content-type": "application/x-yaml",
      },
    }),
  patchTeamPropertyRequest: ({ teamId, configurationId, body }) =>
    cancellableResolver({
      url: serviceUrl.getTeamProperty({ teamId, configurationId }),
      body,
      method: HttpMethod.Patch,
    }),
  patchUpdateWorkflowSummary: ({ body }) => axios.patch(serviceUrl.patchUpdateWorkflowSummary(), body),
  patchUpdateWorkflowProperties: ({ workflowId, body }) =>
    axios.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId }), body),
  // postAddService: ({ body }) =>
  //   cancellableResolver({ url: serviceUrl.postAddService(), body, method: HttpMethod.Post }),
  postApproverGroupRequest: ({ body, teamId }) =>
    cancellableResolver({
      url: serviceUrl.resourceApproverGroups({ teamId }),
      body,
      method: HttpMethod.Post,
    }),
  postCreateTemplate: ({ body }) => axios.post(serviceUrl.workflowTemplates(), body),
  postCreateWorkflow: ({ body }) => axios.post(serviceUrl.postCreateWorkflow(), body),
  postCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.post(serviceUrl.postCreateWorkflowRevision({ workflowId }), body),
  postCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates({ query: null }), body, method: HttpMethod.Post }),

  postDuplicateWorkflow: ({ workflowId }) => axios.post(serviceUrl.postDuplicateWorkflow({ workflowId })),
  postTemplateWorkflow: ({ workflowId, body }) => axios.post(serviceUrl.postDuplicateWorkflow({ workflowId }), body),
  postGlobalToken: ({ body }) =>
    cancellableResolver({ url: serviceUrl.postGlobalToken(), body, method: HttpMethod.Post }),
  postTeamToken: ({ body }) => cancellableResolver({ url: serviceUrl.postTeamToken(), body, method: HttpMethod.Post }),
  putCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates({ query: null }), body, method: HttpMethod.Put }),
  putCreateTaskYaml: ({ id, revision, comment, body }) =>
    cancellableResolver({
      url: serviceUrl.putTaskTemplateYaml({ id, revision, comment }),
      body,
      method: HttpMethod.Put,
      headers: { "content-type": "application/x-yaml" },
    }),
  postCreateTeam: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getManageTeamsCreate(), body, method: HttpMethod.Post }),
  postExecuteWorkflow: ({ id, properties }) =>
    cancellableResolver({
      url: serviceUrl.postExecuteWorkflow({ id }),
      body: { properties },
      method: HttpMethod.Post,
    }),
  postGlobalPropertyRequest: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalConfiguration(), body, method: HttpMethod.Post }),
  postImportWorkflow: ({ query, body }) => axios.post(serviceUrl.getWorkflowImport({ query }), body),
  postSchedule: ({ body }) => axios.post(serviceUrl.postSchedule(), body),
  postTeamPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamProperties({ id }), body, method: HttpMethod.Post }),
  postWorkflowAvailableParameters: ({ workflowId, body }) =>
    axios.post(serviceUrl.workflowAvailableParameters({ workflowId }), body),
  putActivationApp: ({ body }) =>
    axios({
      method: HttpMethod.Put,
      url: serviceUrl.putActivationApp(),
      data: body,
      validateStatus: (status) => status >= 200 && status < 300,
    }),
  putApproverGroupRequest: ({ body, teamId }) =>
    cancellableResolver({
      url: serviceUrl.resourceApproverGroups({ teamId }),
      body,
      method: HttpMethod.Put,
    }),
  putPlatformSettings: ({ body }) => axios.put(serviceUrl.resourceSettings(), body),
  putRestoreTaskTemplate: ({ id }) => axios.put(serviceUrl.putRestoreTaskTemplate({ id })),
  putUpdateTeam: ({ teamId, body }) => axios.put(serviceUrl.getManageTeam({ teamId }), body),
  putTeamQuotasDefault: ({ id }) =>
    cancellableResolver({ url: serviceUrl.putTeamQuotasDefault({ id }), method: HttpMethod.Put }),
  putTeamQuotas: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamQuotas({ id }), body, method: HttpMethod.Put }),
  putWorkflowAction: ({ body }) =>
    cancellableResolver({ url: serviceUrl.putWorkflowAction(), body, method: HttpMethod.Put }),
};
