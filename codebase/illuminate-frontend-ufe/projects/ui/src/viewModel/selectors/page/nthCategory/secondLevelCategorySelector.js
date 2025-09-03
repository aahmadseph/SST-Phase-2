import { createSelector } from 'reselect';
import { firstLevelCategorySelector } from 'viewModel/selectors/page/nthCategory/firstLevelCategorySelector';

const secondLevelCategorySelector = createSelector(firstLevelCategorySelector, firstLevelCat => {
    const index = firstLevelCat?.subCategories?.findIndex(element => element?.isSelected);

    return index >= 0 ? firstLevelCat?.subCategories?.[index] : undefined;
});

export { secondLevelCategorySelector };
