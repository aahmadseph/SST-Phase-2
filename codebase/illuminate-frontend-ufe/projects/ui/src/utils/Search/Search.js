import localeUtils from 'utils/LanguageLocale';
import catalogConstants from 'constants/Search';

const getNavigation = props => {
    const isMobile = Sephora.isMobile();
    const isAllCategoriesPage = props.seoCategoryName === catalogConstants.ALL_CATEGORIES_SEO_NAME;
    const getText = localeUtils.getLocaleResourceFile('utils/locales/Search', 'Search');

    return {
        showTitle: !isMobile,
        title: isMobile ? getText('categories') : getText('category'),
        indentSubcategories: false,
        isAllCategoriesPage,
        showSeeAll: isMobile,
        seeAllUrl: `${props.targetUrl}/all`,
        showNumbersInSubcategories: !isMobile,
        showRoot: isMobile,
        isCollapseNth: false,
        footer: {
            show: false,
            text: getText('category'),
            url: props.targetUrl
        }
    };
};

export default getNavigation;
