import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { isGiftcardAddToWalletEnabledSelector } from 'viewModel/selectors/giftcards/isGiftcardAddToWalletEnabled/isGiftcardAddToWalletEnabledSelector';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(isGiftcardAddToWalletEnabledSelector, isGiftcardAddToWalletEnabled => {
    return {
        isGiftcardAddToWalletEnabled
    };
});

const functions = null;

const withGiftCardProps = wrapHOC(connect(fields, functions));

export {
    withGiftCardProps, fields, functions
};
