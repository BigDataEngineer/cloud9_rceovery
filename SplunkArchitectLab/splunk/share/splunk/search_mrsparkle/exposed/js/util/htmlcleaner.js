define(['underscore', 'jquery', 'dompurify', '@xmldom/xmldom', 'util/console', 'util/htmlcleaner_util', 'style-to-object', 'known-css-properties', 'util/hash_utils'], function (_, $, DOMPurify, xmldom, console, CleanerUtil, StyleToObject, knownCss, hashUtils) {
    var BAD_NODE_SELECTOR = 'script,base,link,meta,head,*[type="text/javascript"]';
    var BAD_URL_SCHEMES = /(?:javascript|jscript|livescript|vbscript|data(?!:image\/)|about|mocha):/i;
    var WITH_SCRIPT = /<script>(.*?)<\/script>/i;
    var WITH_MULTI_LINE_SCRIPT = /<script>(.+)((\s)+(.+))+<\/script>/i;
    var EVENT_HANDLER_ATTRIBUTE_PREFIX = "on";
    var CSS_EXPRESSION_PATTERN = /(^|[\s\W])expression(\s*\()/gmi;
    var CSS_EXPRESSION_REPLACE = '$1no-xpr$2';
    var CSS_EXPRESSION_FILTER = /([^{]+)\s*\{\s*([^}]+)\s*}/gm;
    var HTML_CLEANER_TYPE = 'htmlcleaner.dashboard';
    var URL_ATTRIBUTES = {
        link: ['href'],
        applet: ['code', 'object'],
        iframe: ['src', 'srcdoc'],
        img: ['src'],
        embed: ['src'],
        layer: ['src'],
        a: ['href']
    };
    var ELEMENTS_WITH_INVALID_ATTRIBUTES = {
        select : ["href"]
    };
    var forbidAttr = [];
    var WRAP_EMBED_TAGS = false;
    var ALLOW_INLINE_STYLE = false;
    var ALLOWED_DOMAINS = [];
    var dashboardTags = [];
    /** @typedef {{
        type: 'StyleElement',
        rulesets: { selector: string, properties: string[] }[]
    }} StyleElementTelemetry */
    /** @typedef {{
        type: 'StyleAttribute',
        element: string,
        properties: string[],
    }} StyleAttributeTelemetry */
    /** @type {Array<StyleElementTelemetry | StyleAttributeTelemetry>} */
    var inlineStyles = [];
    var captureInlineStyleUsage = false;

    function isDuplicateCssTelemetry(events, currInlineStyles) {
        var newHash = hashUtils.hashString(JSON.stringify(currInlineStyles));
        if (events[newHash]) {
            return true;
        } else {
            events[newHash] = true;
            return false;
        }
    }

    function cleanupUrl(url) {
        var decodedURI = $.trim(url || '');
        try {
            decodedURI = decodeURIComponent(decodedURI);
        } catch (err) {
            console.log('Caught an exception: ' + err);
            decodedURI = _.unescape(decodedURI);
        }
        return decodedURI.replace(/\s/gmi, '');
    }

    function isBadUrl(url) {
        return BAD_URL_SCHEMES.test(cleanupUrl(url));
    }

    function isBadNodeValue(val) {
        var convertedStr = (_.unescape($.trim(val || ''))).replace(/\s/gmi, '');
        return BAD_URL_SCHEMES.test(convertedStr) || WITH_MULTI_LINE_SCRIPT.test(convertedStr) || WITH_SCRIPT.test(convertedStr);
    }

    function cleanStylesheet(styleNode) {
        var $style = $(styleNode);
        var cssText = $style.html();
        var newText = cleanCssText(cssText);
        if (cssText != newText) {
            $style.text(newText);
        }
    }

    function cleanCssText(cssText) {
        CSS_EXPRESSION_PATTERN.lastIndex = 0;
        return cssText.replace(CSS_EXPRESSION_PATTERN, CSS_EXPRESSION_REPLACE);
    }

    function clearAttributes(node) {
        _.each(getAttributeNames(node), function (name) {
            node.removeAttribute(name);
        });
    }

    function getAttributeNames(node) {
        var attrNames = [];
        _.each(node.attributes, function (attr) {
            attrNames.push(attr.name);
        });
        return attrNames;
    }

    /**
     * Checks whether selector is valid on the node's owner document.
     *
     * @param node
     * @param selector
     * @returns boolean
     */
    function isValidSelector(node, selector) {
        try {
            if (node && node.ownerDocument && node.ownerDocument.querySelector(selector)) {
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    function isValidAttribute(attrName, attrValue, node) {
        var lcAttrName = attrName.toLowerCase();
        var lcTagName = node.tagName && node.tagName.toLowerCase();
        //check for <geo json> elements
        if(lcAttrName === 'json' && lcTagName == 'geo') {
            return true;
        }
        // remove invalid data attributes
        if (lcAttrName === 'data-main') {
            return false;
        } else if (lcAttrName === 'data-target') {
            return isValidSelector(node, attrValue);
        } else if (lcAttrName === 'data-dismiss' && attrValue === 'alert') {
            // data-target or href can contain XSS
            return isValidSelector(node, node.getAttribute("data-target") || node.getAttribute("href"));
        } else if (ELEMENTS_WITH_INVALID_ATTRIBUTES.hasOwnProperty(lcTagName) &&
                  _.contains(ELEMENTS_WITH_INVALID_ATTRIBUTES[lcTagName], lcAttrName)) {
            return false;
        }
        // remove event listener
        if ((lcAttrName.indexOf(EVENT_HANDLER_ATTRIBUTE_PREFIX) === 0)
            || forbidAttr.indexOf(lcAttrName) !== -1) {
            return false;
        }

        if (isBadNodeValue(attrValue) && lcTagName !== 'iframe') {
            return false;
        }

        var urlAttrs = URL_ATTRIBUTES[lcTagName];
        if (urlAttrs && _(urlAttrs).contains(lcAttrName)) {
            if (isBadUrl(attrValue)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get the inlineStyles[] for a given html, if captureInlineStyleUsage is true
     * @returns inlineStyles (array)
     */
     function getInlineStyleUsage() {
        return captureInlineStyleUsage ? inlineStyles : null;
    }

    var validAttributeNames = [];
    var validAttributes = {};

    DOMPurify.addHook('beforeSanitizeAttributes', function (node) {
        validAttributeNames = [];
        validAttributes = {};
        _.each(getAttributeNames(node), function (name) {
            var val = node.getAttribute(name);
            if (isValidAttribute(name, val, node)) {
                validAttributeNames.push(name);
                validAttributes[name] = val;
            }
        });
    });

    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        clearAttributes(node);
        if (node.tagName.toLowerCase() === 'iframe' && !('sandbox' in validAttributes)) {
            if (!('src' in validAttributes) || !CleanerUtil.isAllowedDomain(ALLOWED_DOMAINS, validAttributes['src'])) {
                validAttributeNames.push('sandbox');
                validAttributes['sandbox'] = 'allow-scripts';
            }
        }
        // remove all instances of 'allow-same-origin' in attribute str
        if (validAttributes['sandbox']) {
            validAttributes['sandbox'] = validAttributes['sandbox'].toLowerCase();
            while (validAttributes['sandbox'].includes('allow-same-origin')) {
                validAttributes['sandbox'] = validAttributes['sandbox'].replace(/allow-same-origin/g, '');
            }
        }
        _.each(validAttributeNames, function (attrName) {
            try {
                node.setAttribute(attrName, validAttributes[attrName]);
            } catch (ex) {
                console.error('Cannot set an invalid attribute: ' + attrName);
            }
        });
    });

    DOMPurify.addHook('afterSanitizeElements', function (currentNode) {
        // hook to clean <style> content
        if (currentNode.tagName && currentNode.tagName.toLowerCase() === 'style') {
            cleanStylesheet(currentNode);
        }
    });

    DOMPurify.addHook('beforeSanitizeElements', function (currentNode) {
        if (captureInlineStyleUsage && currentNode.tagName) {
            dashboardTags.push(currentNode.tagName);

            if(currentNode.tagName.toLowerCase() === 'style') {
                // Naming based on https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax
                var rulesets = [];
                var match;
                var updateMatch = function() {
                    match = CSS_EXPRESSION_FILTER.exec(currentNode.textContent);
                };
                updateMatch();
                while (match != null) {
                    var content = match[2];
                    var styleObjects = {};
                    // if style has some bad chars, we should continue the sanitization.
                    try {
                        styleObjects = StyleToObject(content);
                    } catch(ex){
                        // do nothing
                    }
                    rulesets.push({
                        properties: Object.keys(styleObjects),
                    });
                    updateMatch();
                }
                inlineStyles.push({
                    type: 'StyleElement',
                    rulesets: rulesets,
                });
            }
        }
    });

    function wrapEmbedTag(embedNode) {
        var embedTag = $(embedNode);
        var style = 'style="background-color: transparent; border: 0px none transparent; padding: 0px; overflow: hidden; width: 100%; height: 100%;"';
        var className = '"embed-wrapper"';
        if (!ALLOW_INLINE_STYLE) {
            embedTag.removeAttr('style');
            style = '';
        }
        var outer = _.escape(embedTag.prop('outerHTML'));
        var wrapped = '<iframe sandbox="allow-scripts" srcdoc="' + outer + '" ' + style + ' class=' + className + '></iframe>';
        embedTag.replaceWith(wrapped);
        return embedTag;
    }

    DOMPurify.addHook('afterSanitizeElements', function (currentNode) {
        if (currentNode.tagName && currentNode.tagName.toLowerCase() === 'embed' && WRAP_EMBED_TAGS) {
            wrapEmbedTag(currentNode);
        }
    });

    DOMPurify.addHook('uponSanitizeAttribute', function(node, data) {
        if (captureInlineStyleUsage && data.attrName === 'style') {
            // This is OK with the rare possibility of <style style="...">
            inlineStyles.push({
                type: 'StyleAttribute',
                element: node.tagName && node.tagName.toLowerCase(),
                properties: Object.keys(StyleToObject(data.attrValue)).filter(function(prop) {
                    return knownCss.all.includes(prop);
                }),
            });
        }
    });

    /**
     *
     * @param htmlText {string}
     * @param options {object}
     * @param options.allowInlineStyles {boolean}
     * @param options.allowIframes {boolean}
     * @param options.allowEmbeds {boolean}
     * @param options.wrapEmbedTags {boolean}
     * @param options.allowedDomains {array}
     * @param options.captureInlineStyleUsage {boolean}
     * @returns {*}
     */
    function dompurifyHtml(htmlText, options) {
        if (!htmlText) {
            return null;
        }
        var DOMParser = xmldom.DOMParser;
        // Custom DOMParser options because we want to error out on warnings as well as errors
        var errorHandler = function(e) { throw e; };
        var parserOptions = {
            locator: {},
            errorHandler: {
                warning: errorHandler,
                error: errorHandler,
                fatalError: errorHandler,
            },
        };
        try {
            var validHtml;
            try {
                // This block of code expands certain self closing tags to explicitly
                // contain both the opening and closing tag
                // This is due to how modern browsers handle empty XML tags
                //   if the tag is empty the browser will automatically change the tag to the self closing tag
                // This will expand all self closing tags
                // This needs to be done as XHTML is not HTML
                var rawXML = '<tmp>' + htmlText + '</tmp>';
                //check if it's valid XML, err out if it isn't XML
                new DOMParser(parserOptions).parseFromString(rawXML, 'text/xml');

                rawXML = rawXML.slice(5, rawXML.length - 6);
                var split = rawXML.split('/>');

                var newXml = '';
                for (var i = 0; i < split.length - 1; i++) {
                    var edsplit = split[i].split('<');
                    var nodeName = edsplit[edsplit.length - 1].split(' ')[0];
                    newXml += split[i] + '></' + nodeName + '>';
                }
                validHtml = newXml + split[split.length - 1];
            } catch (e) {
                // could not parse as XML, treating as HTML
                validHtml = htmlText;
            }

            options || (options = {});
            // Defined according to web.conf defaults
            if (options.allowIframes === undefined) {
                options.allowIframes = true;
            }
            if (options.allowInlineStyles === undefined) {
                options.allowInlineStyles = true;
            }
            // web.conf default value for allowEmbeds is false
            // If not explicitly defined, set to true to maintain backwards compatibility
            if (options.allowEmbeds === undefined) {
                options.allowEmbeds = true;
            }
            if (options.allowedDomains === undefined) {
                options.allowedDomains = [];
            }
            var forbidTags = BAD_NODE_SELECTOR.split(',');
            forbidAttr = ['allowscriptaccess'];
            // these attrs are currently being used, we need to allow them
            var allowAttr = ['i18ntag', 'i18nattr', 'json', 'section-label'];
            var allowTag = ['iframe', 'embed', 'h7', 'h8', 'h9', 'splunk-search-dropdown', 'splunk-control-group', 'splunk-select', 'splunk-radio-input', 'splunk-text-area', 'splunk-text-input', 'splunk-color-picker', 'splunk-color'];
            // used for telemetry. Needs to be reset to prevent sending duplicate data
            dashboardTags = [];
            inlineStyles = [];

            ALLOW_INLINE_STYLE = options.allowInlineStyles;
            WRAP_EMBED_TAGS = options.wrapEmbedTags && options.allowIframes;
            ALLOWED_DOMAINS = CleanerUtil.bucketDomainsByType(options.allowedDomains);
            captureInlineStyleUsage = options.captureInlineStyleUsage;

            if (!options.allowIframes || !options.allowEmbeds) {
                forbidTags.push('iframe');
            }
            if (!options.allowInlineStyles) {
                forbidAttr.push('style');
                forbidTags.push('style');
            }
            if (!options.allowEmbeds) {
                forbidTags.push('embed');
            }

            var domPurifyCfg = {
                SAFE_FOR_JQUERY: true,
                ALLOW_DATA_ATTR: true,
                FORCE_BODY: true,
                ADD_TAGS: allowTag,
                ADD_ATTR: allowAttr,
                FORBID_TAGS: forbidTags,
                FORBID_ATTR: forbidAttr
            };
            var cleanHtml = DOMPurify.sanitize(validHtml, domPurifyCfg);
            if (captureInlineStyleUsage && window._splunk_metrics_events){
                if (!isDuplicateCssTelemetry(window.__splunk_sent_css_telemetry__, inlineStyles)) {
                    window._splunk_metrics_events.push({
                        type: HTML_CLEANER_TYPE,
                        data: {
                            sanitizedTags: dashboardTags,
                            inlineStyles: inlineStyles
                        }
                    });
                }
            }
            return cleanHtml;
        } catch (ex) {
            return htmlText;
        }
    }

    return {
        clean: dompurifyHtml,
        isBadUrl: isBadUrl,
        isBadNodeValue: isBadNodeValue,
        _cleanCssText: cleanCssText,
        getInlineStyleUsage: getInlineStyleUsage
    };

});
