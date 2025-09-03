import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import BCCUtils from 'utils/BCC';
import LanguageLocaleUtils from 'utils/LanguageLocale';
const { wrapHOC } = FrameworkUtils;
const { POINTS_FOR_DISCOUNT_MODAL } = BCCUtils.MEDIA_IDS;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/PointsForDiscount/locales', 'PointsForDiscount');

const fields = createSelector(
    createStructuredSelector({
        ends: getTextFromResource(getText, 'ends', ['{0}']),
        apply: getTextFromResource(getText, 'apply'),
        remove: getTextFromResource(getText, 'remove'),
        applied: getTextFromResource(getText, 'applied'),
        details: getTextFromResource(getText, 'details'),
        off: getTextFromResource(getText, 'off'),
        points: getTextFromResource(getText, 'points'),
        pointsForDiscountEventTitle: getTextFromResource(getText, 'pointsForDiscountEventTitle'),
        gotIt: getTextFromResource(getText, 'gotIt'),
        eligible: getTextFromResource(getText, 'eligible'),
        eventDetails: getTextFromResource(getText, 'eventDetails'),
        viewDetails: getTextFromResource(getText, 'viewDetails')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = dispatch => ({
    showMediaModal: () =>
        dispatch(
            Actions.showMediaModal({
                isOpen: true,
                titleDataAt: 'pfd_modal_title',
                mediaId: POINTS_FOR_DISCOUNT_MODAL,
                title: getText('pointsForDiscountEventTitle'),
                modalBodyDataAt: 'pfd_modal_info',
                dismissButtonText: getText('gotIt'),
                dismissButtonDataAt: 'pfd_modal_got_it_btn',
                modalDataAt: 'pfd_modal',
                modalCloseDataAt: 'pfd_modal_close_btn'
            })
        )
});

const withPointsForDiscountProps = wrapHOC(connect(fields, functions));

export {
    withPointsForDiscountProps, fields, functions
};
