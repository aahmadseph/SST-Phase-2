/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import ProfileActions from 'actions/ProfileActions';

import {
    Container, Box, Text, Button
} from 'components/ui';
import Skin from 'components/RichProfile/EditMyProfile/Content/Skin/Skin';
import Hair from 'components/RichProfile/EditMyProfile/Content/Hair/Hair';
import Eyes from 'components/RichProfile/EditMyProfile/Content/Eyes/Eyes';
import ContentDivider from 'components/RichProfile/EditMyProfile/Content/ContentDivider';
import AddReviewTitle from 'components/AddReview/AddReviewTitle/AddReviewTitle';
import AddReviewNote from 'components/AddReview/AddReviewNote/AddReviewNote';

import biUtils from 'utils/BiProfile';
import LanguageLocale from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import { CATEGORY_TYPE } from 'constants/beautyPreferences';

class AboutMe extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            ...this.props,
            submitButtonDisabled: false
        };
    }

    componentWillReceiveProps(updatedProps) {
        this.setState(updatedProps);
    }

    render() {
        const getText = LanguageLocale.getLocaleResourceFile('components/AddReview/AboutMe/locales', 'AboutMe');
        const { aboutMeBiTraits } = this.state;

        const excludeSkinType = aboutMeBiTraits?.indexOf(biUtils.TYPES.SKIN_TYPE) < 0;
        const excludeSkinConcerns = aboutMeBiTraits?.indexOf(biUtils.TYPES.SKIN_CONCERNS) < 0;
        const excludeSkinTone = aboutMeBiTraits?.indexOf(biUtils.TYPES.SKIN_TONE) < 0;
        const excludeAgeRange = aboutMeBiTraits?.indexOf(biUtils.TYPES.AGE_RANGE) < 0;
        const excludeSkin = excludeSkinType && excludeSkinConcerns && excludeSkinTone && excludeAgeRange;

        const excludeHairColor = aboutMeBiTraits?.indexOf(biUtils.TYPES.HAIR_COLOR) < 0;
        const excludeHairType = aboutMeBiTraits?.indexOf(biUtils.TYPES.HAIR_TYPE) < 0;
        const excludeHairConcerns = aboutMeBiTraits?.indexOf(biUtils.TYPES.HAIR_CONCERNS) < 0;
        const excludeHair = excludeHairColor && excludeHairType && excludeHairConcerns;

        return (
            <Container hasLegacyWidth={true}>
                <AddReviewTitle children={getText('aboutYou')} />
                <Text
                    is='p'
                    textAlign='center'
                    marginBottom={6}
                >
                    {getText('optionalInformation')}
                </Text>
                <Box
                    maxWidth={475}
                    marginX='auto'
                >
                    {excludeSkin || (
                        <>
                            <Skin
                                ref={skin => (this.skin = skin)}
                                excludeSkinType={excludeSkinType}
                                excludeSkinConcerns={excludeSkinConcerns}
                                excludeSkinTone={excludeSkinTone}
                                excludeAgeRange={excludeAgeRange}
                                getRefinementItems={this.getRefinementItems}
                            />
                            <ContentDivider />
                        </>
                    )}
                    {excludeHair || (
                        <>
                            <Hair
                                ref={hair => (this.hair = hair)}
                                excludeHairColor={excludeHairColor}
                                excludeHairType={excludeHairType}
                                excludeHairConcerns={excludeHairConcerns}
                                getRefinementItems={this.getRefinementItems}
                            />
                            <ContentDivider />
                        </>
                    )}
                    {aboutMeBiTraits?.indexOf(biUtils.TYPES.EYE_COLOR) >= 0 && (
                        <>
                            <Eyes
                                ref={eyes => (this.eyes = eyes)}
                                getRefinementItems={this.getRefinementItems}
                            />
                            <ContentDivider />
                        </>
                    )}
                    <AddReviewNote />
                    <Button
                        disabled={this.state.submitButtonDisabled}
                        variant='primary'
                        onClick={this.submitData}
                        width={['100%', '14.5em']}
                    >
                        {getText('postReview')}
                    </Button>
                </Box>
            </Container>
        );
    }

    submitData = () => {
        const profileId = userUtils.getProfileId();
        const aboutMeData = this.getAboutMeData();
        this.setState({ submitButtonDisabled: true });

        if (aboutMeData) {
            const profileData = { biAccount: {} };

            const worldKey = this.props.world?.key;
            const refinements = this.props.world?.refinements;

            if (worldKey && Array.isArray(refinements)) {
                // Ensure profileData.biAccount.customerPreference exists
                profileData.biAccount.customerPreference = profileData.biAccount.customerPreference || {};

                Object.keys(aboutMeData || {}).forEach(refinementKey => {
                    const refinement = refinements.find(ref => ref.key === refinementKey);

                    if (Array.isArray(refinement?.syncedWorlds) && refinement.syncedWorlds.length) {
                        refinement.syncedWorlds.forEach(syncedWorldKey => {
                            // Ensure nested object exists
                            profileData.biAccount.customerPreference[syncedWorldKey] = profileData.biAccount.customerPreference[syncedWorldKey] || {};

                            profileData.biAccount.customerPreference[syncedWorldKey][refinementKey] = aboutMeData[refinementKey];
                        });
                    } else {
                        // Ensure nested object exists
                        profileData.biAccount.customerPreference[worldKey] = profileData.biAccount.customerPreference[worldKey] || {};

                        profileData.biAccount.customerPreference[worldKey][refinementKey] = aboutMeData[refinementKey];
                    }
                });
            }

            profileData.profileId = profileId;
            store.dispatch(
                ProfileActions.updateBiAccount(profileData, () => {
                    this.props.onSubmit();
                })
            );
        } else {
            this.props.onSubmit();
        }
    };

    getAboutMeData = () => {
        const skinData = this.skin && this.skin.getData().biAccount.personalizedInformation;
        const hairData = this.hair && this.hair.getData().biAccount.personalizedInformation;
        const eyeData = this.eyes && this.eyes.getData().biAccount.personalizedInformation;
        const personalizedInformation = Object.assign({}, skinData, hairData, eyeData);
        let isEmpty = true;
        Object.keys(personalizedInformation).forEach(key => {
            const info = personalizedInformation[key];

            if (info instanceof Array) {
                if (info.length) {
                    isEmpty = false;
                } else {
                    delete personalizedInformation[key];
                }
            } else if (typeof info === 'object' && info !== null) {
                if (Object.keys(info).length) {
                    personalizedInformation[key] = [personalizedInformation[key]];
                    isEmpty = false;
                } else {
                    delete personalizedInformation[key];
                }
            } else if (!info) {
                delete personalizedInformation[key];
            } else {
                personalizedInformation[key] = [personalizedInformation[key]];
                isEmpty = false;
            }
        });

        return !isEmpty && personalizedInformation;
    };

    getRefinementItems = refinementKey => {
        const { NOT_SURE } = CATEGORY_TYPE;
        const refinementItems = this.props.world.refinements?.find(refinement => refinement.key === refinementKey)?.items;
        const refinementItemsFiltered = refinementItems?.filter(item => item.visableInBP);

        if (refinementItemsFiltered) {
            const refinementItemsWithoutNotSure = refinementItemsFiltered.filter(item => !item.key?.includes(NOT_SURE));

            return refinementItemsWithoutNotSure;
        }

        return refinementItemsFiltered;
    };
}

export default wrapComponent(AboutMe, 'AboutMe', true);
