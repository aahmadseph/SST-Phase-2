import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import BCCUtils from 'utils/BCC';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import basketSelector from 'selectors/basket/basketSelector';
const { wrapHOC } = FrameworkUtils;
const { POINT_MULTIPLIER_MODAL } = BCCUtils.MEDIA_IDS;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/PointMultiplierEvent/locales', 'PointMultiplierEvent');

const fields = createSelector(
    createStructuredSelector({
        ends: getTextFromResource(getText, 'ends', ['{0}']),
        pointMultiplier: getTextFromResource(getText, 'pointMultiplier'),
        apply: getTextFromResource(getText, 'apply'),
        remove: getTextFromResource(getText, 'remove'),
        applied: getTextFromResource(getText, 'applied'),
        details: getTextFromResource(getText, 'details'),
        perDollar: getTextFromResource(getText, 'perDollar'),
        pointMultiplierEventTitle: getTextFromResource(getText, 'pointMultiplierEventTitle'),
        gotIt: getTextFromResource(getText, 'gotIt')
    }),
    basketSelector,
    (_state, ownProps) => ownProps,
    (localization, basket, ownProps) => {
        const appliedPromotions = basket.appliedPromotions || [];
        const { promoCode, promoApplied } = ownProps.content;
        let isPromoCodeApplied = promoApplied;

        if (appliedPromotions.length) {
            isPromoCodeApplied = appliedPromotions.includes(promoCode);
        }

        return {
            localization,
            isPromoCodeApplied
        };
    }
);

const functions = dispatch => ({
    showMediaModal: () =>
        dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: POINT_MULTIPLIER_MODAL,
                title: getText('pointMultiplierEventTitle'),
                dismissButtonText: getText('gotIt')
            })
        )
});

const withPointsMultiplierEventProps = wrapHOC(connect(fields, functions));

export {
    withPointsMultiplierEventProps, fields, functions
};
