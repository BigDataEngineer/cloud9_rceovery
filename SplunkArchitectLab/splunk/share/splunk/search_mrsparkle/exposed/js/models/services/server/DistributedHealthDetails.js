define(
    [
        'underscore',
        'models/SplunkDBase'
    ],
    function (_, SplunkDBaseModel) {
        var HEALTHY_STATUS = 'green',
            ATTRIBUTES = [
                'health',
                'num_green',
                'num_red',
                'num_yellow',
                'description',
                'instances',
                'name',
                'path',
                'display_name',
                'features',
                'snoozed',
            ];

        return SplunkDBaseModel.extend({
            urlRoot: 'server/health/deployment',
            id: 'details',
            _getFeatureIndicators: function (feature) {
                var output = [];
                _.each(feature, function(comp, name) {
                    if (!_.contains(ATTRIBUTES, name) && comp) {
                        if (_.isUndefined(comp.name)) {
                            output.push(_.extend({name: name}, comp));
                        } else {
                            output.push(comp);
                        }
                    }
                }.bind(this));
                return output;
            },

            // Method to format feature groups into format similar to healthDetails features
            _processFeatureGroups: function (feature) {
                var output = [];
                _.each(feature, function(comp, name) {
                    // check is attribute is not in list of feature attributes
                    if (!_.contains(ATTRIBUTES, name)) {
                            var obj = {
                                name: name,
                                health: comp.health,
                                reasons: comp.reasons,
                                messages: comp.messages,
                                disabled: comp.disabled
                            };
                            //get sub features of current feature
                            obj.features = this._processChildFeatures(comp);
                            output.push(obj);
                            // add feature to feature map
                            var map = this.get('map') || {};
                            map[name] = obj;
                            this.set('map', map);
                    }
                }.bind(this));
                return output;
            },

            // Method to format individual feature into format similar to healthDetails features
            _processChildFeatures: function (feature) {
                var output = [];
                _.each(feature, function(comp, name) {
                    // check is attribute is not in list of feature attributes
                    if (!_.contains(ATTRIBUTES, name)) {
                        // check if attribute is a feature that should be displayed
                        if (!_.isUndefined(comp.display_name)) {
                            var obj = {
                                name: name,
                                display_name: comp.display_name,
                                health: comp.health,
                                reasons: comp.reasons,
                                messages: comp.messages,
                                disabled: comp.disabled
                            };
                            output.push(obj);
                            // add feature to feature map
                            var map = this.get('map') || {};
                            map[name] = obj;
                            this.set('map', map);
                        } else {
                            output = output.concat(this._processChildFeatures(comp));
                        }
                    }
                }.bind(this));
                return output;
            },

            /*
             * Constructing a flat array of all health anomalies using BFS algorithm
             */
            _findAnomalies: function(features) {
                var result = [],
                    queue = [];

                _.each(this._getFeatureIndicators(features), function(feature) {
                    if (feature.health !== HEALTHY_STATUS) {
                        feature.name = [feature.name]; // Storing feature hierarchy
                        queue.push(feature);
                    }
                });

                while (queue.length > 0) {
                    var curFeature = queue.shift(),
                        nameArr = curFeature.name,
                        children = curFeature.features || this._getFeatureIndicators(curFeature);

                    if (children.length > 0) {
                        _.each(children, function(child) {
                            var nameArrCopy = nameArr.slice(),
                                name = child.name;
                            if (child.health !== HEALTHY_STATUS) {
                                nameArrCopy.push(name);
                                child.name = nameArrCopy; // Storing feature hierarchy
                                queue.push(child);
                            }
                        });
                    } else {
                        // Process anomaly format:
                        // 1) Set name to name array of feature hiarchy
                        // 2) Set instances to instances array
                        var instanceArr = this._getFeatureIndicators(curFeature.instances);
                        curFeature.instances = instanceArr;

                        result.push(curFeature);
                    }
                }
                return result;
            },

            getAnomalies: function() {
                return this.get('parsed') ? this.get('parsed').anomalies : [];
            },

            getFeatures: function() {
                return this.get('parsed') ? this.get('parsed').features : [];
            },

            isDisabled: function() {
                return this.get('parsed') ? this.get('parsed').disabled : true;
            },

            getHealth: function() {
                return this.get('parsed') ? this.get('parsed').health : "";
            },

            parse: function(response) {
                if (!response.entry || !response.entry[0] ||
                    !response.entry[0].content) return;
                if (!response.entry[0].content.disabled){
                    var responseObj = response.entry[0].content,
                        rootObj = {
                            name: 'splunkd',
                            display_name: 'splunkd',
                            health: responseObj.features.splunkd.health,
                            disabled: responseObj.disabled,
                            anomalies: []
                        };

                    rootObj.features = this._processFeatureGroups(responseObj.features.splunkd);

                    if (rootObj.features && rootObj.features.length > 0 && rootObj.health !== HEALTHY_STATUS) {
                        // Making a deep copy of features array
                        var featuresArrCopy = JSON.parse(JSON.stringify(responseObj.features.splunkd));
                        rootObj.anomalies = this._findAnomalies(featuresArrCopy);
                    }

                    this.set('parsed', rootObj);
                    return SplunkDBaseModel.prototype.parse.call(this, response);
                }
            }
    });
});
