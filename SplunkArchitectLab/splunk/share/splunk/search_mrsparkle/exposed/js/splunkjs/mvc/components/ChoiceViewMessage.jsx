import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@splunk/react-ui/Tooltip';
import Warning from '@splunk/react-icons/Warning';
import Clickable from '@splunk/react-ui/Clickable';
import { createTestHook } from 'util/test_support';
import _ from 'underscore';

const ActionRequired = () => (
    <Fragment>
        <Clickable
            {...createTestHook('action-required-input')}
            style={{ paddingRight: '5px' }}
        >
            <Warning size={0.85} style={{ color: 'red' }} />
        </Clickable>
        <b>{_('Action Required: ').t()}</b>
    </Fragment>
);

const ChoiceViewMessage = ({
    message,
    toolTipMessage,
    actionRequired,
}) => (
    <Tooltip
        content={toolTipMessage}
        {...createTestHook(module.id)}
    >
        <span>
            <div
                style={{
                    fontSize: 13,
                    height: 0,
                    overflow: 'visible',
                }}
            >{actionRequired ? <ActionRequired /> : null}{message}</div>
        </span>
    </Tooltip>
);

ChoiceViewMessage.propTypes = {
    message: PropTypes.string,
    toolTipMessage: PropTypes.string,
    actionRequired: PropTypes.bool,
};

ChoiceViewMessage.defaultProps = {
    message: '',
    toolTipMessage: '',
    actionRequired: false,
};

export default ChoiceViewMessage;
