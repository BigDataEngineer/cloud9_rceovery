import { createRESTURL } from '@splunk/splunk-utils/url';
import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';
import { _ } from '@splunk/ui-utils/i18n';
import querystring from 'querystring';

export const OPT_IN_CONFIG = createRESTURL('properties/web/remoteUI/optInRemoteUI');
export const ALLOW_REMOTE_CONFIG = createRESTURL('properties/web/remoteUI/allowExternalRemote');
export const WEB_SETTINGS_CONFIG = createRESTURL('properties/web/remoteUI');

export function callGetOptInRemoteUIFlag() {
    return fetch(createRESTURL(`${OPT_IN_CONFIG}`), {
        ...defaultFetchInit,
    })
    .then(handleResponse(200))
    .catch(handleError(_('Couldn\'t get remote ui opt in config')));
}

export function callGetAllowExternalRemoteFlag() {
    return fetch(createRESTURL(`${ALLOW_REMOTE_CONFIG}`), {
        ...defaultFetchInit,
    })
    .then(handleResponse(200))
    .catch(handleError(_('Couldn\'t get external remote config')));
}

export function callToggleRemoteUIEnabled(enabled) {
    const data = { optInRemoteUI: enabled, output_mode: 'json' };
    return fetch(createRESTURL(`${WEB_SETTINGS_CONFIG}`), {
        ...defaultFetchInit,
        method: 'POST',
        body: querystring.encode(data),
    })
    .then(handleResponse(200))
    .catch(handleError(_('Couldn\'t update remote ui opt in config')));
}
