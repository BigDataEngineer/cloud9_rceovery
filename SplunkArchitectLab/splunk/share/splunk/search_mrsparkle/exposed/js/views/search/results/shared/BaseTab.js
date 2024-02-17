define(['jquery', 'underscore', 'module', 'views/Base', 'util/string_utils'], function($, _, module, Base, string_utils) {
     return Base.extend({
        tagName: 'li',
        moduleId: module.id,
        initialize: function(){
            Base.prototype.initialize.apply(this, arguments);
            if (!this.options.tab) {
                throw new Error("Type is required");
            }
        },
        startListening: function() {
            this.listenTo(this.model.report.entry.content, 'change:display.page.search.tab', this.toggleActive);
        },
        activate: function(options) {
            if (this.active) {
                return Base.prototype.activate.apply(this, arguments);
            }
            this.render();
            return Base.prototype.activate.apply(this, arguments);
        },
        events: {
            'click a': function(e){
                var $target = $(e.currentTarget),
                    data = {
                        'display.page.search.tab': $target.attr('data-tab')
                    },
                    type = $target.attr('data-type');

                if (type) {
                    data['display.general.type'] = type;
                }
                this.model.report.entry.content.set(data);
                e.preventDefault();
            }
        },
        toggleActive: function() {
            if (this.model.report.entry.content.get('display.page.search.tab') === this.options.tab) {
                this.$el.addClass('active');
                this.$el.find('a').attr('aria-selected', 'true');
            } else {
                this.$el.removeClass('active');
                this.$el.find('a').attr('aria-selected', 'false');
            }
        },
        render: function() {
            this.$el.html(this.compiledTemplate({
                _: _,
                tab: this.options.tab,
                type: this.options.type || "",
                label: this.options.label || string_utils.capitalize(this.options.tab)
            }));
            this.toggleActive();
            return this;
        },
        template:'\
            <a href="#" role="tab" data-tab="<%- tab %>" <% if (type) { %>data-type="<%- type %>"<% } %>>\
                <%- label %>\
            </a>\
        '
    });
});
