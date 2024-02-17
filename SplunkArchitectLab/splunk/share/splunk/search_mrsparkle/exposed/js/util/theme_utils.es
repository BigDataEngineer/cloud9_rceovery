import { defaultTheme as defaultReactThemeId } from '@splunk/splunk-utils/themes';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';

// These values come from @splunk/themes
// https://splunkui.splunkeng.com/Packages/themes/Overview
const enterpriseLight = {
    family: 'enterprise',
    colorScheme: 'light',
    density: 'comfortable',
};

const enterpriseDark = {
    family: 'enterprise',
    colorScheme: 'dark',
    density: 'comfortable',
};

const aceThemeDark = 'ace/theme/xml-dark';
const aceThemeLight = 'ace/theme/chrome';

export function getCurrentTheme() {
    // eslint-disable-next-line no-underscore-dangle
    if (window.__splunk_page_theme__) {
        // eslint-disable-next-line no-underscore-dangle
        return window.__splunk_page_theme__ === 'dark' ? enterpriseDark : enterpriseLight;
    }
    return enterpriseLight;
}

export function getXmlEditorTheme() {
    const pageTheme = getCurrentTheme();
    return pageTheme.colorScheme === 'dark' ? aceThemeDark : aceThemeLight;
}

export function getSearchEditorTheme() {
    const pageTheme = getCurrentTheme();
    return pageTheme.colorScheme === 'dark' ? 'dark' : 'light';
}

export function normalizeToDefaultTheme(theme) {
    if (theme == null || theme === '') {
        return 'light';
    }
    return theme;
}

// SplunkThemeProvider normally defaults to Prisma Dark
SplunkThemeProvider.defaultProps = getCurrentTheme();

export { defaultReactThemeId };
export { SplunkThemeProvider };