define([
    'jquery',
    'underscore',
    'module',
    'views/Base',
    'uri/route',
    './DashboardMessage.pcss'
], function($, _, module, BaseView, route) {

    return BaseView.extend({
        moduleId: module.id,
        className: 'dashboard-message alert',
        events: {
            'click .dismiss': function(e) {
                e.preventDefault();
                this.model.message.set('dismissed', true);
            }
        },
        createTemplateData: function() {
            var message = this.model.message;
            var data = message.toJSON();
            var docsLink = message.get('docsLink');
            if (docsLink) {
                data.link = route.docHelp(this.model.application.get('root'), this.model.application.get('locale'), docsLink);
                data.linkExternal = true;
            }
            return _.extend({
                linkText: _('Learn more').t(),
                dismissable: false,
                link: null,
                linkClass: 'learn-more',
                linkExternal: false,
                linkPosition: 'after',
                dismissLabel: _('Dismiss message').t()
            }, data);
        },
        render: function() {
            var data = this.createTemplateData();
            this.$el.html(this.compiledTemplate(data));
            if (data.linkData) {
                this.$('a').data(data.linkData);
            }
            this.$el.addClass('alert-' + data.level);
            this.$el.attr('role', 'alert');
            var describedby = data.link ? 'message-text message-link message-icon' : 'message-text';
            this.$el.attr('aria-describedby', describedby);
            return this;
        },
        template: '\
            <i class="icon icon-alert"></i>\
            <% if(link && linkPosition == "before") { %>\
                <a id="message-link" href="<%- link %>" class="<%- linkClass %>"><%- linkText %><% if (linkExternal) { %> <i id="message-icon" class="icon-external" aria-label="<%- _("Opens in new window").t() %>"></i><% } %></a>\
            <% } %>\
            <span id="message-text" class="message-text"><%- text %> </span>\
            <% if(link && linkPosition == "after") { %>\
                <a id="message-link" href="<%- link %>" class="<%- linkClass %>"<% if (linkExternal) { %> target="_blank" rel="noopener noreferrer"<% } %>><%- linkText %><% if (linkExternal) { %> <i id="message-icon" class="icon-external" aria-label="<%- _("Opens in new window").t() %>"></i><% } %></a>\
            <% } %>\
            <% if(dismissable) { %><button class="dismiss close" aria-label="<%- dismissLabel %>">×</button><% } %>\
            '
    });

});
