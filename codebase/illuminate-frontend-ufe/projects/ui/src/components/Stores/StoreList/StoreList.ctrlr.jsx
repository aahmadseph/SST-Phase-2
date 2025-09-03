/* eslint-disable class-methods-use-this */
import React from 'react';
import { site, space } from 'style/config';
import anaConsts from 'analytics/constants';
import FramworkUtils from 'utils/framework';
import {
    Box, Flex, Text, Divider, Link
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import BaseClass from 'components/BaseClass/BaseClass';
import ACTIVITY from 'constants/happening/activityConstants';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import SimpleBreadCrumbs from 'components/SimpleBreadCrumbs/SimpleBreadCrumbs';

const LINK_SPACING = '.375em';
const { wrapComponent } = FramworkUtils;

class StoreList extends BaseClass {
    statesKeys = [];

    componentDidMount() {
        //analytics
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.OLR;
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.STORE_LIST;
    }

    getStatesKeys = (categoryIndex, states) => {
        if (!this.statesKeys[categoryIndex]) {
            this.statesKeys[categoryIndex] = Object.keys(states);
        }

        return this.statesKeys[categoryIndex];
    };

    renderStatesList = (categoryName, categoryIndex, states) => {
        return (
            <React.Fragment>
                <div
                    id={`states-${categoryIndex}`}
                    css={this.isDesktop || styles.mobileAnchor}
                />
                <Text
                    is='h2'
                    fontFamily='serif'
                    fontSize='xl'
                    textAlign={this.isDesktop && 'center'}
                    paddingTop={this.isDesktop ? 7 : 5}
                    marginBottom={5}
                    css={{ textTransform: 'capitalize' }}
                    children={categoryName}
                />
                <Box
                    is='ul'
                    marginX={this.isDesktop && 4}
                    css={{
                        columnCount: this.isDesktop ? 5 : 2,
                        columnGap: space[5]
                    }}
                >
                    {this.getStatesKeys(categoryIndex, states).map((stateName, stateIndex) => (
                        <Box
                            key={`state_item_${categoryIndex}_${stateIndex}`}
                            is='li'
                            css={this.isDesktop ? { breakInside: 'avoid-column' } : null}
                        >
                            <Link
                                display='block'
                                paddingY={LINK_SPACING}
                                href={`#stores-list-${categoryIndex}-${stateIndex}`}
                                css={{ textTransform: 'uppercase' }}
                                children={stateName}
                            />
                        </Box>
                    ))}
                </Box>
                {this.getStatesKeys(categoryIndex, states).map((stateName, stateIndex) => (
                    <React.Fragment key={`stores_list_${categoryIndex}_${stateIndex}`}>
                        <Divider marginTop={5} />
                        {this.renderStoresList(categoryIndex, stateName, stateIndex, states[stateName]['stores'])}
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    };

    renderStoresList = (categoryIndex, stateName, stateIndex, stores) => {
        return (
            <Box marginX={this.isDesktop && 4}>
                <div
                    id={`stores-list-${categoryIndex}-${stateIndex}`}
                    css={this.isDesktop || styles.mobileAnchor}
                />
                <Text
                    is='h3'
                    fontWeight='bold'
                    paddingTop={5}
                    marginBottom={LINK_SPACING}
                    css={{ textTransform: 'uppercase' }}
                    children={stateName}
                />
                <Box
                    is='ul'
                    css={
                        this.isDesktop && {
                            columnCount: 3,
                            columnGap: space[5]
                        }
                    }
                >
                    {stores.map((storeData, storeIndex) => (
                        <Box
                            key={`store_link_${categoryIndex}_${stateIndex}_${storeIndex}`}
                            is='li'
                            css={this.isDesktop && { breakInside: 'avoid-column' }}
                        >
                            <Link
                                display='block'
                                paddingY={LINK_SPACING}
                                href={storeData.targetUrl}
                            >
                                {storeData.displayName}
                            </Link>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    getBreadCrumbsContent = getText => {
        return [
            {
                displayName: getText('happeningAtSephora'),
                href: ACTIVITY.OLR_URLS.LANDING_PAGE
            },
            {
                displayName: getText('findASephora'),
                href: ACTIVITY.OLR_URLS.STORE_LOCATOR
            }
        ];
    };

    getBreadcrumbsSeoJson = getText => {
        const domPrefix = 'www';

        return {
            '@context': 'http://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    position: 1,
                    '@type': 'ListItem',
                    item: {
                        name: getText('happeningAtSephora'),
                        '@id': 'https://' + domPrefix + '.sephora.com' + ACTIVITY.OLR_URLS.LANDING_PAGE
                    }
                },
                {
                    position: 2,
                    '@type': 'ListItem',
                    item: {
                        name: getText('storeLocator'),
                        '@id': 'https://' + domPrefix + '.sephora.com' + ACTIVITY.OLR_URLS.STORE_LOCATOR
                    }
                },
                {
                    position: 3,
                    '@type': 'ListItem',
                    item: {
                        name: getText('storeLocations'),
                        '@id': 'https://' + domPrefix + '.sephora.com' + ACTIVITY.OLR_URLS.COMPLETE_STORE_LIST
                    }
                }
            ]
        };
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Stores/StoreList/locales', 'StoreList');

        this.isDesktop = Sephora.isDesktop();
        const { storeGroups } = this.props;
        const storeGroupsKeys = Object.keys(storeGroups);

        return (
            <LegacyContainer>
                <SimpleBreadCrumbs
                    marginTop={this.isDesktop ? 4 : 3}
                    marginBottom={this.isDesktop ? 5 : 4}
                    lastItemTagName='p'
                    items={this.getBreadCrumbsContent(getText)}
                />
                <Box
                    is='main'
                    lineHeight='tight'
                >
                    <Text
                        is='h1'
                        fontFamily='serif'
                        fontSize={this.isDesktop ? '2xl' : 'xl'}
                        textAlign='center'
                        children={getText('completeStoreList')}
                    />
                    <Flex
                        is='ul'
                        flexDirection={this.isDesktop || 'column'}
                        justifyContent='center'
                    >
                        {storeGroupsKeys.map((categoryName, catIndex) => (
                            <Box
                                key={`group_link_${catIndex}`}
                                is='li'
                                marginTop={this.isDesktop ? 5 : 4}
                            >
                                <Link
                                    display='block'
                                    textAlign='center'
                                    paddingX={5}
                                    paddingY={3}
                                    marginY={-3}
                                    href={`#states-${catIndex}`}
                                    css={{ textTransform: 'uppercase' }}
                                    children={categoryName}
                                />
                            </Box>
                        ))}
                    </Flex>
                    {storeGroupsKeys.map((categoryName, catIndex) => (
                        <React.Fragment key={`states_${catIndex}`}>
                            <SectionDivider marginBottom={null} />
                            {this.renderStatesList(categoryName, catIndex, storeGroups[categoryName]['states'])}
                        </React.Fragment>
                    ))}
                </Box>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(this.getBreadcrumbsSeoJson(getText)) }}
                />
            </LegacyContainer>
        );
    }
}

const styles = {
    mobileAnchor: {
        position: 'absolute',
        marginTop: -site.headerHeight
    }
};

export default wrapComponent(StoreList, 'StoreList');
