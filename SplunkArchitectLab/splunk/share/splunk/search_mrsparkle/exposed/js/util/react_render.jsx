import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import { getCurrentTheme, SplunkThemeProvider } from 'util/theme_utils';

/*
@param  reactEl <Object (React element)>: React element to be rendered.
@param  container <Object (DOM element)>: Parent element which the created element
        is added as a child to.
@return <function>: Callback function which can be used to unmount the rendered component.
*/
export default (reactEl, container) => {
    ReactDOM.render(
        <SplunkThemeProvider {...getCurrentTheme()}>
            {reactEl}
        </SplunkThemeProvider>,
        container,
    );
    return () => ReactDOM.unmountComponentAtNode(container);
};
