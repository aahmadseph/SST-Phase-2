import FrameworkUtils from 'utils/framework';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import Actions from 'actions/Actions';
import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';
import BrandsListActions from 'actions/BrandsListActions';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';
import { userSelector } from 'selectors/user/userSelector';
import BrandsListSelector from 'selectors/brandsList/brandsListSelector';
import TestTargetUtils from 'utils/TestTarget';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';
import userUtils from 'utils/User';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import { HEADER_VALUE } from 'constants/authentication';

const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { getBobFlag } = TestTargetUtils;
const { getBrandsByIdMap, getCategory, filterOutUserFavBrandsSpokeIDs } = BeautyPreferencesUtils;
const { wrapHOC } = FrameworkUtils;
const { brandsListSelector } = BrandsListSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { setUserFavoriteBrandIDs } = BrandsListActions;
const { updateBeautyPreferences } = BeautyPreferencesActions;
const { showBiRegisterModal, showInterstice, showSignInModal } = Actions;
const getText = getLocaleResourceFile('components/Brand/BrandsList/locales', 'BrandsList');
const getTextFavoriteBrands = getLocaleResourceFile('components/Brand/BrandsList/FavoriteBrands/locales', 'FavoriteBrands');

const localization = createStructuredSelector({
    newText: getTextFromResource(getText, 'new'),
    allBrands: getTextFromResource(getText, 'allBrands'),
    brandsAZ: getTextFromResource(getText, 'brandsAZ'),
    favoriteBrands: getTextFromResource(getTextFavoriteBrands, 'favoriteBrands'),
    saveYourFBsMessageOne: getTextFromResource(getTextFavoriteBrands, 'saveYourFBsMessageOne'),
    beautyPreferences: getTextFromResource(getTextFavoriteBrands, 'beautyPreferences'),
    saveYourFBsMessageTwo: getTextFromResource(getTextFavoriteBrands, 'saveYourFBsMessageTwo'),
    favoriteBrandsAppearHere: getTextFromResource(getTextFavoriteBrands, 'favoriteBrandsAppearHere'),
    viewAllBautyPrefs: getTextFromResource(getTextFavoriteBrands, 'viewAllBautyPrefs')
});

const fields = createSelector(
    userSelector,
    brandsListSelector,
    (_, ownProps) => ownProps.groupedBrands,
    localization,
    beautyPreferencesSelector,
    (user, brandsList, groupedBrands, textResources, { beautyPreferences }) => {
        const brandsByIdMap = getBrandsByIdMap(groupedBrands);
        const userFavoriteBrandIDs = filterOutUserFavBrandsSpokeIDs(brandsList.userFavoriteBrandIDs, brandsByIdMap);
        const userHasLovedBrands = !!userFavoriteBrandIDs.length;
        const totalUserLovedBrands = userHasLovedBrands ? ` (${userFavoriteBrandIDs.length})` : '';
        const isUserSignedIn = !!user.profileId;
        const isBIUser = userUtils.isBI();
        const isSignedIn = isUserSignedIn && isBIUser;
        const isNonBIUser = isUserSignedIn && !isBIUser;
        const bpPageHref = '/profile/BeautyPreferences?favoriteBrandsSpoke=true';

        return {
            bobFlag: getBobFlag(),
            userFavoriteBrandIDs,
            brandsByIdMap,
            localization: textResources,
            user,
            beautyPreferences,
            userHasLovedBrands,
            totalUserLovedBrands,
            isSignedIn,
            isNonBIUser,
            bpPageHref
        };
    }
);

const functions = dispatch => ({
    updateFavoriteBrands: (favBrands, profileId, beautyPreferences, successCallback, errorTitle, errorMessage, errorCTA, errorCallback) => {
        dispatch(
            updateBeautyPreferences(
                getCategory(PREFERENCE_TYPES.FAVORITE_BRANDS),
                profileId,
                favBrands,
                beautyPreferences,
                () => {
                    dispatch(setUserFavoriteBrandIDs(favBrands));
                    successCallback();
                },
                errorTitle,
                errorMessage,
                errorCTA,
                errorCallback
            )
        );
    },
    showSignInModal: () => {
        dispatch(showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    },
    showBiRegisterModal: () => {
        dispatch(showBiRegisterModal({ isOpen: true }));
    },
    showLoader: (show = false) => dispatch(showInterstice(show))
});

const withBrandsListProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, localization, withBrandsListProps
};
