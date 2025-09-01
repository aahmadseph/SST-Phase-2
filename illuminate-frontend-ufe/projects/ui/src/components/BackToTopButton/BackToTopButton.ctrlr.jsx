import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Button } from 'components/ui';
import { mediaQueries, site } from 'style/config';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { DebouncedScroll } from 'constants/events';

const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

function fireAnalytics(analyticsLinkName) {
    return processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            eventStrings: [anaConsts.Event.EVENT_71],
            linkName: analyticsLinkName,
            actionInfo: analyticsLinkName
        }
    });
}

const getText = getLocaleResourceFile('components/BackToTopButton/locales', 'BackToTopButton');

class BackToTopButton extends BaseClass {
    state = {
        isShown: false
    };

    render() {
        const { topPosition, showDynamicStickyFilter, filterBarHidden, customMarginTop } = this.props;

        return (
            <div
                css={{
                    position: 'fixed',
                    zIndex: 'calc(var(--layer-header) - 1)',
                    top: showDynamicStickyFilter ? (filterBarHidden ? site.headerHeight : site.headerHeight * 2) : topPosition ?? site.headerHeight,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    transition: 'all .3s',
                    [mediaQueries.sm]: {
                        top: 0
                    }
                }}
                style={
                    !this.state.isShown
                        ? {
                            visibility: 'hidden',
                            opacity: 0,
                            transform: 'translateY(-100%)'
                        }
                        : null
                }
            >
                <Button
                    variant='primary'
                    size='sm'
                    backgroundColor='rgba(0,0,0,.8)'
                    data-at={Sephora.debug.dataAt('back_to_top')}
                    onClick={this.onClick}
                    marginTop={customMarginTop ?? 3}
                    css={{ pointerEvents: 'auto' }}
                    children={getText('backToTop')}
                />
            </div>
        );
    }

    onClick = () => {
        fireAnalytics(this.props.analyticsLinkName);
        this.setState({ isShown: false });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    handleScroll = () => {
        const isShown = window.scrollY > 942;

        if (isShown !== this.state.isShown) {
            this.setState({ isShown });
        }
    };

    componentDidMount() {
        window.addEventListener(DebouncedScroll, this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedScroll, this.handleScroll);
    }
}

export default wrapComponent(BackToTopButton, 'BackToTopButton', true);
