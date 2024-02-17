export function polyfillObjectEntries() {
    // Provide polyfill for PhantomJS
    // There appears to be an issue with @splunk/react-ui/CollapsibleComponent
    // where one of the internal component (react-spring) was not working correctly
    //   for PhantomJS.
    // This code should only be used for testing purposes
    // This should not be neccessary for any end users because modern browsers
    //   automatically polyfill functions
    // When the unit testing framework gets updated to use ChromeHeadless, this code
    //   should probably be deleted because ChromeHeadless will polyfill missing functions
    //   for us.
    if (!Object.entries) {
        Object.entries = (obj) => {
            const ownProps = Object.keys(obj);
            let i = ownProps.length;
            const resArray = new Array(i); // preallocate the Array
            while (i) {
                i -= 1;
                resArray[i] = [ownProps[i], obj[ownProps[i]]];
            }
            return resArray;
        };
    }
}

export default polyfillObjectEntries;