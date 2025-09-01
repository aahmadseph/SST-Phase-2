import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import PageTemplateType from 'constants/PageTemplateType';

import GAdTagList from 'components/GAdTag/GAdTagList';

class PostloadedGAdTagList extends BaseClass {
    shouldBeRendered = () => {
        const isFeatureFlagEnabled = Sephora.configurationSettings.isRetailMediaNetworkEnabled;

        if (!isFeatureFlagEnabled || Sephora.adbanners === 'off') {
            return false;
        }

        const { currentPageTemplateType, currentTargetUrl, template, path } = this.props;

        const allowedPageTemplateTypes = [
            PageTemplateType.Homepage,
            PageTemplateType.ProductPage,
            PageTemplateType.Search,
            PageTemplateType.BrandNthCategory,
            PageTemplateType.NthCategory,
            PageTemplateType.StoreHub,
            PageTemplateType.BrandsList
        ];

        const allowedTargetUrls = [
            '/beauty/new-beauty-products',
            '/beauty/new-releases',
            '/beauty/new-makeup',
            '/beauty/new-skin-care-products',
            '/beauty/new-perfumes',
            '/beauty/new-body-products',
            '/beauty/new-hair-products',
            '/beauty/new-beauty-tools',
            '/beauty/beauty-best-sellers',
            '/beauty/best-selling-makeup',
            '/beauty/best-selling-skin-care',
            '/beauty/best-selling-perfume',
            '/beauty/best-selling-bath-body-products',
            '/beauty/best-selling-hair-products',
            '/beauty/best-selling-beauty-tools',
            '/beauty/best-selling-mens-products',
            '/beauty/beauty-offers',
            '/beauty/giftcards',
            '/happening/stores/sephora-near-me',
            '/sale',
            '/brands-list',
            '/happening/stores/*'
        ];

        const isCurrentTemplateAllowedToRenderAds = allowedPageTemplateTypes.some(
            pageTemplateType => pageTemplateType === (template || currentPageTemplateType)
        );

        const isCurrentTargetUrlAllowedToRenderAds = allowedTargetUrls.some(url => {
            if (url.endsWith('/*')) {
                const base = url.replace('*', '');

                return (path || currentTargetUrl).startsWith(base);
            }

            return (
                url === (path || currentTargetUrl) || `/ca/en${url}` === (path || currentTargetUrl) || `/ca/fr${url}` === (path || currentTargetUrl)
            );
        });

        return isFeatureFlagEnabled && (isCurrentTemplateAllowedToRenderAds || isCurrentTargetUrlAllowedToRenderAds);
    };

    render() {
        const shouldBeRendered = this.shouldBeRendered();

        // Kill-switch
        if (!shouldBeRendered) {
            digitalData.page.attributes.adBannersOn = false;
            digitalData.page.attributes.adBannersRendered = false;
        } else {
            digitalData.page.attributes.adBannersOn = true;
        }

        return (
            <GAdTagList
                listSize={this.props.listSize}
                visible={shouldBeRendered}
            />
        );
    }
}

export default wrapComponent(PostloadedGAdTagList, 'PostloadedGAdTagList', true);
