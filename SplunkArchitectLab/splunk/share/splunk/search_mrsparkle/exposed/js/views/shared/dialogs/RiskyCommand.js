/**
 * @author jszeto
 * @date 9/30/15
 *
 * Displayed when the user goes to the search page via a link and that search contains a potentially risky command (eg.
 * sendemail). This can pose a security risk, so we warn the user about the side effects.
 */

define([
        'jquery',
        'underscore',
        'backbone',
        'module',
        'views/shared/Modal',
        'uri/route',
        'util/keyboard',
        './RiskyCommand.pcss'
    ],

    function(
        $,
        _,
        Backbone,
        module,
        Modal,
        route,
        keyboard,
        css
    ) {

        return Modal.extend({
            moduleId: module.id,
            /**
             * @param {Object} options {
             *     model: {
             *         searchJob: <models.search.Job>,
             *         application: <models.Application>
             *     }
             * }
             */
            className: Modal.CLASS_NAME + " risky-command-dialog",
            initialize: function(options) {
                Modal.prototype.initialize.apply(this, arguments);
                var defaults = {
                    riskyWarningText: _("The search that you are about to run contains commands that might present a security risk.").t(),
                    actionableText: _("Do you want to investigate the search string?").t(),
                    hideInvestigateBtn: false,
                    showSearchQuery: false,
                    showActionableText: true
                };
                _.defaults(this.options, defaults);
                this.listenTo(this, 'shown', function(options) {
                    document.body.classList.remove('body-modal-open');
                    this.$el.on('keyup.dismiss.modal', function(e) {
                        if (this.options.keyboard && e.which === keyboard.KEYS.ESCAPE) {
                            this.trigger('cancel');
                        }
                    }.bind(this));
                    $('.modal-backdrop').on('click.' + this.cid, function(e) {
                        if (this.options.backdrop) {
                            this.trigger('cancel');
                        }
                    }.bind(this));
                }.bind(this));

                this.listenTo(this, 'hidden', function(options) {
                    this.$el.off('keyup.dismiss.modal');
                    $('.modal-backdrop').off('click.' + this.cid);
                }.bind(this));
            },

            events: $.extend({}, Modal.prototype.events, {
                'click .modal-btn-confirm': function(e) {
                    this.hide();
                    this.trigger('runSearch');
                    e.preventDefault();
                },

                'click .modal-btn-investigate': function(e) {
                    this.hide();
                    this.trigger('investigate');
                    e.preventDefault();
                },

                'click .modal-btn-cancel, .close': function(e) {
                    this.trigger('cancel');
                }
            }),

            render: function() {
                this.$el.html(Modal.TEMPLATE);
                var warningIcon = '<span class="alert-warning"><i class="icon-alert"></i></span>';
                var warningText = '<span>' + _("We've identified a potential security risk").t() +'</span>';
                this.$(Modal.HEADER_TITLE_SELECTOR).html(warningIcon + warningText);

                this.$(Modal.BODY_SELECTOR).html(this.compiledTemplate({
                    _: _,
                    commands: this.model.searchJob.getRiskyCommands(),
                    showActionableText: this.options.showActionableText,
                    riskyWarningText: this.options.riskyWarningText,
                    actionableText: this.options.actionableText,
                    learnMoreLink: route.docHelp(
                        this.model.application.get("root"),
                        this.model.application.get("locale"),
                        'learnmore.splsafeguards'),
                    search: this.options.showSearchQuery && this.options.search
                }));

                this.$(Modal.FOOTER_SELECTOR).append(Modal.BUTTON_CANCEL);
                this.$(Modal.FOOTER_SELECTOR).append('<a href="#" class="btn modal-btn-confirm">' + _('Run Query Anyway').t() + '</a>');
                if (!this.options.hideInvestigateBtn) {
                    this.$(Modal.FOOTER_SELECTOR).append('<a href="#" class="btn btn-primary modal-btn-primary modal-btn-investigate">' + _('Investigate').t() + '</a>');
                }
                return this;
            },

            template: '\
                <div class="body">\
                    <div>\
                        <%- riskyWarningText %><a class="learn-more-link" href="<%- learnMoreLink %>" target="_blank" rel="noopener noreferrer" title="<%- _("Splunk help").t()%>"><%- _("Learn more").t() %> <i class="icon-external"></i></a>\
                        </br>\
                    </div>\
                    <%- _("The flagged commands are:").t() %>\
                    <ul>\
                    <% _.each(commands, function(command) { %>\
                        <li><%- command %></li>\
                    <% }); %>\
                    </ul>\
                    <% if (search) { %>\
                        <span style="font-weight:bold;">\
                            <%- _("If the commands seem unusual, do not run the query without further investigation or contact your Splunk administrator.").t() %>\
                        </span>\
                        <pre><code><%-search%></code></pre>\
                    <% } %>\
                    <% if (showActionableText) { %>\
                        <%- actionableText %>\
                    <% } %>\
                </div>\
            '
        });
    }
);
