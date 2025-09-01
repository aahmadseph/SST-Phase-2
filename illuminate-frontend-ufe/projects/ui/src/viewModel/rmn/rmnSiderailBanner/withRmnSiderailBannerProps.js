import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { cmsRMNBannerSelector } from 'selectors/rmnBanners';
import RMN_BANNER_TYPES_CONSTANTS from 'components/Rmn/constants';
import { isShowSMNEnabledSelector } from 'viewModel/selectors/testTarget/showSMNSelector';

const { POSITIONS } = RMN_BANNER_TYPES_CONSTANTS;

import rmnAndPlaUtils from 'utils/rmnAndPla';
const { bannerCommonProps } = rmnAndPlaUtils;

const { wrapHOC } = FrameworkUtils;

const functions = {};

const withRmnSiderailBannerProps = Component => {
    const fields = createSelector(
        cmsRMNBannerSelector,
        isShowSMNEnabledSelector,
        (_state, ownProps) => ownProps,
        (rmnBannersState, showSMNEnabled, ownProps) => {
            const bannerProps = bannerCommonProps[ownProps.pageType]?.mainBannerProps;

            return {
                ...ownProps,
                contextId: rmnBannersState?.contextId,
                bannerProps: {
                    ...bannerProps,
                    position: ownProps?.position || POSITIONS.TOP,
                    ...ownProps.bannerProps
                },
                showSMNEnabled
            };
        }
    );

    return wrapHOC(connect(fields, functions))(Component);
};

export { withRmnSiderailBannerProps };
