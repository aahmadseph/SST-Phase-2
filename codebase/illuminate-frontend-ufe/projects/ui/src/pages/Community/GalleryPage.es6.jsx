/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import ConnectedGallery from 'components/Community/Gallery';
import CommunityNavigation from 'components/Community/CommunityNavigation';
import CommunityPageBindings from 'analytics/bindingMethods/pages/community/CommunityPageBindings';
import anaConsts from 'analytics/constants';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { screenReaderOnlyStyle } from 'style/config';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('pages/Community/locales', 'Community');

class GalleryPage extends BaseClass {
    componentDidMount() {
        CommunityPageBindings.setPageLoadAnalytics(anaConsts.PAGE_NAMES.COMMUNITY_GALLERY);
    }
    render() {
        return (
            <>
                <h1 css={screenReaderOnlyStyle}>{getText('gallery')}</h1>
                <CommunityNavigation section='gallery' />
                <ConnectedGallery />
            </>
        );
    }
}

export default wrapComponent(GalleryPage, 'GalleryPage');
