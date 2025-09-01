/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, site } from 'style/config';
import Chevron from 'components/Chevron';
import catalogUtils from 'utils/Search';
import Location from 'utils/Location';
import { Flex, Link } from 'components/ui';
import store from 'store/Store';
import searchActions from 'actions/SearchActions';
import navClickBindings from 'analytics/bindingMethods/pages/all/navClickBindings';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import UrlUtils from 'utils/Url';

/*
[CRMTS-1395]
  Accordingly with this commit https://gitlab.lipstack.sephoraus.com/illuminate/frontend/ufe/-/commit/fe596327363fa5d344d7fe29b86da8071d412a7c
  Github link: https://github.com/Sephora-US-Digital/illuminate-frontend-ufe/commit/fe596327363fa5d344d7fe29b86da8071d412a7c
  HIDE_AND_PLACEMENT was decommissioned but not fully removed from code by any developer, so we are doing this into this new commit.
  import { HIDE_AND_PLACEMENT } from 'constants/TestTarget';
*/

const { getLink } = UrlUtils;

const styles = {
    listItem: {
        display: 'flex',
        alignItems: 'center'
    }
};

const EMPTY_ARR = [];

const isProductPage = () => Location.isProductPage();
const isSearchPage = () => Location.isSearchPage();

class BreadCrumbs extends BaseClass {
    state = { items: EMPTY_ARR };

    componentDidMount() {
        this.buildBreadcrumbsData(this.props.items);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.items !== this.props.items) {
            this.buildBreadcrumbsData(this.props.items);
        }
    }

    buildBreadcrumbsData = items => {
        let nextItems = items;

        if (!isProductPage()) {
            const buildItems = (elements = [], level = 0) => {
                const item = { ...(elements.length === 1 ? elements[0] : this.getCurrentItem(elements)) };

                if (item && Object.keys(item).length > 0) {
                    if (level !== 0) {
                        item.clickable = true;
                    }

                    const result = [item];

                    if (item.subCategories) {
                        result.push(...buildItems(item.subCategories, level + 1));
                    }

                    return result;
                }

                return [];
            };

            nextItems = buildItems(items, 0);
        }

        // Maintain the same memory ref for an empty result to prevent rendering
        if (nextItems.length === 0) {
            nextItems = EMPTY_ARR;
        }

        if (this.state.items !== nextItems) {
            this.setState({ items: nextItems });
        }
    };

    getCurrentItem = items => {
        const catalogKeyName = this.props.catalogKeyName;
        const currentMatch = items.filter(item => {
            return catalogUtils.getPropertyNameFromCategory(item, catalogKeyName) === this.props.currentItemId;
        });

        return currentMatch[0];
    };

    onClick = (e, catalogItemId, catalogItem = {}) => {
        const { targetUrl, node, nodeStr } = catalogItem;

        const breadcrumbNames = this.props.items.map(item => replaceSpecialCharacters(item.displayName));
        navClickBindings.trackNavClick(['breadcrumb nav', ...breadcrumbNames]);
        // In RootCategory and Catalog page the catalogItem has the node prop but not on Search or PDP
        const nodeValue = node || nodeStr;

        if (!targetUrl && nodeValue) {
            e.preventDefault();
            store.dispatch(searchActions.setSearchCategory(nodeValue));
            this.props.onClick && this.props.onClick(true, nodeValue);
        } else {
            /*
                ILLUPH-115388
                Breadcrumbs on search page has onClick prop and it should set category but in
                PDP we don't have that callback and it should not set any category just go to
                targetUrl.
                Also, Root category pages require a full page load even if an onClick prop is present
            */
            if (this.props.onClick && !(this.props.catalogKeyName === 'catalogId' && catalogItem.level === 0)) {
                e.preventDefault();
                store.dispatch(searchActions.setCategory(catalogItem.targetUrl));
                this.props.onClick(true, catalogItemId);
            } else {
                Location.navigateTo(e, catalogItem.targetUrl);
            }
        }
    };

    render() {
        const dataAtValue = Sephora.debug.dataAt('pdp_bread_crumb');
        const catalogKeyName = this.props.catalogKeyName;

        const breadcrumbs = this.state.items.map((item, index) => {
            let component;

            const isLastItem = this.state.items.length > 1 && index === this.state.items.length - 1;

            let link;

            const linkOptions = {
                clickable: (
                    <Link
                        data-at={dataAtValue}
                        key={item.targetUrl || index.toString()}
                        href={getLink(item.targetUrl)}
                        onClick={e => this.onClick(e, catalogUtils.getPropertyNameFromCategory(item, catalogKeyName), item)}
                        padding={2}
                        margin={-2}
                    >
                        {item.displayName}
                    </Link>
                ),
                inActive: (
                    <h1
                        key={index.toString()}
                        css={{ color: colors.black }}
                    >
                        {item.displayName || item.name}
                    </h1>
                )
            };

            if (isSearchPage()) {
                if (item && (item.node || item.nodeStr) && !isLastItem) {
                    link = linkOptions.clickable;
                } else if (item.displayName) {
                    link = linkOptions.inActive;
                } else {
                    link = null;
                }
            } else {
                if ((item.targetUrl && !isLastItem) || isProductPage()) {
                    link = linkOptions.clickable;
                } else {
                    link = item.displayName || item.name ? linkOptions.inActive : null;
                }
            }

            if (index < this.state.items.length - 1) {
                component = (
                    <li
                        key={index.toString()}
                        css={styles.listItem}
                    >
                        {link}
                        <Chevron
                            direction='right'
                            size='.5em'
                            marginX={2}
                        />
                    </li>
                );
            } else {
                component = <li key={index.toString()}>{link}</li>;
            }

            return component;
        });

        const isBreadcrumbsABTest = this.props.productBreadcrumbsExperience;
        /*
        [CRMTS-1395]
           This line of code below was never removed when CRMTS-1395 was merged.
           this.props.productBreadcrumbsExperience && this.props.productBreadcrumbsExperience === HIDE_AND_PLACEMENT.CHANGE_PLACEMENT;
        */

        return (
            <nav aria-label='Breadcrumb'>
                <Flex
                    is='ol'
                    fontSize='sm'
                    alignItems='center'
                    lineHeight='tight'
                    color='gray'
                    flexWrap={isBreadcrumbsABTest && !this.props.isRegularProductSmallView && 'wrap'}
                    maxWidth={isBreadcrumbsABTest && !this.props.isRegularProductSmallView && 210}
                    height={isBreadcrumbsABTest ? 20 : [40, site.BREADCRUMB_HEIGHT]}
                >
                    {breadcrumbs}
                </Flex>
            </nav>
        );
    }
}

export default wrapComponent(BreadCrumbs, 'BreadCrumbs', true);
