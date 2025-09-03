/* eslint class-methods-use-this: 0 */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import keyConsts from 'utils/KeyConstants';
import urlUtils from 'utils/Url';

import { Box, Image } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import BccBase from 'components/Bcc/BccBase/BccBase';
import BccTab from 'components/Bcc/BccTab/BccTab';

const MAX_TABS_TO_DISPLAY = 5;

class BccTabsList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showTabsList: false,
            tabsList: [],
            activeTab: 0,
            hoveredTab: null
        };

        if (!Sephora.isNodeRender) {
            this.setActiveTab = this.setActiveTab.bind(this);
            this.getActiveTab = this.getActiveTab.bind(this);
            this.setHoveredTab = this.setHoveredTab.bind(this);
            this.removeHoveredTab = this.removeHoveredTab.bind(this);
            this.getTabsList = this.getTabsList.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.getTabImage = this.getTabImage.bind(this);
        }
    }

    setActiveTab = (index, compName) => () => {
        this.setState({ activeTab: index });

        let prop55 = 'tab';
        prop55 += compName ? ':' + compName : '';
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71],
                actionInfo: prop55,
                linkName: 'D=c55'
            }
        });
    };

    getActiveTab = componentList => {
        const tabsList = componentList.slice(0, MAX_TABS_TO_DISPLAY);
        const index = tabsList.findIndex(tab => tab.defaultTab);

        return index > 0 ? index : 0;
    };

    setHoveredTab = index => {
        this.setState({ hoveredTab: index });
    };

    removeHoveredTab = () => {
        this.setState({ hoveredTab: null });
    };

    getTabsList = componentList => {
        const tabsList = componentList.slice(0, MAX_TABS_TO_DISPLAY);
        const firstTabDefault = tabsList.filter(tab => tab.defaultTab).length > 1;

        tabsList.forEach((tab, index) => {
            if (firstTabDefault) {
                tab.defaultTab = index === 0;
            }
        });

        return tabsList;
    };

    handleKeyDown = (e, index) => {
        const tabs = e.target.parentNode.parentNode.childNodes;
        const lastTab = tabs.length - 1;

        switch (e.key) {
            case keyConsts.END:
                e.preventDefault();
                tabs[lastTab].childNodes[0].focus();

                break;
            case keyConsts.HOME:
                e.preventDefault();
                tabs[0].childNodes[0].focus();

                break;
            case keyConsts.LEFT:
                e.preventDefault();

                if (index === 0) {
                    tabs[lastTab].childNodes[0].focus();
                } else {
                    tabs[index - 1].childNodes[0].focus();
                }

                break;
            case keyConsts.RIGHT:
                e.preventDefault();

                if (index === lastTab) {
                    tabs[0].childNodes[0].focus();
                } else {
                    tabs[index + 1].childNodes[0].focus();
                }

                break;
            case keyConsts.TAB:
                if (index !== this.state.activeTab) {
                    e.preventDefault();
                    tabs[this.state.activeTab].childNodes[0].focus();
                }

                break;
            default:
                break;
        }
    };

    /* eslint-disable-next-line complexity */
    getTabImage = (comp, index) => {
        const { desktopHeight, mWebHeight, mWebGutter } = this.props;
        const isMobile = Sephora.isMobile();
        const isTouch = Sephora.isTouch;
        const isActiveTab = this.state.activeTab === index;
        const isHoveredTab = this.state.hoveredTab === index;

        const compName = comp.name;
        const imagePath = isMobile ? comp.mWebTabImagePath : comp.tabImagePath;
        const hoverPath = comp.tabHoverPath;
        const selectedPath = isMobile ? comp.mWebTabSelectedPath : comp.tabSelectedPath;

        const imageAltText = comp.tabImagePathAltText || '';
        const hoverAltText = comp.tabHoverPathAltText;
        const selectedAltText = comp.tabSelectedPathAltText;

        const imgProps = {
            maxHeight: desktopHeight || mWebHeight,
            disableLazyLoad: comp.disableLazyLoad
        };

        return imagePath ? (
            <LegacyGrid.Cell
                key={index.toString()}
                marginTop={mWebGutter && index > 0 && 4}
            >
                <Box
                    aria-label={imageAltText}
                    role='tab'
                    id={'tab' + comp.name}
                    aria-selected={isActiveTab}
                    aria-controls={'tabpanel' + comp.name}
                    tabIndex={isActiveTab ? '0' : '-1'}
                    marginX='auto'
                    onKeyDown={e => this.handleKeyDown(e, index)}
                    onClick={this.setActiveTab(index, compName)}
                    onMouseEnter={!isTouch && (() => this.setHoveredTab(index))}
                    onFocus={
                        !isTouch &&
                        (() => {
                            if (this.state.hoveredTab !== index) {
                                this.setHoveredTab(index);
                            }
                        })
                    }
                    onMouseLeave={!isTouch && (() => this.removeHoveredTab(index))}
                    onBlur={
                        !isTouch &&
                        (() => {
                            if (this.state.hoveredTab === index) {
                                this.removeHoveredTab(index);
                            }
                        })
                    }
                >
                    {isActiveTab && (
                        <Image
                            {...imgProps}
                            src={selectedPath || imagePath}
                            alt={selectedAltText || imageAltText}
                        />
                    )}

                    {!isActiveTab && isHoveredTab && hoverPath && !isTouch && (
                        <Image
                            {...imgProps}
                            src={hoverPath || imagePath}
                            alt={hoverAltText || imageAltText}
                        />
                    )}

                    {!isActiveTab && !isHoveredTab && (
                        <Image
                            {...imgProps}
                            src={imagePath}
                            alt={imageAltText}
                        />
                    )}
                </Box>
            </LegacyGrid.Cell>
        ) : null;
    };

    render() {
        const isMobile = Sephora.isMobile();
        const { showTabsList, tabsList } = this.state;
        const { disableLazyLoad, desktopGutter, desktopMargin } = this.props;

        const tabName = this.state.activeTab ? `tab-${tabsList[this.state.activeTab].name}` : null;

        return showTabsList ? (
            <BccBase
                ref={this.props.name}
                data-lload={!disableLazyLoad}
                {...this.props}
            >
                <Box
                    marginX={desktopMargin ? 5 : isMobile && this.props.isContained ? '-container' : null}
                    paddingX={isMobile && 3}
                >
                    <LegacyGrid
                        aria-label={this.props.description}
                        role='tablist'
                        fill={!isMobile}
                        gutter={desktopGutter && 4}
                    >
                        {tabsList.map(this.getTabImage)}
                    </LegacyGrid>
                </Box>
                <BccTab
                    key={tabName}
                    {...tabsList[this.state.activeTab]}
                />
            </BccBase>
        ) : null;
    }

    componentDidMount() {
        const { componentList } = this.props;

        if (componentList.length < 2) {
            this.setState({ showTabsList: false });
        } else {
            const tabsList = this.getTabsList(componentList);
            const { activeTab = [] } = urlUtils.getParams();
            const activeTabIndex = componentList.findIndex(comp => activeTab.indexOf(comp.name) !== -1);

            this.setState({
                tabsList,
                showTabsList: true,
                activeTab: activeTabIndex !== -1 ? activeTabIndex : this.getActiveTab(componentList)
            });
        }

        // Update BccComponentList loading state when this is mounted
        this.props.onChildLoad();
    }
}

export default wrapComponent(BccTabsList, 'BccTabsList', true);
