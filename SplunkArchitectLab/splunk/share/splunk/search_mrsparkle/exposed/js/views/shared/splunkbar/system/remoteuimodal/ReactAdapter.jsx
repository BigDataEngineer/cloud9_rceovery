import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAdapterBase from 'views/ReactAdapterBase';
import route from 'uri/route';
import RemoteUIModal from './Master';

export default ReactAdapterBase.extend({
    className: 'shared-remote-ui-modal-container',
    moduleId: module.id,
    initialize(options) {
        ReactAdapterBase.prototype.initialize.apply(this, options);
    },

    getComponent() {
        const learnMoreLink = route.docHelp(
            this.model.application.get('root'),
            this.model.application.get('locale'),
            'learnmore.automatic_ui_updates',
        );
        return (
            <Wrapper learnMoreLink={learnMoreLink} />
        );
    },
});

class Wrapper extends Component {

    static propTypes = {
        learnMoreLink: PropTypes.string.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            modalOpen: true,
        };
    }

    handleClose = () => {
        this.setState({
            modalOpen: false,
        });
    }

    render() {
        return (
            <RemoteUIModal
                open={this.state.modalOpen}
                onRequestClose={this.handleClose}
                learnMoreLink={this.props.learnMoreLink}
            />
        );
    }
}
