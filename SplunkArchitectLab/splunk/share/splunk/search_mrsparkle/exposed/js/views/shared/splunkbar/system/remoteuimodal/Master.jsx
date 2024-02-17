import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sprintf } from '@splunk/ui-utils/format';
import { _ } from '@splunk/ui-utils/i18n';
import Modal from '@splunk/react-ui/Modal';
import Button from '@splunk/react-ui/Button';
import Message from '@splunk/react-ui/Message';
import Switch from '@splunk/react-ui/Switch';
import P from '@splunk/react-ui/Paragraph';
import Link from '@splunk/react-ui/Link';
import ControlGroup from '@splunk/react-ui/ControlGroup';

import { callGetOptInRemoteUIFlag, callToggleRemoteUIEnabled } from './Utils';

class RemoteUIModal extends Component {

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        learnMoreLink: PropTypes.string.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            errorMessage: '',
            isWorking: false,
        };
    }

    componentDidMount = () => {
        callGetOptInRemoteUIFlag()
        .then((response) => {
            this.setState({
                enabled: response,
            });
        })
        .catch(() => {
            this.setState({
                enabled: false,
            });
        });
    }

    handleEnableClick = () => {
        this.setState(prevState => ({
            enabled: !prevState.enabled,
            errorMessage: '',
        }));
    };

    handleSave = () => {
        this.setState({
            isWorking: true,
        });
        callToggleRemoteUIEnabled(this.state.enabled)
        .then(() => {
            this.setState({
                isWorking: false,
                errorMessage: '',
            });
            this.props.onRequestClose();
        })
        .catch((response) => {
            this.setState({
                isWorking: false,
                errorMessage: response.message,
            });
        });
    };

    render() {
        return (
            <Modal
                onRequestClose={this.props.onRequestClose}
                open={this.props.open}
                style={{ width: '500px' }}
                data-test-name="remote-ui-modal"
            >
                <Modal.Header
                    title={sprintf(_('Enable Remote UI'))}
                    onRequestClose={this.props.onRequestClose}
                />
                <Modal.Body>
                    {this.state.errorMessage && (
                        <Message type="error">{this.state.errorMessage}</Message>
                    )}
                    <P>
                        {_(`Enable automatic UI updates to receive the most recent
                           UI features and bug fixes for supported Splunk Web pages.
                           You can disable automatic UI updates to revert to the
                           default Splunk Web UI at any time. `)}
                        <Link
                            to={this.props.learnMoreLink}
                            openInNewContext
                            data-test-name="optInRemoteUI.learnMoreLink"
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {_('Learn More')}
                        </Link>
                    </P>
                    <ControlGroup
                        label={_('Enable automatic UI updates')}
                        labelWidth={177}
                        data-test-name="remote-ui-group"
                        style={{ marginTop: '15px' }}
                    >
                        <Switch
                            value={'enabled'}
                            onClick={this.handleEnableClick}
                            selected={this.state.enabled}
                            appearance="toggle"
                            data-test-name="remote-ui-switch"
                        />
                    </ControlGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        data-test-name="remote-ui-cancel-btn"
                        onClick={this.props.onRequestClose}
                        label={_('Cancel')}
                        autoFocus
                    />
                    <Button
                        appearance="primary"
                        data-test-name="remote-ui-save-btn"
                        disabled={this.state.isWorking}
                        onClick={this.handleSave}
                        label={this.state.isWorking ? _('Working...') : _('Save')}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}


export default RemoteUIModal;
