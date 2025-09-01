import { MERGE_PAGE_DATA, SET_PAGE_DATA, SHOW_SPA_PAGE_LOAD_PROGRESS } from 'constants/actionTypes/page';
import { SET_NTH_CATEGORY } from 'constants/actionTypes/nthCategory';
import { SET_NTH_BRAND } from 'constants/actionTypes/nthBrand';
import { SET_SEARCH } from 'constants/actionTypes/search';
import productActionTypes from 'constants/actionTypes/product';
import { SET_CONTENT_STORE } from '../constants/actionTypes/contentStore';
import { SET_BUY_PAGE } from 'constants/actionTypes/buy';
import { SET_HOME_PAGE } from 'constants/actionTypes/home';
import { SET_CONTENT } from 'constants/actionTypes/content';
import { SET_ENHANCED_CONTENT } from 'constants/actionTypes/enhancedContent';
import { SET_HAPPENING, SET_HAPPENING_NON_CONTENT } from 'constants/actionTypes/happening';
import { SET_SMART_SKIN_SCAN_CONTENT } from 'constants/actionTypes/smartSkinScan';
import { SET_PHOTO_CAPTURE_SMART_SKIN_SCAN_CONTENT } from 'constants/actionTypes/photoCaptureSmartSkinScan';
import { SET_GALLERY_CONTENT, SET_GALLERY_BANNER_CONTENT } from 'constants/actionTypes/gallery';
import { SET_GALLERY_PROFILE_CONTENT } from 'constants/actionTypes/myProfile';
import { SET_USER_PUBLIC_GALLERY_PROFILE_CONTENT } from 'constants/actionTypes/userPublicGallery';
import { SET_TLP_PAGE } from 'constants/actionTypes/tlp';
import { SET_TAX_CLAIM_DATA, TAX_INIT_SUCCESS } from 'constants/actionTypes/taxClaim';
import { SET_SHOP_MY_STORE, SET_SHOP_SAME_DAY } from 'constants/actionTypes/happening';
import { SET_BEAUTY_PREFERENCES_REDESIGNED, SET_BEAUTY_PREFERENCES_WORLD } from 'constants/actionTypes/beautyPreferencesRedesigned';
import { SET_MY_LISTS, SET_MY_CUSTOM_LIST } from 'constants/actionTypes/myLists';

import rwdBasket from 'reducers/rwdBasket';
import tlpPage from './page/tlpPage';
import taxClaim from './page/taxClaim';
const {
    ACTION_TYPES: { SET_RWD_BASKET }
} = rwdBasket;
import home from './page/home';
import nthCategory from './page/nthCategory';
import nthBrand from './page/nthBrand';
import search from './page/search';
import buy from './page/buy';
import content from './page/content';
import enhancedContent from './page/enhancedContent';
import happening from './page/happening';
import photoCaptureSmartSkinScan from './page/photoCaptureSmartSkinScan';
import smartSkinScan from './page/smartSkinScan';
import gallery from './page/gallery';
import myProfile from './page/myProfile';
import events from './page/events';
import autoReplenishment from 'reducers/page/autoReplenishment';
import sameDayUnlimited from 'reducers/sameDayUnlimited';
import contentStoreData from './page/contentStore';
import PageTemplateType from 'constants/PageTemplateType';
import product from './product';
import shopMyStore from 'reducers/page/shopMyStore';
import shopSameDay from 'reducers/page/shopSameDay';
import myLists from 'reducers/page/myLists';
import beautyPreferencesRedesigned from 'reducers/page/beautyPreferencesRedesigned';
import myCustomList from 'reducers/page/myCustomList';

export const initialState = {
    showLoadSpaPageProgress: null,
    nthCategory: {},
    nthBrand: {},
    product: {},
    templateInformation: {},
    search: {},
    contentStoreData: {},
    home: {},
    buy: {},
    autoReplenishment: autoReplenishment.initialState,
    sameDayUnlimited: sameDayUnlimited.initialState,
    content: {},
    enhancedContent: {},
    smartSkinScan: {},
    photoCaptureSmartSkinScan: {},
    rwdBasket: {},
    happening: happening.initialState,
    events: events.initialState,
    tlpPage: {},
    taxClaim: taxClaim.initialState,
    shopMyStore: shopMyStore.initialState,
    shopSameDay: shopSameDay.initialState,
    myLists: myLists.initialState,
    beautyPreferencesRedesigned: beautyPreferencesRedesigned.initialState,
    myCustomList: myCustomList.initialState
};

// eslint-disable-next-line complexity
const page = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_PAGE_DATA: {
            return payload || initialState;
        }
        case MERGE_PAGE_DATA: {
            return {
                ...state,
                ...payload
            };
        }
        case SHOW_SPA_PAGE_LOAD_PROGRESS: {
            return {
                ...state,
                showLoadSpaPageProgress: payload
            };
        }
        default: {
            let newState = state;
            Object.keys(pageReducers).forEach(reducerName => {
                const originalSubState = state[reducerName];
                const reducer = pageReducers[reducerName];
                const newSubState = reducer(originalSubState, action);

                if (originalSubState !== newSubState) {
                    newState = {
                        ...newState,
                        [reducerName]: newSubState
                    };
                }
            });

            if (type === productActionTypes.SET_PRODUCT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.ProductPage
                    }
                };
            } else if (type === SET_NTH_CATEGORY) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.NthCategory
                    }
                };
            } else if (type === SET_NTH_BRAND) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.BrandNthCategory
                    }
                };
            } else if (type === SET_RWD_BASKET) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.RwdBasket
                    }
                };
            } else if (type === SET_SEARCH) {
                Sephora.pagePath = PageTemplateType.Search;
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.Search
                    }
                };
            } else if (type === SET_CONTENT_STORE) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.RwdContentStore
                    }
                };
            } else if (type === SET_BUY_PAGE) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.BuyPage
                    }
                };
            } else if (type === SET_HOME_PAGE) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.Homepage
                    }
                };
            } else if (type === SET_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.Content
                    }
                };
            } else if (type === SET_ENHANCED_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.EnhancedContent
                    }
                };
            } else if (type === SET_HAPPENING) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.Happening
                    }
                };
            } else if (type === SET_HAPPENING_NON_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.HappeningNonContent
                    }
                };
            } else if (type === SET_SMART_SKIN_SCAN_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.SmartSkinScan
                    }
                };
            } else if (type === SET_PHOTO_CAPTURE_SMART_SKIN_SCAN_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.photoCaptureSmartSkinScan
                    }
                };
            } else if (type === SET_GALLERY_CONTENT || type === SET_GALLERY_BANNER_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.GalleryPage
                    }
                };
            } else if (type === SET_GALLERY_PROFILE_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.MyGalleryPage
                    }
                };
            } else if (type === SET_USER_PUBLIC_GALLERY_PROFILE_CONTENT) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.CommunityUserPublicGallery
                    }
                };
            } else if (type === SET_TLP_PAGE) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.RwdTlp
                    }
                };
            } else if (type === SET_TAX_CLAIM_DATA || type === TAX_INIT_SUCCESS) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.TaxClaim
                    }
                };
            } else if (type === SET_SHOP_MY_STORE) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.ShopMyStore
                    }
                };
            } else if (type === SET_SHOP_SAME_DAY) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.ShopSameDay
                    }
                };
            } else if (type === SET_MY_LISTS) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.MyLists
                    }
                };
            } else if (type === SET_MY_CUSTOM_LIST) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.MyCustomList
                    }
                };
            } else if (type === SET_BEAUTY_PREFERENCES_REDESIGNED) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.BeautyPreferencesRedesigned
                    }
                };
            } else if (type === SET_BEAUTY_PREFERENCES_WORLD) {
                newState = {
                    ...newState,
                    templateInformation: {
                        channel: 'RWD',
                        template: PageTemplateType.BeautyPreferencesWorld
                    }
                };
            }

            return newState;
        }
    }
};

const withMerge = (reducerName, reducer) => (state, action) => {
    switch (action.type) {
        case `page.${reducerName}_MERGE`: {
            // eslint-disable-next-line object-curly-newline
            const { key, value } = action.payload;

            return {
                ...state,
                [key]: value
            };
        }
        default: {
            return reducer(state, action);
        }
    }
};
page.withMerge = withMerge;

let pageReducers;
const wrapReducers = () => {
    pageReducers = {
        product,
        nthCategory,
        nthBrand,
        search,
        contentStoreData,
        buy,
        home,
        autoReplenishment: autoReplenishment.reducer,
        sameDayUnlimited: sameDayUnlimited.reducer,
        content,
        enhancedContent,
        happening: happening.reducer,
        smartSkinScan,
        photoCaptureSmartSkinScan,
        gallery,
        myProfile,
        events: events.reducer,
        rwdBasket,
        tlpPage,
        taxClaim: taxClaim.reducer,
        shopMyStore: shopMyStore.reducer,
        shopSameDay: shopSameDay.reducer,
        myLists: myLists.reducer,
        beautyPreferencesRedesigned: beautyPreferencesRedesigned.reducer,
        myCustomList: myCustomList.reducer
    };
    Object.keys(pageReducers).forEach(reducerName => {
        pageReducers[reducerName] = page.withMerge(reducerName, pageReducers[reducerName]);
    });
    page.pageReducers = pageReducers;
};
wrapReducers();
page.wrapReducers = wrapReducers;

export default page;
