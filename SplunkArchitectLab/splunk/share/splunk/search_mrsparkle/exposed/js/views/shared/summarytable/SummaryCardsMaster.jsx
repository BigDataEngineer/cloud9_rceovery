import React from 'react';
import ReactAdapterBase from 'views/ReactAdapterBase';
import BackboneProvider from 'dashboard/components/shared/BackboneProvider';
import reactRender from 'util/react_render';
import SummaryCardsLayout from './SummaryCardsLayout';

export default ReactAdapterBase.extend({
    getComponent(args) {
        const props = { ...args, ...this };
        return (
            <BackboneProvider store={{}}>
                <SummaryCardsLayout {...props} />
            </BackboneProvider>
        );
    },
    render(args) {
        reactRender(
            this.getComponent(args),
            this.el);
        return this;
    },
});