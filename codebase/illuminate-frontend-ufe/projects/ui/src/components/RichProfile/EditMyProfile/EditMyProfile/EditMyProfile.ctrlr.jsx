import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import profileActions from 'actions/ProfileActions';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import communityUtils from 'utils/Community';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import authentication from 'utils/Authentication';
import actions from 'Actions';

import {
    Flex, Divider, Image, Text
} from 'components/ui';
import Chevron from 'components/Chevron';
import mediaUtils from 'utils/Media';

const PROVIDER_TYPES = communityUtils.PROVIDER_TYPES;

const { Media } = mediaUtils;
const {
    PAGE_NAMES: { BEAUTY_PREFERENCES }
} = anaConsts;

class EditMyProfile extends BaseClass {
    constructor(props) {
        super(props);
    }

    clickHandler = (e, index, link) => {
        e.preventDefault();

        //social profile only needed for BioProfile sections
        const biAccount = index === 0 ? null : this.props.biAccount;
        const socialProfile = index === 0 ? this.props.socialProfile : null;

        //check if section is accessible for user, if not launch correct modal
        const launchCommunityRegistration = index === 0 && !socialProfile;
        const launchCommunityReOptIn = index === 0 && userUtils.needsSocialReOpt();
        const launchBIRegistration = index !== 0 && !userUtils.isBI();
        const redirectToBeautyPreferences = true && index === 1;

        if (launchCommunityRegistration) {
            authentication
                .requireLoggedInAuthentication()
                .then(() => {
                    store.dispatch(profileActions.showSocialRegistrationModal(true, userUtils.isBI(), PROVIDER_TYPES.lithium));
                })
                .catch(() => {
                    // eslint-disable-next-line no-console
                    console.debug('user sign in required');
                });
        } else if (launchCommunityReOptIn) {
            authentication
                .requireLoggedInAuthentication()
                .then(() => {
                    store.dispatch(profileActions.showSocialReOptModal(true));
                })
                .catch(() => {
                    // eslint-disable-next-line no-console
                    console.debug('user sign in required');
                });
        } else if (launchBIRegistration) {
            authentication
                .requireLoggedInAuthentication()
                .then(() => {
                    store.dispatch(actions.showBiRegisterModal(true, null, true));
                })
                .catch(() => {
                    // eslint-disable-next-line no-console
                    console.debug('user sign in required');
                });
        } else if (redirectToBeautyPreferences) {
            const analyticsData = {
                linkData: `cmnty:my profile:${BEAUTY_PREFERENCES}`
            };
            urlUtils.redirectTo('/profile/BeautyPreferences');
            anaUtils.setNextPageData(analyticsData);
        } else {
            store.dispatch(
                profileActions.showEditFlowModal(true, this.props.linksList[link], index, biAccount, socialProfile, this.props.saveProfileCallback)
            );
        }
    };

    render() {
        const { linksList, isLithiumSuccessful } = this.props;
        const getSrc = val => `/img/ufe/icons/${val.toLowerCase()}.svg`;

        return (
            <>
                {Object.keys(linksList).map((link, index) => {
                    // Remove first tab if lithium is down
                    if (!isLithiumSuccessful && index === 0) {
                        return null;
                    }

                    return (
                        <div>
                            {index !== 0 && <Divider />}
                            <Flex
                                key={index.toString()}
                                width='100%'
                                alignItems='center'
                                justifyContent='space-between'
                                fontSize='base'
                                lineHeight='tight'
                                paddingY={3}
                                paddingX={3}
                                onClick={e => this.clickHandler(e, index, link)}
                            >
                                <Flex alignItems='center'>
                                    <Image
                                        marginRight={3}
                                        src={getSrc(link)}
                                        size={24}
                                    />
                                    <Text>{linksList[link]}</Text>
                                </Flex>
                                <Media at='xs'>
                                    <Chevron
                                        marginRight='.25em'
                                        direction='right'
                                    />
                                </Media>
                            </Flex>
                        </div>
                    );
                })}
            </>
        );
    }
}

export default wrapComponent(EditMyProfile, 'EditMyProfile');
