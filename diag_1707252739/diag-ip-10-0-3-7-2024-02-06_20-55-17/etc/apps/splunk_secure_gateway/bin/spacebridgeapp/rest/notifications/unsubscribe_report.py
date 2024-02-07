"""
Copyright (C) 2009-2021 Splunk Inc. All Rights Reserved.

REST endpoint handler for managing notiification unsubscribes for scheduled report
"""
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

from re import S
import sys
import json
from dataclasses import dataclass, fields
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
from spacebridgeapp.logging import setup_logging
from spacebridgeapp.util import constants
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.util.helper import enforce_required_parameters
from spacebridgeapp.reports.report_helper import ParsedReportId
from spacebridgeapp.rest.services.splunk_service import get_saved_search, persist_saved_search
from spacebridgeapp.alerts.alert_action import MobileAlertAction
from spacebridgeapp.rest.util.utils import SplunkRequest

LOGGER = setup_logging(constants.SPACEBRIDGE_APP_NAME + ".log", "report_notification_unsubscribe")


@dataclass(frozen=True)
class ReportUnsubscribeRequest:
    """Data class for managing notification subscription request for reports"""
    id: str

class ReportNotificationUnsubscribeHandler(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self)

    def post(self, request):
        """ allow a user to unsubscribe to receive notifications from scheduled report """
        LOGGER.info('Received report notification unsubscribe request')
        splunk_request = SplunkRequest.from_request(request)
        enforce_required_parameters([field.name for field in fields(ReportUnsubscribeRequest)], splunk_request.body)
        report_unsubscribe_request = ReportUnsubscribeRequest(splunk_request.body['id'])
        parsed_report_id = ParsedReportId(report_unsubscribe_request.id)
        LOGGER.debug(f"Successfully parsed report_unsubscribe_request={report_unsubscribe_request}")
        response = get_saved_search(splunk_request.user_session_token, splunk_request.user, parsed_report_id.app_name, parsed_report_id.report_name)
        LOGGER.debug("Successfully fetched saved_search")
        alert_action = MobileAlertAction.parse_saved_search_response(response)
        alert_action.remove_user(splunk_request.user)

        status = persist_saved_search(
            splunk_request.system_session_token, 
            parsed_report_id.user, 
            parsed_report_id.app_name, 
            parsed_report_id.report_name,
            alert_action.to_saved_search_format())

        LOGGER.info(f"Completed report notification unsubscribe request with status={status}")

        return {
            'status': status
        }
