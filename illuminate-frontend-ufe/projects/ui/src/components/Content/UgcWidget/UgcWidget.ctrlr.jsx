import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Location from 'utils/Location';
import LazyLoad from 'components/LazyLoad';
import PixleeContainer from 'components/Content/PixleeContainer/PixleeContainer';
import pixleeUtils from 'utils/pixlee';
import { PostLoad } from 'constants/events';

const { loadPixlee } = pixleeUtils;

class UgcWidget extends BaseClass {
    componentDidMount() {
        if (!Location.isHomepage()) {
            this.props.getPersonalizedEnabledComponents();
        }

        if (this.isPixleeEnabled()) {
            Sephora.Util.onLastLoadEvent(window, [PostLoad], this.initPixlee);
        }
    }

    componentDidUpdate(prevProps) {
        if (!Location.isHomepage() && prevProps?.user?.userId !== this.props.user?.userId) {
            this.props.getPersonalizedEnabledComponents();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(PostLoad, this.initPixlee);
    }

    initPixlee = () => {
        loadPixlee();
    };

    isPixleeEnabled = () => {
        const { widgetId } = this.props;

        return Sephora.configurationSettings.enableUGCWidget && widgetId;
    };

    getPixleeWidgetId = () => {
        if (this.isPixleeEnabled() && !this.props.isAnonymous) {
            const { widgetId } = this.props;

            return widgetId;
        } else {
            return null;
        }
    };

    render() {
        const pixleeWidgetId = this.getPixleeWidgetId();

        return (
            <>
                {pixleeWidgetId && (
                    <LazyLoad
                        component={PixleeContainer}
                        widgetId={pixleeWidgetId}
                        containerId='PixleeContainer'
                    />
                )}
            </>
        );
    }
}

UgcWidget.propTypes = {
    sid: PropTypes.string,
    widgetId: PropTypes.string
};

UgcWidget.defaultProps = {
    sid: null,
    widgetId: null
};

export default wrapComponent(UgcWidget, 'UgcWidget', true);
