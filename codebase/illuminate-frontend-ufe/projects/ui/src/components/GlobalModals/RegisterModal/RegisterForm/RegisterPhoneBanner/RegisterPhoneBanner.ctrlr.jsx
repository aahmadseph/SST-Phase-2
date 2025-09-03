/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'Store';
import { smsBenefitSelector } from 'selectors/page/headerFooterTemplate/data/smsBenefitSelector/smsBenefitSelector';
import Banner from 'components/Content/Banner';
import { Box } from 'components/ui';
import { space, mediaQueries } from 'style/config';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const style = {
    [mediaQueries.smMax]: {
        marginLeft: space[4],
        marginRight: space[4]
    },
    width: 'fit-content'
};
class RegisterPhoneBanner extends BaseClass {
    constructor(props) {
        super(props);
    }

    fireAnalytics = () => {
        const pageType = anaConsts.PAGE_TYPES.TEXT_MODAL;
        const pageDetail =
            this.props.pageName === 'registration'
                ? anaConsts.PAGE_DETAIL.REGISTRATION_PROMO_DISCLAIMER
                : anaConsts.PAGE_DETAIL.TEXT_PROMO_DISCLAIMER;
        const pageName = `${pageType}:${pageDetail}:n/a:*`;
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName,
                pageType,
                pageDetail
            }
        });
    };

    render() {
        const state = store.getState();
        const smsBenefit = smsBenefitSelector(state);

        if (!smsBenefit) {
            return null;
        }

        return (
            <Box
                marginTop={4}
                css={style}
            >
                <Banner
                    {...smsBenefit}
                    fireClickTracking={this.fireAnalytics}
                    customPaddingX={2}
                    customPaddingY={2}
                    mediaAllignSelf='center'
                />
            </Box>
        );
    }
}

export default wrapComponent(RegisterPhoneBanner, 'RegisterForm');
