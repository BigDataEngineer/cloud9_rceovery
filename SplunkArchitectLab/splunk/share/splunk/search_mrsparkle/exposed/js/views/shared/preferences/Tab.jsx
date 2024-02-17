import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import Clickable from '@splunk/react-ui/Clickable';
import { createDOMID } from '@splunk/ui-utils/id';
import { createTestHook } from 'util/test_support';
import styled from 'styled-components';
import css from './Tab.pcssm';

const StyledClickable = styled(Clickable)`
    display: block;
    position: relative;
    padding: 10px;
    padding-bottom: 7px;
    border-radius: 4px;
    background-color: ${
        props => (props.isActive ?
            css.buttonActive :
            'transparent')
    };

    &:hover {
        background-color: ${css.buttonActive}
    }
`;

class Tab extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
        this.buttonId = createDOMID('button');
    }

    handleClick() {
        this.props.onClick(this.props.value);
    }

    render() {
        const {
            show,
            icon,
            label,
            ...otherProps
        } = this.props;

        const props = {
            onClick: this.handleClick,
            isActive: show,
            id: this.buttonId,
        };

        return (
            <div
                className={css.tab}
                {...createTestHook(module.id)}
                {...omit(otherProps, 'onClick', 'value')}
            >
                <StyledClickable aria-label={label} {...props}>{icon}</StyledClickable>
                <label htmlFor={this.buttonId} className={css.label}>{label}</label>
            </div>
        );
    }
}

Tab.propTypes = {
    show: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Tab;