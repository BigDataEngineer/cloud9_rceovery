import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scroll from '@splunk/react-ui/Scroll';
import TransitionOpen from '@splunk/react-ui/TransitionOpen';
import Success from '@splunk/react-icons/Success';
import Error from '@splunk/react-icons/Error';
import Warning from '@splunk/react-icons/Warning';
import QuestionCircle from '@splunk/react-icons/QuestionCircle';
import ChevronRight from '@splunk/react-icons/ChevronRight';
import ChevronDown from '@splunk/react-icons/ChevronDown';
import { includes, without } from 'lodash';
import './FeatureTree.pcss';
/* eslint-disable jsx-a11y/href-no-hash */

class FeatureTree extends Component {


    static propTypes = {
        features: PropTypes.shape({
            features: PropTypes.arrayOf(
                PropTypes.shape({})).isRequired,
        }).isRequired,
        getDistFeatureMap: PropTypes.func.isRequired,
        anomalies: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            health: PropTypes.string.isRequired,
        })).isRequired,
    };

    constructor(props, context) {
        super(props, context);
        const collapsedFeatures = [];
        for (let i = 0; i < this.props.features.features.length; i += 1) {
            const feature = this.props.features.features[i];
            const health = this.getDistHealth(feature);
            if (health === 'green') {
                collapsedFeatures.push(feature.name);
            }
        }
        this.state = {
            collapsedFeatures,
            currentTarget: 'splunkd',
        };
    }

    getDistHealth = (node) => {
        const nodeName = this.props.getDistFeatureMap(node.name);
        const nodeHealth = new Set();
        for (let anomaly = 0; anomaly < this.props.anomalies.length; anomaly += 1) {
            if (this.props.anomalies[anomaly].name.includes(nodeName)) {
                nodeHealth.add(this.props.anomalies[anomaly].health);
            }
        }
        if (nodeHealth.has('red')) {
            return 'red';
        } else if (nodeHealth.has('yellow')) {
            return 'yellow';
        }
        return node.health;
    }

    getFeatureIcon = (node) => {
        if (node.disabled) {
            return (
                <QuestionCircle
                    className="disabled"
                    data-role="health-icon"
                    data-icon="questionCircle"
                    data-test-name="question-circle-icon"
                />
            );
        }
        switch (node.health) {
            case 'red':
                return (
                    <Error
                        className="error"
                        data-role="health-icon"
                        data-icon="error"
                        data-test-name="error-icon"
                    />
                );
            case 'yellow':
                return (
                    <Warning
                        className="warning"
                        data-role="health-icon"
                        data-icon="warning"
                        data-test-name="warning-icon"
                    />
                );
            case 'green':
                return (
                    <Success
                        className="success"
                        data-role="health-icon"
                        data-icon="checkCircle"
                        data-test-name="success-icon"
                    />
                );
            default:
                return (
                    <Success
                        className="success"
                        data-role="health-icon"
                        data-icon="checkCircle"
                        data-test-name="success-icon"
                    />
                );
        }
    }

    getFeatureNodes = () => {
        const featureTree = [];
        const splunkd = this.createFeatureNode(this.props.features);
        featureTree.push(splunkd);
        featureTree.push(this.props.features.features.map((category) => {
            if (!category.features) {
                return this.createFeatureNode(category);
            }
            const children = category.features.map(feature => this.createFeatureNode(feature));
            return this.createCategoryNode(category, children);
        }));
        return featureTree;
    }

    createFeatureNode = (node) => {
        const nodeHealth = this.getDistHealth(node);
        const nodeIcon = this.getFeatureIcon(node);
        const label = node.display_name ?
            this.props.getDistFeatureMap(node.display_name) :
            node.name;
        const selected = label === this.state.currentTarget;
        const style = {
            fontWeight: selected ? '800' : 'normal',
        };
        return (
            <div className={nodeHealth} data-test="node" data-role="health-node" data-nodeid={node.name} style={style}>
                <a href="#" data-role="feature-link" onClick={this.featureNodeClicked}>{nodeIcon}{label}</a>
            </div>
        );
    }

    createCategoryNode = (node, children) => {
        const health = this.getDistHealth(node);
        const nodeIcon = this.getFeatureIcon(node);
        const label = this.props.getDistFeatureMap(node.name);
        const collapsed = includes(this.state.collapsedFeatures, node.name);
        return (
            <span>
                <div
                    className={health} data-test="node" data-role="feature-node"
                    data-nodeid={node.name}
                >
                    <a
                        href="#"
                        onClick={this.categoryHeaderClicked}
                        data-nodeid={node.name}
                    >{
                        collapsed ? (
                            <ChevronRight
                                data-role="section-icon"
                            />
                        ) :
                        (
                            <ChevronDown
                                data-role="section-icon"
                            />
                        )}{nodeIcon}{label}
                    </a>
                </div>
                <TransitionOpen animation="slideFromTop" open={!collapsed}>
                    {children}
                </TransitionOpen>
            </span>
        );
    }

    scrollEl = null;

    categoryHeaderClicked = (feature) => {
        const value = feature.currentTarget.attributes.getNamedItem('data-nodeid').value;
        const prevFeatures = this.state.collapsedFeatures;
        if (includes(prevFeatures, value)) {
            this.setState({
                collapsedFeatures: without(prevFeatures, value),
            });
        } else {
            this.setState({
                collapsedFeatures: prevFeatures.concat(value),
            });
        }
    }

    featureNodeClicked = (feature) => {
        const value = feature.currentTarget.childNodes[1].data;
        this.setState({
            currentTarget: value,
        });
    }

    handleScrollElMount = (el) => {
        this.scrollEl = el;
    };

    render() {
        const featuresNodes = this.getFeatureNodes();
        return (
            <Scroll
                elementRef={this.handleScrollElMount}
                data-role="health-scroll"
                top={this.state.top}
            >
                {featuresNodes}
            </Scroll>
        );
    }
}

export default FeatureTree;