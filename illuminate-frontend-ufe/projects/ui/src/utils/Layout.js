import constants from 'constants/content';

const {
    COMPONENT_TYPES: { BANNER },
    BANNER_TYPES
} = constants;

export const mountHeroBanner = ({ heroBanner, seo, isChild, navigation }) => {
    if (!heroBanner) {
        return null;
    }

    return {
        ...heroBanner,
        type: BANNER,
        bannerType: BANNER_TYPES.HERO,
        seoHeader: seo?.header1,
        marginTop: 0,
        marginBottom: !isChild && navigation?.items ? 4 : 6,
        alignLeft: true,
        enablePageRenderTracking: true
    };
};
