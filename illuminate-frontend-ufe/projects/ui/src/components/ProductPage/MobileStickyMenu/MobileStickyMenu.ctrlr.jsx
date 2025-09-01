import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Flex, Link, Box, Text
} from 'components/ui';
import { DebouncedScroll } from 'constants/events';
import Chevron from 'components/Chevron';
import UI from 'utils/UI';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import anaConsts from 'analytics/constants';
import Debounce from 'utils/Debounce';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('pages/Product/locales', 'ProductPage');

function fireAnalytics(analyticsLinkName) {
    return processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            eventStrings: [anaConsts.Event.EVENT_71],
            linkName: analyticsLinkName,
            actionInfo: analyticsLinkName
        }
    });
}

const DEBOUNCE_CLICK_NAV_VALUE = 700;
const DEBOUNCE_SCROLL_VALUE = 10;
const SCROLL_OFFSET = -95;
const ROOT_MARGIN = '-20% 0% -80% 0%';
const DETAILS = 'details';
const SIMILAR = 'similar';
const QA = 'QandA';
const REVIEWS = 'ratings-reviews-container';

class MobileStickyMenu extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            activeId: '',
            showNavBar: false,
            isNavigatingByClick: false
        };
        this.observer = null;
        this.menuItems = [
            {
                label: getText('details'),
                anchor: DETAILS
            },
            {
                label: getText('similar'),
                anchor: SIMILAR
            },
            {
                label: getText('questions'),
                anchor: QA
            },
            {
                label: getText('reviews'),
                anchor: REVIEWS
            }
        ];
    }

    componentDidMount() {
        window.addEventListener(DebouncedScroll, this.handlerScroll);
        this.observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const { isIntersecting, target } = entry;
                    const { isNavigatingByClick } = this.state;

                    if (isIntersecting && !isNavigatingByClick) {
                        this.setState({ activeId: target.id });
                    }
                });
            },
            {
                rootMargin: ROOT_MARGIN
            }
        );

        this.menuItems.forEach(section => {
            const element = document.getElementById(section.anchor);

            if (element) {
                this.observer.observe(element);
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedScroll, this.handlerScroll);

        if (this.observer) {
            this.observer.disconnect();
        }
    }

    handlerScroll = () => {
        const showNavBar = window.scrollY > 930;

        if (this.state.showNavBar !== showNavBar) {
            this.setState({ showNavBar, activeId: this.menuItems[0].anchor });
        }
    };

    navigateToAnchor = id => _event => {
        this.setState({ isNavigatingByClick: true, activeId: id });
        this.debounceScrollSmooth(id);
        this.debounceResetNavigationByClick();
    };

    debounceScrollSmooth = Debounce.debounce(newActiveId => {
        UI.getScrollSmooth(newActiveId, SCROLL_OFFSET);
    }, DEBOUNCE_SCROLL_VALUE);

    debounceResetNavigationByClick = Debounce.debounce(() => {
        this.setState({ isNavigatingByClick: false });
    }, DEBOUNCE_CLICK_NAV_VALUE);

    navigateToTop = _event => {
        this.setState({ isNavigatingByClick: true });
        this.debounceResetNavigationByClick();
        fireAnalytics(analyticsConsts.LinkData.BACK_TO_TOP);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    render() {
        return this.state.showNavBar ? (
            <Box
                css={styles.stickyMenu}
                style={{ width: UI.isIOS() && UI.isChrome() ? 'calc(100vw - 16px)' : '100vw' }}
            >
                <Flex
                    alignItems='center'
                    css={styles.box}
                >
                    <button
                        css={styles.backToTop}
                        onClick={this.navigateToTop}
                    >
                        <Flex
                            justifyContent='center'
                            alignItems='center'
                        >
                            <Chevron
                                direction='up'
                                size={8}
                            />
                            <Text css={styles.topText}>{getText('top')}</Text>
                        </Flex>
                    </button>
                    <Flex
                        justifyContent='space-between'
                        alignItems='center'
                        css={styles.links}
                        {...(localeUtils.isFRCanada() && { fontSize: 12 })}
                    >
                        {this.menuItems.map(item => {
                            return (
                                <Link
                                    css={[this.state.activeId === item.anchor && styles.activeLink]}
                                    disabled={this.state.activeId === item.anchor}
                                    key={item.anchor}
                                    children={item.label}
                                    onClick={this.navigateToAnchor(item.anchor)}
                                />
                            );
                        })}
                    </Flex>
                </Flex>
            </Box>
        ) : null;
    }
}

const styles = {
    stickyMenu: {
        height: 44,
        backgroundColor: 'white',
        boxShadow: '0px 3px 5px 0px  rgba(0, 0, 0, 0.1)',
        marginLeft: -16,
        position: 'sticky',
        top: 54,
        zIndex: 9,
        transition: 'all .3s'
    },

    box: {
        height: '100%'
    },

    links: {
        width: '100%',
        padding: '0 19px'
    },

    backToTop: {
        width: 67,
        height: 44,
        backgroundColor: '#F6F6F8',
        flex: 'none'
    },

    topText: {
        marginLeft: 5
    },
    activeLink: {
        fontWeight: '700',
        borderBottom: '2px solid',
        lineHeight: 1.3
    }
};

export default wrapComponent(MobileStickyMenu, 'MobileStickyMenu', true);
