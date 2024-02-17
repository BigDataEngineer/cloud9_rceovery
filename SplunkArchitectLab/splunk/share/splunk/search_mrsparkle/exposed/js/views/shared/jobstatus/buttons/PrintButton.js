define(
    [
        'underscore',
        'module',
        'views/Base',
        'helpers/Printer',
        'splunk.util',
        'bootstrap.tooltip'
    ],
    function(_, module, Base, Printer, splunkUtils) {
        return Base.extend({
            moduleId: module.id,
            className: 'print btn-pill btn-square',
            tagName: 'a',
            attributes: {
                "href": "#",
                "role": "button"
            },
            initialize: function() {
                Base.prototype.initialize.apply(this, arguments);
                this.$el.html('<i class="icon-print" aria-hidden="true"></i><span class="hide-text" aria-hidden="true">' + _("Print").t() + '</span>');
                this.$el.tooltip({animation:false, title:_('Print').t(), container: this.$el});
            },
            events: {
                'click': function(e) {
                    splunkUtils.trackPageInteraction(this.options.appName || '', 'Click Print link from search job bar'); 
                    Printer.printPage();
                    return false;
                }
            },
            render: function() {
                return this;
            }
        });
    }
);
