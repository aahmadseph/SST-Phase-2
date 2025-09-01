import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { rougeExclusiveRewardsSelector } from 'selectors/rougeRewards/rougeExclusiveRewardsSelector';
import basketSelector from 'selectors/basket/basketSelector';
import PazeActions from 'actions/PazeActions';
import UserActions from 'actions/UserActions';
import RougeRewardsActions from 'actions/RougeRewardsActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const { wrapHOC } = FrameworkUtils;
const { toggleSelectAsDefaultPayment } = UserActions;
const { loadRougeRewards } = RougeRewardsActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { loadIframe } = PazeActions;
const getText = getLocaleResourceFile('components/RougeRewardsCarousel/locales', 'RougeRewards');

const fields = createSelector(
    userSelector,
    basketSelector,
    rougeExclusiveRewardsSelector,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        rougeBadgeText: getTextFromResource(getText, 'rougeBadge'),
        viewAllText: getTextFromResource(getText, 'viewAll')
    }),
    (user, basket, rougeExclusiveRewards, textResources) => {
        return {
            ...textResources,
            user,
            basket,
            isRougeExclusive: rougeExclusiveUtils.isRougeExclusive(),
            ...rougeExclusiveRewards
        };
    }
);

const functions = {
    loadRougeRewards,
    loadIframe,
    toggleSelectAsDefaultPayment
};

const withRougeRewardsCarouselProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withRougeRewardsCarouselProps
};
