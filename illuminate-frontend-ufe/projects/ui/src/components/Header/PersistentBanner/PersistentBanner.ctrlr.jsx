import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Banner from 'components/Content/Banner';
import contentConsts from 'constants/content';
import Empty from 'constants/empty';
import anaConsts from 'analytics/constants';

const { BANNER_TYPES, CONTEXTS } = contentConsts;

const DEBOUNCE_TIME = 2000;

class PersistentBanner extends BaseClass {
    ref = React.createRef();

    constructor(props) {
        super(props);

        this.urlObserver = null;
        this.debounceTimer = null;

        this.state = {
            currentPath: null,
            mergedProps: null
        };
    }

    fireImpressionEvent = () => {
        const { triggerImpression } = this.props;

        if (triggerImpression) {
            triggerImpression();
        }
    };

    componentDidMount() {
        const currentPath = window.location.pathname;
        this.setState({ currentPath });

        this.urlObserver = new MutationObserver(() => {
            this.debounceLocationChange();
        });

        this.urlObserver.observe(document.body, { subtree: true, childList: true });

        this.fireImpressionEvent();

        window.addEventListener(anaConsts.Event.SIGN_IN_RELOAD, () => {
            this.fireImpressionEvent();
        });
    }

    componentWillUnmount() {
        if (this.urlObserver) {
            this.urlObserver.disconnect();
            this.urlObserver = null;
        }

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);

            this.debounceTimer = null;
        }
    }

    handleLocationChange = () => {
        const newPath = window.location.pathname;

        if (newPath === this.state.currentPath) {
            return;
        }

        this.setState({ currentPath: newPath });
        const { triggerImpression } = this.props;

        if (triggerImpression) {
            triggerImpression();
        }
    };

    debounceLocationChange = () => {
        clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            this.handleLocationChange();
        }, DEBOUNCE_TIME);
    };

    delegateClick = () => {
        if (this.props.triggerClick) {
            const { data } = this.props;
            const firstBanner = data[0];

            this.props.triggerClick(firstBanner);
        }
    };

    render() {
        const content = (this.props.data && Array.isArray(this.props.data) && this.props.data[0]) || Empty.Object;
        const personalization = content?.personalization || Empty.Object;

        return Object.keys(content).length ? (
            <div ref={this.ref}>
                <Banner
                    {...content}
                    bannerType={BANNER_TYPES.PERSISTENT}
                    marginTop={[0, 0]}
                    marginBottom={[0, 0]}
                    personalization={personalization}
                    context={CONTEXTS.PERSISTENT_BANNER}
                    useMediaHeight={this.props.useMediaHeight}
                    fireClickTrackingEvent={false}
                    delegateClick={this.delegateClick}
                />
            </div>
        ) : null;
    }
}

export default wrapComponent(PersistentBanner, 'PersistentBanner', true);
