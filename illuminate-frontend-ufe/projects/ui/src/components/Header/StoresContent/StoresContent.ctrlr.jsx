/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import storeUtils from 'utils/Store';
import urlUtils from 'utils/Url';
import StoreSwitcher from 'components/Header/StoreSwitcher';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import {
    Box, Flex, Link, Grid, Text, Icon, Image, Divider, Button
} from 'components/ui';
import { space } from 'style/config';
import anaUtils from 'analytics/utils';
import Location from 'utils/Location';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

import localeUtils from 'utils/LanguageLocale';
import PropTypes from 'prop-types';
import Action from 'components/Content/Action';

const ActionFlex = Action(Flex);

const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/Header/StoresContent/locales', 'StoresContent')(text, vars);

class StoresContent extends BaseClass {
    state = {
        preferredStoreInfo: null,
        isModalOpen: false
    };

    handleOnTrackNavClick = (navClickArg, targetUrl) => () => {
        this.trackNavClick(navClickArg);
        Location.navigateTo(null, targetUrl);
    };

    handleOpenLinkClick = address => () => {
        //needed to work properly for mobile devices
        urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(address));

        return false;
    };

    handleOnDismiss = onDismiss => (_e, callback) => {
        onDismiss && onDismiss(callback);
    };

    renderServicesAndEventsContent = () => {
        const { withCallbackNavigation, items, onDismiss } = this.props;

        return (
            <>
                {items &&
                    items.map((item, index) => {
                        const linkWithoutApostrophes = item.label?.replace('\'', '')?.toLowerCase();

                        return (
                            <React.Fragment key={item.sid || index.toString()}>
                                {index > 0 && (
                                    <Divider
                                        marginX={-4}
                                        marginY={4}
                                    />
                                )}
                                <ActionFlex
                                    sid={item.action?.sid}
                                    action={item.action}
                                    onClick={this.handleOnDismiss(onDismiss)}
                                    analyticsNextPageData={this.buildNextPageData(linkWithoutApostrophes)}
                                    dontUseInternalTracking={true}
                                    withCallbackNavigation={withCallbackNavigation}
                                >
                                    {item.media?.src && (
                                        <Image
                                            src={item.media.src}
                                            size={52}
                                            marginRight={3}
                                        />
                                    )}
                                    {item.label && (
                                        <Box flex={1}>
                                            <span
                                                className='Link-target'
                                                children={item.label}
                                            />
                                            {item.description && (
                                                <Text
                                                    display='block'
                                                    marginTop='.25em'
                                                    color='gray'
                                                    fontSize='sm'
                                                    children={item.description}
                                                />
                                            )}
                                        </Box>
                                    )}
                                </ActionFlex>
                            </React.Fragment>
                        );
                    })}
                <Divider
                    marginY={4}
                    marginX={-4}
                    height={3}
                    color='nearWhite'
                />
                <Flex
                    marginTop={4}
                    marginX={-3}
                >
                    <Link
                        onClick={this.handleOnTrackNavClick('my reservations', '/happening/reservations')}
                        padding={3}
                        marginY={-3}
                        color='blue'
                        children={getText('myReservation')}
                    />
                    <span children='|' />
                    <Link
                        onClick={this.handleOnTrackNavClick('beauty services faq')}
                        href='/beauty/beauty-services-faq'
                        padding={3}
                        marginY={-3}
                        color='blue'
                        children={getText('beautyFAQ')}
                    />
                </Flex>
            </>
        );
    };

    render() {
        const { renderServicesAndEventsOnly } = this.props;

        if (renderServicesAndEventsOnly) {
            return (
                <Box
                    paddingX={4}
                    lineHeight='tight'
                >
                    {this.renderServicesAndEventsContent()}
                </Box>
            );
        }

        const { preferredStoreInfo } = this.state;
        const storeClosingTime =
            preferredStoreInfo && preferredStoreInfo.storeId && storeUtils.getStoreTodayClosingTime(preferredStoreInfo.storeHours);
        const curbsidePickupFlag = storeUtils.isCurbsideEnabled(preferredStoreInfo);
        const showConciergeCurbsidePickupIndicator = curbsidePickupFlag && storeUtils.isConciergeCurbsideEnabled(preferredStoreInfo);
        const showCurbsidePickupIndicator = curbsidePickupFlag && !showConciergeCurbsidePickupIndicator;

        return (
            <Box
                paddingX={4}
                lineHeight='tight'
            >
                {preferredStoreInfo && preferredStoreInfo.storeId ? (
                    <React.Fragment>
                        <Grid
                            columns='1fr auto'
                            alignItems='flex-start'
                        >
                            <dl data-at={Sephora.debug.dataAt('store_info')}>
                                <dt
                                    data-at={Sephora.debug.dataAt('store_name')}
                                    children={storeUtils.getStoreDisplayNameWithSephora(preferredStoreInfo)}
                                    css={{ fontWeight: 'var(--font-weight-bold)' }}
                                />
                                <dd>{preferredStoreInfo.address.address1}</dd>
                                {preferredStoreInfo.address.address2 && <dd>{preferredStoreInfo.address.address2}</dd>}
                                <dd>{`${preferredStoreInfo.address.city}, ${preferredStoreInfo.address.state} ${preferredStoreInfo.address.postalCode}`}</dd>
                                <dd css={{ marginTop: space[2] }}>
                                    {storeClosingTime && storeClosingTime !== 'Closed' ? getText('openUntil', [storeClosingTime]) : getText('closed')}
                                </dd>
                                {showCurbsidePickupIndicator && (
                                    <CurbsidePickupIndicator
                                        is='dd'
                                        marginTop={2}
                                        dataAt={Sephora.isMobile() ? 'curbside_indicator_stores_modal_label' : 'curbside_indicator_flyout_label'}
                                    />
                                )}
                                {showConciergeCurbsidePickupIndicator && (
                                    <ConciergeCurbsidePickupIndicator
                                        is='dd'
                                        dataAt={
                                            Sephora.isMobile()
                                                ? 'concierge_curbside_indicator_stores_modal_label'
                                                : 'concierge_curbside_indicator_flyout_label'
                                        }
                                        marginTop={2}
                                    />
                                )}
                            </dl>
                            <Link
                                data-at={Sephora.debug.dataAt('change_store_btn')}
                                padding={3}
                                margin={-3}
                                color='blue'
                                onClick={this.toggleModal}
                                children={getText('changeStore')}
                            />
                        </Grid>
                        <Flex
                            marginTop={4}
                            marginX={-3}
                        >
                            <Link
                                padding={3}
                                marginY={-3}
                                color='blue'
                                onClick={this.handleOnTrackNavClick('view details', preferredStoreInfo.targetUrl)}
                                id='view-details'
                                data-at={Sephora.debug.dataAt('view_details_link')}
                                children={getText('viewDetails')}
                            />
                            <span children='|' />
                            <Link
                                padding={3}
                                marginY={-3}
                                color='blue'
                                onClick={this.handleOpenLinkClick(preferredStoreInfo.address)}
                                children={getText('getDirections')}
                            />
                        </Flex>
                    </React.Fragment>
                ) : (
                    <Flex
                        justifyContent='center'
                        paddingBottom={2}
                    >
                        <Button
                            variant='primary'
                            size='sm'
                            data-at={Sephora.debug.dataAt('choose_your_store_btn')}
                            children={getText('chooseYourStore')}
                            onClick={this.toggleModal}
                        />
                    </Flex>
                )}
                <Divider
                    marginY={4}
                    marginX={-4}
                    height={3}
                    color='nearWhite'
                />
                {this.state.isModalOpen && (
                    <StoreSwitcher
                        onDismiss={this.toggleModal}
                        options={{ isHeader: true }}
                    />
                )}
                <Link
                    href='/happening/stores/sephora-near-me'
                    onClick={() => this.trackNavClick('find a store')}
                    id='find-a-sephora'
                    padding={4}
                    margin={-4}
                    fontWeight='bold'
                    display='flex'
                    alignItems='center'
                >
                    <Icon
                        name='location'
                        marginLeft={-1}
                        marginRight={1}
                    />
                    {getText('findASephora')}
                </Link>
                <Divider
                    marginY={4}
                    marginX={-4}
                    height={3}
                    color='nearWhite'
                />
                {this.renderServicesAndEventsContent()}
            </Box>
        );
    }

    trackNavClick = (link, targetUrl = '') => {
        const page = targetUrl?.split('#')[0];
        const isTargetEqualToCurrentPage = Location.getLocation().pathname === page;

        // if the user pathname and target URL are in the same page
        if (isTargetEqualToCurrentPage) {
            const pageType = digitalData.page.category.pageType;
            const pageName = digitalData.page.pageInfo.pageName;
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: `${pageType}:${pageName}:n/a:*`,
                    navigationInfo: `top nav:stores:${link}:${link}:${link}`
                }
            });
        } else {
            const { firstLevel = 'top nav' } = this.props;
            const path = [firstLevel, 'stores', link];
            anaUtils.setNextPageData({ navigationInfo: anaUtils.buildNavPath(path) });
        }
    };

    componentDidMount() {
        store.setAndWatch('user.preferredStoreInfo', this, null, true);
    }

    toggleModal = () => {
        this.state.isModalOpen && this.props.onDismiss && this.props.onDismiss();
        this.setState({ isModalOpen: !this.state.isModalOpen });
    };

    buildNextPageData = link => {
        const { firstLevel = 'top nav' } = this.props;
        const path = [firstLevel, 'stores', link];
        const nextPageData = { navigationInfo: anaUtils.buildNavPath(path) };

        return nextPageData;
    };
}

StoresContent.propTypes = {
    withCallbackNavigation: PropTypes.bool
};

StoresContent.defaultProps = {
    withCallbackNavigation: false
};

export default wrapComponent(StoresContent, 'StoresContent', true);
