import { createSelector } from 'reselect';
import NthCategoryIdSelector from 'selectors/page/nthCategory/nthCategoryIdSelector';
import { secondLevelCategorySelector } from 'viewModel/selectors/page/nthCategory/secondLevelCategorySelector';

const { nthCategoryIdSelector } = NthCategoryIdSelector;
const thirdLevelCategorySelector = createSelector(nthCategoryIdSelector, secondLevelCategorySelector, (categoryId, secondLevelCat) => {
    if (secondLevelCat?.subCategories) {
        return secondLevelCat.subCategories.find(cat => cat?.categoryId === categoryId);
    }

    return null;
});

export { thirdLevelCategorySelector };
