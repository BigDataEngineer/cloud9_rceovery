define(
    [
        'module',
        'jquery',
        'underscore',
        'backbone',
        'views/dashboard/Base',
        'views/shared/delegates/Popdown',
        'views/shared/Modal',
        'views/shared/dialogs/RiskyCommand',
        'models/Base',
        'splunkjs/mvc/messages',
        'splunkjs/mvc/postprocessmanager',
        'util/dashboard_utils',
        'util/splunkd_utils',
        'splunk.util'
    ],
    function(module,
             $,
             _,
             Backbone,
             BaseDashboardView,
             PopdownView,
             Modal,
             RiskyCommandDialog,
             BaseModel,
             Messages,
             PostProcessSearchManager,
             DashboardUtils,
             splunkDUtils,
             SplunkUtil
         ) {
        return BaseDashboardView.extend({
            moduleId: module.id,
            initialize: function(options) {
                BaseDashboardView.prototype.initialize.apply(this, arguments);
                this.bindToComponentSetting('managerid', this.onManagerChange, this);
                this.model = _.extend({
                    primarySearchMessages: new Backbone.Model(),
                    secondarySearchMessages: new Backbone.Model()
                }, this.model);
                var debouncedRender = _.debounce(this.render);
                this.model.primarySearchMessages.on('change', debouncedRender, this);
                this.model.secondarySearchMessages.on('change', debouncedRender, this);
            },
            onManagerChange: function(managers) {
                // clean up listeners
                if (this.managers) {
                    _.each(this.managers, function(manager) {
                        this.stopListening(manager);
                    }, this);
                    this.managers = null;
                }
                if (managers) {
                    this.managers = managers;
                    _.each(this.managers, function(manager) {
                        if (manager.getType() === 'primary') {
                            this.primaryManager = manager;
                            if (this._shouldShowProgress()) {
                                this.model.primarySearchMessages.clear();
                            }
                            this.listenTo(manager, "search:progress search:done", this.onPrimarySearchProgress);
                            this.listenTo(manager, "search:error", this.onPrimarySearchError.bind(this, manager));
                        } else {
                            this.listenTo(manager, "search:start", _.partial(this.onSecondarySearchStart, manager));
                            this.listenTo(manager, "search:fail", _.partial(this.onSecondarySearchFail, manager));
                            this.listenTo(manager, "search:error", _.partial(this.onSecondarySearchError, manager));
                            this.listenTo(manager, 'search:cancelled', _.partial(this.onSecondarySearchCancelled, manager));
                        }
                        manager.replayLastSearchEvent(this);
                    }, this);
                }
            },
            onSecondarySearchStart: function(manager, state) {
                this.model.secondarySearchMessages.unset(manager.id);
            },
            onSecondarySearchCancelled: function(manager, state) {
                this.onSecondarySearchStart(manager, state);
            },
            onSecondarySearchError: function(manager, message, err) {
                var msg = Messages.getSearchErrorMessage(err) || message;
                msg = SplunkUtil.sprintf('[%s] %s', manager.getType(), msg);
                DashboardUtils.updateSearchMessage(this.model.secondarySearchMessages, manager.id, 'error', msg, {
                    reset: true
                });
            },
            onSecondarySearchFail: function(manager, state) {
                var msg = Messages.getSearchFailureMessage(state);
                msg = SplunkUtil.sprintf('[%s] %s', manager.getType(), msg);
                DashboardUtils.updateSearchMessage(this.model.secondarySearchMessages, manager.id, 'error', msg, {
                    reset: true
                });
            },
            onPrimarySearchProgress: function(properties) {
                var content = properties.content || {};

                // Pass this progress event if we are not showing progress and
                // the job is not done.
                if (!this._shouldShowProgress() && !content.isDone) {
                    return;
                }

                if (content.messages) {
                    var errMsgs = _(content.messages).chain().where({ 'type': 'ERROR' }).pluck('text').value();
                    var warnMsgs = _(content.messages).chain().where({ 'type': 'WARN' }).pluck('text').value();
                    this.model.primarySearchMessages.set('errors', errMsgs, { unset: _.isEmpty(errMsgs) });
                    this.model.primarySearchMessages.set('warnings', warnMsgs, { unset: _.isEmpty(warnMsgs) });
                }
            },
            onPrimarySearchError: function(manager, errorMsg, error, job) {
                if (!error || !error.data || !error.data.messages) {
                    return;
                }
                if (splunkDUtils.messagesContainsOneOfTypes(error.data.messages, [splunkDUtils.RISKY_COMMAND])) {
                    if (splunkDUtils.getParentRiskyError(manager.parent)) {
                        // if the risky error is not for the postprocess search, then should not show the risky warning dialog
                        return;
                    }
                    this.model.primarySearchMessages.set('errors', error.data.messages);
                    this._updateDashboardMessages(manager);
                    // set searchJob which is required for populating risky commands in RiskyCommand dialog
                    if (this.model.searchJob !== job) {
                        this.model.searchJob = job;
                        // if search job is not the same, re-render the dialog
                        if (this.riskyWarningDialog) {
                            this.riskyWarningDialog.remove();
                            this.riskyWarningDialog = null;
                        }

                        if (!this.model.searchJob.error && this.model.searchJob.setError) {
                            this.model.searchJob.setError(error);
                        }
                    }
                }
            },
            getMessages: function() {
                var messages = {
                    errors: this.model.primarySearchMessages.get('errors') || [],
                    warnings: this.model.primarySearchMessages.get('warnings') || []
                };
                _.chain(this.model.secondarySearchMessages.toJSON()).values().each(function(msg) {
                    messages.errors = messages.errors.concat(msg.errors || []);
                    messages.warnings = messages.warnings.concat(msg.warnings || []);
                });
                return messages;
            },
            render: function() {
                var messages = this.getMessages();
                this._removeError();
                if (messages.errors.length === 0 && messages.warnings.length === 0) {
                    return this;
                }
                var isRiskyCommand = splunkDUtils.messagesContainsOneOfTypes(messages.errors, [splunkDUtils.RISKY_COMMAND]);
                var title;
                if (isRiskyCommand) {
                    title = messages.errors.reduce(function(accumulator, error) {
                        if (error.type === splunkDUtils.RISKY_COMMAND) {
                            accumulator = accumulator + error.text;
                        }
                        return accumulator;
                    }, '');
                } else {
                    title = _('Click to see the error details.').t();
                }

                var html = this.compiledTemplate({
                    errors: messages.errors,
                    warnings: messages.warnings,
                    isRiskyCommand: isRiskyCommand,
                    title: title
                });
                this.$el.html(html);

                // display tooltip
                this.$errorTooltip  = this.$el.find('a.error-indicator');
                this.$errorTooltip.tooltip("destroy");
                this.$errorTooltip.tooltip({animation: false, container: "body"});

                this.$error = this.$el.find('.error-details');
                var options = {
                    el: this.$error
                };
                if (isRiskyCommand) {
                    options.mode = 'dialog';
                    options.detachDialog = true;
                    options.dialog = '> .risky-command-dialog';
                    options.attachDialogTo = true;
                }
                this.children.errorPopdown = new PopdownView(options);

                if (isRiskyCommand) {
                    this.listenTo(this.children.errorPopdown, "show", function() {
                        this.showRiskyWarningDialog();
                    }.bind(this));
                    this.listenTo(this.children.errorPopdown, "hide", function() {
                        this.hideRiskyWarningDialog();
                    }.bind(this));
                    this.listenTo(this.children.errorPopdown, "shown", function() {
                        if (this.riskyWarningDialog) {
                            this.riskyWarningDialog.focus();
                        }
                    }.bind(this));
                }
                return this;
            },
            _renderRiskyWarningDialog: function() {
                var options = {
                    model: {
                        searchJob: this.model.searchJob,
                        application: this.model.application
                    },
                    hideInvestigateBtn: true,
                    actionableText: _("Do you want to run the search string?").t(),
                    backdrop: false
                };
                if (this.primaryManager) {
                    options.search = this.primaryManager.search.get("search");
                    options.showSearchQuery = true;
                    if (this.primaryManager instanceof PostProcessSearchManager) {
                        options.search = this.primaryManager.fullSearch;
                    }
                }
                if (this.children.errorPopdown) {
                    options.el = this.children.errorPopdown.delegate().$el;
                }
                var riskyWarningDialog = new RiskyCommandDialog(options);
                this.listenTo(riskyWarningDialog, "runSearch", function() {
                    if (this.primaryManager instanceof PostProcessSearchManager) {
                        this.primaryManager.settings.set('check_risky_command', false);
                        this.primaryManager.parent.startSearch({refresh: true});
                    } else if (this.primaryManager) {
                        this.primaryManager.settings.set("check_risky_command", false);
                        this._removeDashboardMessages(this.primaryManager);
                    }
                    SplunkUtil.trackEvent({
                        type: 'dashboard.telemetry',
                        data: {
                            pageAction: 'riskyWarningDialog.runSearch'
                        }
                    });
                }.bind(this));
                this.listenTo(riskyWarningDialog, "cancel", function() {
                    if (this.children.errorPopdown) {
                        this.children.errorPopdown.hide();
                    }
                    SplunkUtil.trackEvent({
                        type: 'dashboard.telemetry',
                        data: {
                            pageAction: 'riskyWarningDialog.cancel'
                        }
                    });
                }.bind(this));
                riskyWarningDialog.render();
                riskyWarningDialog.$(Modal.HEADER_TITLE_SELECTOR).children().last().html( _('This search has a potential security risk').t());
                return riskyWarningDialog;
            },
            showRiskyWarningDialog: function() {
                if (!this.riskyWarningDialog) {
                    this.riskyWarningDialog = this._renderRiskyWarningDialog();
                }
                this.riskyWarningDialog.show();
                SplunkUtil.trackEvent({
                    type: 'dashboard.telemetry',
                    data: {
                        pageAction: 'riskyWarningDialog.open'
                    }
                });
            },
            hideRiskyWarningDialog: function() {
                if (this.riskyWarningDialog) {
                    this.riskyWarningDialog.hide();
                }
            },
            _removeError: function() {
                if (this.$errorTooltip) {
                    this.$errorTooltip.tooltip("destroy");
                    this.$errorTooltip = null;
                }
                if (this.$error) {
                    this.$error.remove();
                    this.$error = null;
                }
                if (this.children.errorPopdown) {
                    this.children.errorPopdown.remove();
                }
            },
            _shouldShowProgress: function() {
                var refreshDisplay = this.model.report.entry.content.get('dashboard.element.refresh.display');
                return refreshDisplay === 'none' ? !this.primaryManager.isRefresh() : true;
            },
            remove: function() {
                _(this.children).invoke('remove');
                _(this.model).invoke('off');
                return BaseDashboardView.prototype.remove.call(this);
            },
            // Add/update dashboard messages with the warning message about the risky command
            _updateDashboardMessages: function(manager) {
                var dashboardMessages = manager.has('collection') ? manager.get('collection').dashboardMessages : '';
                if (!dashboardMessages) {
                    return;
                }
                var warnRiskyCommands = dashboardMessages.get('warn-risky-commands');
                if (warnRiskyCommands) {
                    var searchName = warnRiskyCommands.get('searchName');
                    // searchName array contains name of searches containing risky commands
                    if (searchName.indexOf(manager.name) === -1) {
                        searchName.push(manager.name);
                    }
                } else {
                    dashboardMessages.add(new BaseModel({
                        id: 'warn-risky-commands',
                        searchName: [manager.name],
                        level: 'warning',
                        text: _('Some visualizations have not loaded since we detected usage of risky commands in the query.').t(),
                        linkText: _('Learn more').t(),
                        docsLink: 'learnmore.splsafeguards',
                        dismissable: true
                    }));
                }
            },
            // remove search name from dashboard messages model searchName, which is allowed to run
            _removeDashboardMessages: function(manager) {
                var dashboardMessages = manager.has('collection') ? manager.get('collection').dashboardMessages : '';
                var warnRiskyCommands = dashboardMessages && dashboardMessages.get('warn-risky-commands');
                if (!warnRiskyCommands) {
                    return;
                }
                var searchName = warnRiskyCommands.get('searchName');
                if (!searchName) {
                    return;
                }
                var index = searchName.indexOf(manager.name);
                if (index !== -1) {
                    // remove 1 search from searchName array
                    searchName.splice(index, 1);
                    // If searchName is empty, all risky searches are allowed to run
                    // remove risky command warning dashboard message
                    if (searchName.length === 0) {
                        dashboardMessages.remove('warn-risky-commands');
                    }
                }
            },
            template: '\
                <div class="error-details <%- errors.length ? \'severe\' : \'\' %>">\
                    <a \
                        href="#" \
                        class="dropdown-toggle error-indicator" \
                        aria-label="<%- title %>"\
                        title="<%- title %>"\
                    >\
                        <i class="icon-warning-sign"></i>\
                    </a>\
                    <% if (isRiskyCommand) { %>\
                        <div class="modal risky-command-dialog"/>\
                    <% } else { %>\
                        <div class="dropdown-menu">\
                            <div class="arrow"></div>\
                            <ul class="first-group error-list">\
                                <% errors.forEach(function(error) { %>\
                                    <li class="error">\
                                        <i class="icon-warning-sign"></i>\
                                        <%- error %>\
                                    </li>\
                                <% }); %>\
                                <% warnings.forEach(function(warn) { %>\
                                    <li class="warning">\
                                        <i class="icon-warning-sign"></i> \
                                        <%- warn %>\
                                    </li>\
                                <% }); %>\
                            </ul>\
                        </div>\
                    <% } %>\
                </div>\
            '
        });
    }
);
