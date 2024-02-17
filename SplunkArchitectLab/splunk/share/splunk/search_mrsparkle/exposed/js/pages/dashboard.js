window.__splunkjs_router_disabled__ = true;
window.__splunk_sent_css_telemetry__ = {};
define(['dashboard/requirejsConfig', 'routers/Dashboard', 'util/router_utils'], function (requirejs, DashboardRouter, router_utils) {
    new DashboardRouter();
    router_utils.start_backbone_history();
});