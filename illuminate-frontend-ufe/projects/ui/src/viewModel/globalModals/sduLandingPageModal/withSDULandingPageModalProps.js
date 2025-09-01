import { connect } from 'react-redux';
import ContentSelector from 'selectors/page/sameDayUnlimited/bccContent/content/contentSelector';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import SameDayUnlimitedActions from 'actions/SameDayUnlimitedActions';
import FrameworkUtils from 'utils/framework';
import basketConstants from 'constants/Basket';
import urlUtils from 'utils/Url';
import getUserSpecificProductDetails from 'services/api/profile/getUserSpecificProductDetails';
import { userSelector } from 'selectors/user/userSelector';
import AddressUtils from 'utils/Address';

const { formatZipCode } = AddressUtils;
const { wrapHOC } = FrameworkUtils;
const { contentSelector } = ContentSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/SDULandingPageModal/locales', 'SDULandingPageModal');

const fields = createSelector(
    contentSelector,
    userSelector,
    (_state, ownProps) => ownProps.mediaId,
    (_state, ownProps) => ownProps.isUserSDUTrialEligible,
    (_state, ownProps) => ownProps.onDismiss,
    (_state, ownProps) => ownProps.skipConfirmationModal,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        subscribeToSephora: getTextFromResource(getText, 'subscribeToSephora'),
        subHeader: getTextFromResource(getText, 'subHeader'),
        free30DayTrial: getTextFromResource(getText, 'free30DayTrial'),
        then: getTextFromResource(getText, 'then'),
        annually: getTextFromResource(getText, 'annually'),
        regionalAvailability: getTextFromResource(getText, 'regionalAvailability'),
        addTrialToBasket: getTextFromResource(getText, 'addTrialToBasket'),
        addSubscriptionToBasket: getTextFromResource(getText, 'addSubscriptionToBasket'),
        sameDayUnlimited: getTextFromResource(getText, 'sameDayUnlimited'),
        trial: getTextFromResource(getText, 'trial'),
        subscription: getTextFromResource(getText, 'subscription'),
        alreadyAddedToBasket: getTextFromResource(getText, 'alreadyAddedToBasket'),
        joinForOnly: getTextFromResource(getText, 'joinForOnly'),
        viewBasket: getTextFromResource(getText, 'viewBasket'),
        hasBeenAdded: getTextFromResource(getText, 'hasBeenAdded'),
        activateSubscription: getTextFromResource(getText, 'activateSubscription'),
        activateYour: getTextFromResource(getText, 'activateYour'),
        free30day: getTextFromResource(getText, 'free30day'),
        andSave: getTextFromResource(getText, 'andSave')
    }),
    (content, user, mediaId, isUserSDUTrialEligible, onDismiss, skipConfirmationModal, textResources) => {
        const {
            annually,
            trial,
            subscription,
            alreadyAddedToBasket,
            hasBeenAdded,
            activateSubscription,
            subHeader,
            activateYour,
            free30day,
            andSave,
            ...restTextResources
        } = textResources;

        const savingsText = `${annually}*`;
        const alreadyAddedText = isUserSDUTrialEligible ? `${trial} ${alreadyAddedToBasket}` : `${subscription} ${alreadyAddedToBasket}`;
        const SDUSku = 'P483900';
        const SM_IMG_SIZE = 50;
        const redirectToBasket = () => {
            onDismiss();
            urlUtils.redirectTo('/basket');
        };
        const { BasketType } = basketConstants;
        const basketType = BasketType.Standard;
        const addToBasketCallback = skipConfirmationModal || onDismiss;
        const { preferredZipCode } = user;
        const zipCode = preferredZipCode ? formatZipCode(preferredZipCode) : textResources.yourLocation;

        return {
            ...restTextResources,
            subHeader,
            savingsText,
            mediaId,
            alreadyAddedText,
            getUserSpecificProductDetails,
            SDUSku,
            SM_IMG_SIZE,
            basketType,
            addToBasketCallback,
            bccComps: content,
            redirectToBasket,
            zipCode
        };
    }
);
const functions = {
    loadBCCContent: SameDayUnlimitedActions.loadBCCContent,
    loadContentfulContent: SameDayUnlimitedActions.loadContentfulContent,
    openSDUConfirmationModal: SameDayUnlimitedActions.openSDUConfirmationModal,
    addSDUToBasket: SameDayUnlimitedActions.addSDUToBasket
};

const withSDULandingPageModalProps = wrapHOC(connect(fields, functions));

export {
    withSDULandingPageModalProps, fields, functions
};
