import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/ProductSort/locales', 'ProductSort');
const defaultText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog')('default');
import urlUtils from 'utils/Url';
class ProductSort extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { refinement = { values: [] }, selectFilters } = this.props;
        let sortByFromUrl;

        if (global.window) {
            sortByFromUrl = new URLSearchParams(global.window?.location.search).get('sortBy');
        } else {
            sortByFromUrl = urlUtils.getParamValueAsSingleString('sortBy');
        }

        if (sortByFromUrl) {
            const refinementFromUrl = refinement.values.find(x => x.refinementValue === sortByFromUrl);
            selectFilters({ [refinement.displayName]: [refinementFromUrl.refinementValue] }, true);
        }
    }

    render() {
        const { refinement = { values: [] }, selectFilters, selectedOrDefaultOption } = this.props;

        const options = refinement.values.map(x => ({
            children: x.isDefault ? `${x.refinementValueDisplayName} (${defaultText})` : x.refinementValueDisplayName,
            onClick: () => selectFilters({ [refinement.displayName]: [x.refinementValue] }, true),
            isActive: x.refinementValue === selectedOrDefaultOption.refinementValue
        }));

        return (
            <ActionMenu
                id='cat_sort_menu'
                align='right'
                options={options}
                ariaDescribedById='catalogSortDescription'
                ariaDescribedByText={getText('sortDescribedBy')}
                triggerDataAt={Sephora.debug.dataAt('sort_by_button')}
                menuDataAt={Sephora.debug.dataAt('sorting_menu')}
                menuItemDataAt={Sephora.debug.dataAt('sort_option')}
            >
                {getText('sortBy')}: <b>{selectedOrDefaultOption?.refinementValueDisplayName}</b>
            </ActionMenu>
        );
    }
}

export default wrapComponent(ProductSort, 'ProductSort');
