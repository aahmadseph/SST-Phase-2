/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Box, Divider, Image, Button
} from 'components/ui';
import Service from 'components/RichProfile/StoreServices/Service/Service';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import EmptyService from 'components/RichProfile/StoreServices/EmptyService/EmptyService';
import dsgUtil from 'utils/dsg';
import ListPageHeader from 'components/RichProfile/ListPageHeader/ListPageHeader';
import localeUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';
import auth from 'utils/Authentication';
import userUtils from 'utils/User';
import store from 'Store';
import { HEADER_VALUE } from 'constants/authentication';

class AllStoreServices extends BaseClass {
    state = {
        currentPage: 1,
        limit: dsgUtil.PAGE_SKUS_LIMIT
    };

    componentDidMount() {
        // Analytics
        digitalData.page.category.pageType = 'user profile';
        digitalData.page.pageInfo.pageName = 'lists-services';
        this.profileSample = false;
        store.setAndWatch('user', this, userData => {
            const isAnonymous = userUtils.isAnonymous();
            this.setState({
                isAtLeastRecognized: !isAnonymous,
                isAnonymous: isAnonymous
            });

            if (!isAnonymous && !this.profileSample && userData?.user?.profileId) {
                this.getProfileSamples(userData.user.profileId);
                this.profileSample = true;
            }
        });
    }

    getProfileSamples = profileId => {
        profileApi
            .getProfileSamplesByDSG(profileId, {
                itemsPerPage: dsgUtil.PAGE_SKUS_LIMIT + 1,
                includeInactiveSkus: true,
                currentPage: this.state.currentPage,
                limit: this.state.limit + 1
            })
            .then(skus => {
                if (skus.length) {
                    let formattedSkus;

                    if (this.state.skus) {
                        formattedSkus = this.state.skus.concat(skus.slice(0, dsgUtil.PAGE_SKUS_LIMIT));
                    } else {
                        formattedSkus = skus;
                    }

                    const services = dsgUtil.combineSkusIntoServices(formattedSkus);

                    // limit is required by API so it increases with each api call, whereas pagination stays
                    // the same.  46 skus per page, but the upper limit increases until there are no more
                    // skus
                    this.setState({
                        services: services,
                        skus: skus,
                        shouldShowMore: skus.length > dsgUtil.PAGE_SKUS_LIMIT,
                        currentPage: this.state.currentPage + 1,
                        limit: this.state.limit + dsgUtil.PAGE_SKUS_LIMIT
                    });
                } else {
                    this.setState({ isEmptyService: true });

                    if (typeof callback !== 'undefined') {
                        /* eslint-disable-next-line no-undef */
                        callback();
                    }
                }
            });
    };

    showMoreServices = e => {
        e.preventDefault();
        this.getProfileSamples();
    };

    signInHandler = () => {
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/StoreServices/locales', 'AllStoreServices');
        const isMobile = Sephora.isMobile();
        const buttonWidth = '16em';

        return (
            <main>
                <ListPageHeader children={getText('inStoreServices')} />
                {this.state.isAtLeastRecognized && this.state.services && (
                    <React.Fragment>
                        {this.state.services.map((service, index) => {
                            return (
                                <React.Fragment key={index.toString()}>
                                    {index > 0 && (
                                        <Divider
                                            height={3}
                                            marginTop={5}
                                            marginBottom={4}
                                            color='nearWhite'
                                        />
                                    )}
                                    <LegacyContainer>
                                        <Service service={service} />
                                    </LegacyContainer>
                                </React.Fragment>
                            );
                        })}
                        {this.state.shouldShowMore && (
                            <Button
                                variant='secondary'
                                onClick={e => this.showMoreServices(e)}
                                hasMinWidth={true}
                                marginTop={6}
                            >
                                {getText('showMore')}
                            </Button>
                        )}
                    </React.Fragment>
                )}
                {(this.state.isAnonymous || this.state.isEmptyService) && (
                    <LegacyContainer>
                        <Box textAlign='center'>
                            {this.state.isEmptyService && <EmptyService buttonWidth={buttonWidth} />}
                            {this.state.isAnonymous && (
                                <React.Fragment>
                                    <Image
                                        src='/img/ufe/store/list-loveless.svg'
                                        display='block'
                                        marginX='auto'
                                        size={128}
                                        marginY={6}
                                    />
                                    <Text
                                        is='p'
                                        fontSize={isMobile || 'md'}
                                        lineHeight='tight'
                                        fontWeight='bold'
                                        marginBottom={5}
                                    >
                                        {getText('signInToSee')}
                                    </Text>
                                    <Button
                                        variant='primary'
                                        minWidth={buttonWidth}
                                        onClick={this.signInHandler}
                                        children={getText('signIn')}
                                    />
                                </React.Fragment>
                            )}
                        </Box>
                    </LegacyContainer>
                )}
            </main>
        );
    }
}

export default wrapComponent(AllStoreServices, 'AllStoreServices', true);
