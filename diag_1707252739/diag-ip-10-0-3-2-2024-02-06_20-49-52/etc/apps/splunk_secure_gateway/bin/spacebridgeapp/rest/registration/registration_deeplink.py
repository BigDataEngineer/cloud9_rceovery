"""
Copyright (C) 2009-2021 Splunk Inc. All Rights Reserved.

REST endpoint handler for the Spacebridge registration v2 process
"""
import logging
from http import HTTPStatus
import sys
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.private.sodium_client import SodiumClient
from spacebridgeapp.util import constants
from spacebridgeapp.util.constants import DEVICE_NAME, DEVICE_TYPE, DEVICE_ID, APP_ID, PLATFORM, \
    ENCRYPT_PUBLIC_KEY, SIGN_PUBLIC_KEY, SESSION, USER, AUTHTOKEN, SYSTEM_AUTHTOKEN
from spacebridgeapp.rest.registration.util import is_valid_session_token, generate_jwt_token
from spacebridgeapp.util.config import secure_gateway_config as config
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from cloudgateway.registration_v2 import start_registration
from spacebridge_protocol.http_pb2 import EnvironmentMetadata
from splapp_protocol.request_pb2 import VersionGetResponse
from spacebridgeapp.request.version_request_processor import build_version_get_response
from spacebridgeapp.rest.deep_link_dashboard import hash_b58_encrypt, generate_deep_link, \
    build_dashboard_deep_link_query_params
from spacebridgeapp.logging import setup_logging

from splunk import rest

DEVICE_REGISTRATION_ATTRS = [DEVICE_NAME, DEVICE_TYPE, DEVICE_ID, APP_ID, PLATFORM]
DEVICE_PUBLIC_KEYS_ATTRS = [ENCRYPT_PUBLIC_KEY, SIGN_PUBLIC_KEY]


class RegistrationDeeplinkHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling REST RegistrationV2 endpoint. Subclasses the spacebridge_app
    BaseRestHandler. This multiple inheritance is an unfortunate neccesity based on the way
    Splunk searches for PersistentServerConnectionApplications
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self)
        self.base_uri = rest.makeSplunkdUri()
        self.log = setup_logging(constants.SPACEBRIDGE_APP_NAME + ".log", "return_auth_code")
        self.async_client_factory = AsyncClientFactory(self.log, self.base_uri)

    def post(self, request):
        user = request[SESSION][USER]
        session_token = request[SESSION][AUTHTOKEN]
        system_authtoken = request[SYSTEM_AUTHTOKEN]

        return handle_initiate_registration(self.log, user, session_token, system_authtoken, self.async_client_factory)


def handle_initiate_registration(log: logging.Logger,
                                 user, session_token, system_authtoken, async_client_factory):
    """
    Handler for the initial RegistrationV2 call. This function validates session token, generates a JWT token,
    and retrieves an auth code to send to frontend
    :param log:
    :param user: User provided by rest handler
    :param session_token:
    :param system_authtoken: System-level access token for writing to the kvstore
    :param async_client_factory:
    :return: auth_code
    """

    log.info("Starting handle initiate registration")
    splapp_encryption_context = SplunkEncryptionContext(system_authtoken,
                                                        constants.SPACEBRIDGE_APP_NAME,
                                                        SodiumClient(log.getChild("sodium_client")))

    valid_request = is_valid_session_token(user, session_token)
    if valid_request:
        try:
            credentials = generate_jwt_token(log, user, system_authtoken)
        except Exception as e:
            log.info("Failed to fetch jwt token for user={} with message={}".format(user, str(e)))
            jwt_error_message = 'Registration Error: Failed to fetch jwt token for user={}, with error={}'.format(user, str(e))
            return {
                'payload': {
                    'message': jwt_error_message,
                },
                'status': HTTPStatus.UNPROCESSABLE_ENTITY,
            }

    version_get_response = VersionGetResponse()
    registration_info = {
        constants.REGISTRATION_TYPE: VersionGetResponse.SAML,
        constants.REGISTRATION_METHOD: VersionGetResponse.IN_APP
    }
    try:
        version_get_response = build_version_get_response(log,
                                                          session_token=session_token, app_id="",
                                                          device_name="", async_client_factory=async_client_factory,
                                                          registration_info=registration_info)
    except Exception as e:
        log.exception("exception fetching environment metadata")

    env_metadata = EnvironmentMetadata(serializedMetadata=version_get_response.SerializeToString())

    log.debug("Starting registration for user={}".format(user))
    auth_code = start_registration(splapp_encryption_context, credentials, env_metadata, config)

    log.debug("Done registration for user={}".format(user))

    server_id = hash_b58_encrypt(splapp_encryption_context.sign_public_key())
    deep_link_query_params = build_dashboard_deep_link_query_params(encryption_context=splapp_encryption_context,
                                                                    user=user,
                                                                    asset_type=constants.DASHBOARD)
    deep_link = generate_deep_link(server_id=server_id,
                                   auth_code=auth_code,
                                   query_params=deep_link_query_params)
    return {constants.STATUS: HTTPStatus.OK,
            constants.PAYLOAD: {constants.DEEPLINK: deep_link, constants.AUTH_CODE: auth_code}}
