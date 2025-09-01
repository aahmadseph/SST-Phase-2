import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/CommunityNavigation/locales', 'CommunityNavigation');

const fields = createSelector(
    createStructuredSelector({
        community: getTextFromResource(getText, 'community'),
        profile: getTextFromResource(getText, 'profile'),
        groups: getTextFromResource(getText, 'groups'),
        gallery: getTextFromResource(getText, 'gallery'),
        communityNavigation: getTextFromResource(getText, 'communityNavigation'),
        notificationsFeed: getTextFromResource(getText, 'notificationsFeed'),
        startAConversation: getTextFromResource(getText, 'startAConversation'),
        uploadToGallery: getTextFromResource(getText, 'uploadToGallery'),
        messages: getTextFromResource(getText, 'messages')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = null;
const withCommunityNavigationProps = wrapHOC(connect(fields, functions));

export {
    withCommunityNavigationProps, fields, functions
};
