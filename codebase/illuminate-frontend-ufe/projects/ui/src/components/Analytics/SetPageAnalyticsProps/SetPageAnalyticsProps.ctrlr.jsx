/* eslint-disable class-methods-use-this */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import analyticsConstants from 'analytics/constants';

/**
 * This is used to assign page tracking properties on pages that don't already have their own
 * controller.
 * It's fine if these values are undefined, they are determined later if not set here.
 */
class SetPageAnalyticsProps extends BaseClass {
    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        let pageName;
        const isContentStore = this.props.isContentStore || false;

        if (isContentStore) {
            pageName = `${this.props.pageName}-${this.props.additionalPageInfo}`.toLowerCase();
        } else {
            pageName = this.props.pageName;
            digitalData.page.attributes.additionalPageInfo = this.props.additionalPageInfo || '';
        }

        digitalData.page.category.pageType = this.props.pageType;
        digitalData.page.pageInfo.pageName = pageName;
        digitalData.page.attributes.world = this.props.world == null ? analyticsConstants.NOT_AVAILABLE : this.props.world;
    }

    render() {
        return null;
    }
}

export default wrapComponent(SetPageAnalyticsProps, 'SetPageAnalyticsProps', true);
