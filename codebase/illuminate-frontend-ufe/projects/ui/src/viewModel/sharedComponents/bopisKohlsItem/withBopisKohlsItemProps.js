import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import preferredStoreInfoSelector from 'selectors/user/preferredStoreInfoSelector';
import StoreUtils from 'utils/Store';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { isKohlsStore } = StoreUtils;
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/SharedComponents/BopisKohlsItem/locales', 'BopisKohlsItem');

const fields = createSelector(
    createStructuredSelector({
        bopisKohlsItem: getTextFromResource(getText, 'bopisKohlsItem')
    }),
    preferredStoreInfoSelector,
    (_state, ownProps) => ownProps.store,
    (textResources, preferredStoreInfo, store) => {
        const bopisKohlsItemText = textResources.bopisKohlsItem;
        const newProps = {
            bopisKohlsItemText,
            isKohlsStore: isKohlsStore(store || preferredStoreInfo)
        };

        return newProps;
    }
);

const withBopisKohlsItemProps = wrapHOC(connect(fields));

export { withBopisKohlsItemProps };
