import React, { Component } from 'react';
import framework from 'utils/framework';
const { wrapHOC, wrapHOCComponent } = framework;

const areAllEventsFired = eventsToListen => {
    let allEventsAreFired = true;
    const { loadEvents = {} } = Sephora.Util.InflatorComps.services || {};

    eventsToListen.forEach(event => {
        allEventsAreFired = allEventsAreFired && !!loadEvents[event];
    });

    return allEventsAreFired;
};

const withAfterEventsRendering = wrapHOC((WrappedComponent, eventsToListen) => {
    class AfterEventsRendering extends Component {
        constructor(props) {
            super(props);

            this.shouldUnsubscribe = false;
            const shouldRender = areAllEventsFired(eventsToListen);
            this.state = { shouldRender };
        }

        componentDidMount() {
            if (!this.state.shouldRender) {
                eventsToListen.forEach(event => window.addEventListener(event, this.renderWrappedComponent));
                this.shouldUnsubscribe = true;
            }
        }

        componentWillUnmount() {
            if (this.shouldUnsubscribe) {
                eventsToListen.forEach(event => window.removeEventListener(event, this.renderWrappedComponent));
            }
        }

        render() {
            if (!this.state.shouldRender) {
                return null;
            }

            return <WrappedComponent {...this.props} />;
        }

        renderWrappedComponent = () => {
            const allEventsAreFired = areAllEventsFired(eventsToListen);

            if (allEventsAreFired) {
                this.componentWillUnmount();
                this.setState({ shouldRender: true });
            }
        };
    }

    return wrapHOCComponent(AfterEventsRendering, 'AfterEventsRendering', [WrappedComponent, eventsToListen]);
});

export default withAfterEventsRendering;
