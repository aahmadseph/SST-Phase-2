// const { ArgumentOutOfRangeException } = require('exceptions');
// const PageActionCreators = require('actions/framework/PageActionCreators');
import PageTemplateType from 'constants/PageTemplateType';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';

import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';
import CategoryActions from 'actions/CategoryActions';
import BuyPageActions from 'actions/BuyPageActions';
import HomepageActions from 'actions/HomepageActions';
import ProductActions from 'actions/ProductActions';
import BeautyOfferActions from 'actions/BeautyOfferActions';
import SearchActions from 'actions/SearchActions';
import ContentActions from 'actions/ContentActions';
import EnhancedContentActions from 'actions/EnhancedContentActions';
import SmartSkinScanActions from 'actions/SmartSkinScanActions';
import PhotoCaptureSmartSkinScanActions from 'actions/PhotoCaptureSmartSkinScanActions';
import GalleryActions from 'actions/GalleryActions';
import HappeningActions from 'actions/HappeningActions';
import MyGalleryActions from 'actions/MyGalleryActions';
import UserPublicGalleryActions from 'actions/UserPublicGalleryActions';
import TlpActions from 'actions/TlpActions';
import TaxClaimActions from 'actions/TaxClaimActions';
import ShopMyStoreActions from 'actions/HappeningShopMyStoreActions';
import ShopSameDayActions from 'actions/HappeningShopSameDayActions';
import MyListsPageActions from 'actions/MyListsPageActions';
import BeautyPreferencesRedesignedActions from 'actions/BeautyPreferencesRedesignedActions';
import BeautyPreferencesWorldActions from 'actions/BeautyPreferencesWorldActions';
import MyCustomListPageActions from 'actions/MyCustomListPageActions';

const spaPagesActions = {
    // Every module required below has to export it's content as an object.
    // Exported object should be inherited from PageActionCreators class and
    // provide implementation of these 3 methods: isNewPage, openPage, updatePage.
    //
    // interface IPageActionCreators {
    //     isNewPage: (pageContext: IPageNavigationContext) => boolean;
    //     openPage?: (pageContext: IPageNavigationContext) => void;
    //     updatePage?: (pageContext: IPageNavigationContext) => void;
    // }
    [PageTemplateType.RwdBasket]: RwdBasketActions,
    [PageTemplateType.BeautyPreferences]: BeautyPreferencesActions,
    [PageTemplateType.BrandNthCategory]: CategoryActions,
    [PageTemplateType.BuyPage]: BuyPageActions,
    [PageTemplateType.Homepage]: HomepageActions,
    [PageTemplateType.NthCategory]: CategoryActions,
    [PageTemplateType.ProductPage]: ProductActions,
    [PageTemplateType.RwdContentStore]: BeautyOfferActions,
    [PageTemplateType.Search]: SearchActions,
    [PageTemplateType.Content]: ContentActions,
    [PageTemplateType.EnhancedContent]: EnhancedContentActions,
    [PageTemplateType.SmartSkinScan]: SmartSkinScanActions,
    [PageTemplateType.photoCaptureSmartSkinScan]: PhotoCaptureSmartSkinScanActions,
    [PageTemplateType.GalleryPage]: GalleryActions,
    [PageTemplateType.Happening]: HappeningActions,
    [PageTemplateType.HappeningNonContent]: HappeningActions,
    [PageTemplateType.MyGalleryPage]: MyGalleryActions,
    [PageTemplateType.CommunityUserPublicGallery]: UserPublicGalleryActions,
    [PageTemplateType.RwdTlp]: TlpActions,
    [PageTemplateType.TaxClaim]: TaxClaimActions,
    [PageTemplateType.ShopMyStore]: ShopMyStoreActions,
    [PageTemplateType.ShopSameDay]: ShopSameDayActions,
    [PageTemplateType.MyLists]: MyListsPageActions,
    [PageTemplateType.MyCustomList]: MyCustomListPageActions,
    [PageTemplateType.BeautyPreferencesRedesigned]: BeautyPreferencesRedesignedActions,
    [PageTemplateType.BeautyPreferencesWorld]: BeautyPreferencesWorldActions
};

// const pages = Object.keys(spaPagesActions);

// if (!Sephora.isNodeRender) {
//     for (let index = 0; index < pages.length; index++) {
//         const actionCreators = spaPagesActions[pages[index]];

//         if (!(actionCreators instanceof PageActionCreators)) {
//             throw new ArgumentOutOfRangeException();
//         }
//     }
// }

export default spaPagesActions;
