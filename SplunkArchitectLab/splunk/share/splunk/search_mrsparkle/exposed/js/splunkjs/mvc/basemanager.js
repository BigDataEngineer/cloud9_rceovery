define(function(require, exports, module) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var console = require('util/console');
    var DomTrackerMixin = require('mixins/domtracker');
    var mvc = require('./mvc');
    var RiskyCommandDialog = require('views/shared/dialogs/RiskyCommand');
    var BaseModel = require('models/Base');
    var splunkUtils = require('splunk.util');

    /**
     * @constructor
     * @memberOf splunkjs.mvc
     * @name BaseManager
     * @private
     * @description The **BaseManager** base class is used for search managers.
     * This class is not designed to be instantiated directly.
     * @extends splunkjs.mvc.Backbone.Model
     * @mixes domtracker
     */
    var BaseManager = Backbone.Model.extend(/** @lends splunkjs.mvc.BaseManager.prototype */{
        constructor: function(attributes, options) {
            attributes = attributes || {};
            options = options || {};

            // Get or generate a name
            var id = options.id || attributes.id;

            if (id === undefined) {
                id = options.name || attributes.name;
                if (id !== undefined) {
                    console.log("Use of 'name' to specify the ID of a Splunk model is deprecated.");
                }
            }

            if (id === undefined) {
                id = _.uniqueId('manager_');
            }

            // Store it on the instance/options
            this.id = this.name = options.name = options.id = id;

            // Register it on the global registry
            this.registry = options.registry || options._tokenRegistry || mvc.Components;

            var returned = Backbone.Model.prototype.constructor.apply(this, arguments);
            this.registry.registerInstance(this.id, this, { replace: options.replace });

            return returned;
        },

        _start: function() {},

        dispose: function() {
            this.stopListeningDOM();
            this.stopListening();

            if (this.registry.getInstance(this.id) === this) {
                this.registry.revokeInstance(this.id);
            }
        },

        getType: function() {
            return this.settings.get('type') || 'primary';
        },

        showRiskyWarningDialog: function(job, searchType) {
            var options = {
                model: {
                    searchJob: job,
                    application: this.attributes.model.application
                },
                hideInvestigateBtn: true,
                showActionableText: false,
                riskyWarningText: _('This dashboard is attempting to execute an SPL query that we\'ve flagged as risky.').t(),
                actionableText: _('Do you want to run the search string?').t(),
                backdrop: false,
                onHiddenRemove: true,
                search: searchType === 'PostProcessSearch' ? this.fullSearch : this.get('search'),
                showSearchQuery: true
            };
            var riskyWarningDialog = new RiskyCommandDialog(options);
            this.listenTo(riskyWarningDialog, "runSearch", function() {
                this.settings.set("check_risky_command", false);
                if (searchType === 'PostProcessSearch') {
                    this.parent.startSearch({refresh: true});
                }
                this._removeDashboardMessages();
                splunkUtils.trackEvent({
                    type: 'dashboard.telemetry',
                    data: {
                        pageAction: 'riskyWarningDialog.runSearch'
                    }
                });
            }.bind(this));
            this.listenTo(riskyWarningDialog, "cancel", function() {
                splunkUtils.trackEvent({
                    type: 'dashboard.telemetry',
                    data: {
                        pageAction: 'riskyWarningDialog.cancel'
                    }
                });
            });
            riskyWarningDialog.render();
            riskyWarningDialog.show();
            splunkUtils.trackEvent({
                type: 'dashboard.telemetry',
                data: {
                    pageAction: 'riskyWarningDialog.open'
                }
            });
            this._updateDashboardMessages();
        },

        // Add/update dashboard messages with the warning message about the risky command
        _updateDashboardMessages: function() {
            var dashboardMessages = this.has('collection') ? this.get('collection').dashboardMessages : '';
            if (!dashboardMessages) {
                return;
            }
            var warnRiskyCommands = dashboardMessages.get('warn-risky-commands');
            if (warnRiskyCommands) {
                var searchName = warnRiskyCommands.get('searchName');
                // searchName array contains name of searches containing risky commands
                if (searchName.indexOf(this.name) === -1) {
                    searchName.push(this.name);
                }
            } else {
                dashboardMessages.add(new BaseModel({
                    id: 'warn-risky-commands',
                    searchName: [this.name],
                    level: 'warning',
                    text: _('Some visualizations have not loaded since we detected usage of risky commands in the query.').t(),
                    linkText: _('Learn more').t(),
                    docsLink: 'learnmore.splsafeguards',
                    dismissable: true
                }));
            }
        },

        // remove search name from dashboard messages model searchName, which is allowed to run
        _removeDashboardMessages: function() {
            var dashboardMessages = this.has('collection') ? this.get('collection').dashboardMessages : '';
            var warnRiskyCommands = dashboardMessages && dashboardMessages.get('warn-risky-commands');
            if (!warnRiskyCommands) {
                return;
            }
            var searchName = warnRiskyCommands.get('searchName');
            if (!searchName) {
                return;
            }
            var index = searchName.indexOf(this.name);
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
    });

    _.extend(BaseManager.prototype, DomTrackerMixin);

    return BaseManager;
});
/**
 * Search progress event.
 *
 * @event
 * @name splunkjs.mvc.BaseManager#search
 * @property {Boolean} search:cancelled - Fired when the search is cancelled. Changing the properties of the search starts a new one, which may cancel an old search.
 * @property {Boolean} search:done - Fired when the search has finished. Note that this event is never fired for a real-time search.
 * @property {Boolean} search:error - Fired when an error occurs, such as when the user does not provide a search query, the user does not provide a valid name of a saved search, or when a network failure occurs.
 * @property {Boolean} search:failed - Fired when the search job fails.
 * @property {Boolean} search:progress - Fired to indicate search progress.
 * @property {Boolean} search:start - Fired when the search is successfully started.
 */
