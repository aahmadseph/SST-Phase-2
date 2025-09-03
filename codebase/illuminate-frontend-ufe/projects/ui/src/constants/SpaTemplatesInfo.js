//
// Please read carefully before updating that file!
//
// SpaTemplatesInfo was designed to be a SPA router configuration for Page(template, it's killswitch, it's storeKey=pageName) and urls (routes in fact as we do support both string and RegExp now).
// Page template can serve mutiple urls, but all urls of that template share same killswitch and pageName.
//
// Here is some RULES you need to follow:
// 1. "template" property value should be unique across all the entries of SpaTemplatesInfo array.
// 2. If you need to have a separate killSwitch or you need to vary some logic for different URLs, but you're planning to use same template - you still need to create a separate template. Read more about sale/search design issue in NOTE #1 bellow.
// 3. Follow naming convention for "killSwitchName" property value - TBD, as it'll be computed by SPA framework soon.
// 4. Follow naming convention for "pageName" property value - TBD, as it'll be computed by SPA framework soon.
// 5. If using one of the optional properties "abCookieName" or "abKillswitchName", then another backup entry with the same path must follow it
// 6. If you need to exclude some routes from the SPA router based on a killswitch then use the optional property "urlBasedKillSwitches" and provide regex expresions to match those urls. See example usage on PageTemplateType.Happening
//
// NOTES:
// 1. We have a design issue with "search" & "sale" pages as they violate the RULE #2. And due to a lot of workarounds/bugfixes was already embedeed into components used on these pages,
//    it's not a quick fix to resolve that design issue now. Instead of using same page template it suppose to be implemented like <SalePage/> use <SaleSearchSharedRootComponent/> and <SearchPage/> use <SaleSearchSharedRootComponent/>,
//    so SalePage can build specific model/props for "sale" and pass to <SaleSearchSharedRootComponent/> and SearchPage can build specific model/props for "search" and pass to <SaleSearchSharedRootComponent/>
//    We don't have "sale" reducer, sale data merged into "search", SpaUtils.getSpaTemplateInfoByTemplate for "sale" will return "search" entry.

import PageTemplateType from 'constants/PageTemplateType';

const SpaTemplatesInfo = [
    {
        template: PageTemplateType.ProductPage,
        pageName: 'product',
        killSwitchName: 'spaEnabledProduct',
        routes: ['/product/']
    },
    {
        template: PageTemplateType.NthCategory,
        pageName: 'nthCategory',
        killSwitchName: 'spaEnabledCategory',
        routes: ['/shop/']
    },
    {
        template: PageTemplateType.BrandNthCategory,
        pageName: 'nthBrand',
        killSwitchName: 'spaEnabledBrand',
        routes: ['/brand/']
    },
    {
        template: PageTemplateType.Search,
        pageName: 'search',
        killSwitchName: 'spaEnabledSearch',
        routes: ['/search']
    },
    {
        template: PageTemplateType.Search,
        pageName: 'sale',
        killSwitchName: 'spaEnabledSearch',
        routes: ['/sale']
    },
    {
        template: PageTemplateType.RwdBasket,
        pageName: 'rwdBasket',
        killSwitchName: 'spaEnabledBasket',
        routes: ['/basket']
    },
    {
        template: PageTemplateType.BuyPage,
        pageName: 'buyPage',
        killSwitchName: 'spaEnabledBuyPage',
        routes: ['/buy/']
    },
    {
        template: PageTemplateType.Homepage,
        pageName: 'home',
        killSwitchName: 'spaEnabledHomePage',
        routes: [/^\/$/]
    },
    {
        template: PageTemplateType.Content,
        pageName: 'content',
        killSwitchName: 'spaEnabledContentStore',
        routes: ['/beauty/beauty-best-sellers', '/beauty/beauty-offers', '/beauty/birthday-gift', /\/beauty\/best-selling\-.+/, /\/beauty\/new\-.+/]
    },
    {
        template: PageTemplateType.EnhancedContent,
        pageName: 'enhancedContent',
        killSwitchName: 'spaEnabledContentStore',
        routes: [/\/beauty\/challenges/]
    },
    {
        template: PageTemplateType.SmartSkinScan,
        pageName: 'smartSkinScan',
        killSwitchName: 'isSmartSkinScanEnabled',
        routes: [/^\/virtual\/smart-skin-scan$/]
    },
    {
        template: PageTemplateType.photoCaptureSmartSkinScan,
        pageName: 'photoCaptureSmartSkinScan',
        killSwitchName: 'isSmartSkinScanEnabled',
        routes: ['/virtual/smart-skin-scan/photo-capture']
    },
    {
        template: PageTemplateType.GalleryPage,
        pageName: 'gallery',
        killSwitchName: 'spaEnabledGallery',
        routes: [/^\/community\/gallery$/]
    },
    {
        template: PageTemplateType.MyGalleryPage,
        pageName: 'myGallery',
        killSwitchName: 'spaEnabledGallery',
        routes: ['/community/gallery/mygallery']
    },
    {
        template: PageTemplateType.CommunityUserPublicGallery,
        pageName: 'communityUserPublicGallery',
        killSwitchName: 'spaEnabledGallery',
        routes: [/^\/community\/gallery\/users\/[^\/]+$/]
    },
    {
        template: PageTemplateType.Happening,
        pageName: 'happening',
        killSwitchName: 'spaEnabledHappeningServices',
        routes: [
            /\/happening\/(events|services|seasonal|reservations\/confirmation)$/,
            /\/happening\/(events|services)\/confirmation\/\S+/,
            /\/happening\/waitlist\/(confirmation|reservation)\/\S+/,
            /\/happening\/(events|services|stores)\/\b(?!(booking|confirmation|OLR.*|sephora-near-me))\b\S+/
        ]
    },
    {
        template: PageTemplateType.HappeningNonContent,
        pageName: 'happening',
        killSwitchName: 'spaEnabledHappeningServices',
        routes: [/\/happening\/reservations$/, /\/happening\/(services|waitlist)\/booking\/\S+/]
    },
    {
        template: PageTemplateType.ShopMyStore,
        pageName: 'shopMyStore',
        routes: [/\/happening\/shop-my-store/]
    },
    {
        template: PageTemplateType.ShopSameDay,
        pageName: 'shopSameDay',
        routes: [/\/happening\/shop-same-day/]
    },
    {
        template: PageTemplateType.TaxClaim,
        pageName: 'taxClaim',
        routes: ['/profile/MyAccount/Taxclaim']
    },
    {
        template: PageTemplateType.MyLists,
        pageName: 'myLists',
        routes: [/\/profile\/Lists\/?$/]
    },
    {
        template: PageTemplateType.MyCustomList,
        pageName: 'myCustomList',
        routes: [/\/profile\/Lists\/[a-zA-Z0-9]+$/]
    },
    {
        template: PageTemplateType.BeautyPreferencesRedesigned,
        pageName: 'beautyPreferences',
        routes: [/\/profile\/BeautyPreferences$/]
    },
    {
        template: PageTemplateType.BeautyPreferencesWorld,
        pageName: 'beautyPreferencesWorld',
        routes: [/^\/profile\/BeautyPreferences\/[^\/]+$/]
    }
];

export { SpaTemplatesInfo };
