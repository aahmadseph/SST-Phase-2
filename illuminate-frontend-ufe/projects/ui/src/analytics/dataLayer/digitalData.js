/*
 ** This is the analytics data layer for UFE.
 **/
import deepExtend from 'utils/deepExtend';

(function () {
    //W3C Spec Data Layer - Declare basic defaults
    const digitalData = {
        cart: {
            attributes: {
                productIds: [],
                skuIds: [],
                shipCountry: '',
                doubleClick: {
                    allowedItems: [],
                    skuIds: [],
                    brandNames: [],
                    skuPrices: [],
                    ratings: []
                }
            },
            item: [],
            profile: {},
            total: {},
            isRestrictedForPixel: false
        },
        event: [],
        page: {
            attributes: {
                additionalPageInfo: '',
                atgVersion: '',
                brand: '',
                campaigns: {
                    emailATGID: '',
                    emailHarmonyDeploymentId: '',
                    emailHarmonyLinkId: '',
                    emailHarmonyCustomerKey: '',
                    emailTrackingCode: '',
                    marketingChannel: '',
                    ursTrackingCode: '',
                    affiliateId: ''
                },
                personalizedEmailCampaign: '',
                contentfulPersonalization: '',
                contentPillars: '',
                date: {
                    localDate: '',
                    dayName: '',
                    time: '',
                    timestamp: ''
                },
                eligibility: { applePayEligibility: null },
                eventStrings: [],
                featureVariantKeys: [],
                productStrings: [],
                experience: '',
                experienceType: '',
                externalRecommendations: {
                    audienceId: '',
                    experienceId: '',
                    vendor: ''
                },
                initialPageLoadDidOccur: false,
                isGuestOrder: false,
                isGuestEmailRegistered: false,
                isVisitorApiPresent: false,
                languageLocale: '',
                paidSearchCampaignId: '',
                path: [],
                platform: '',
                breakpoint: '',
                previousPageData: {
                    pageName: '',
                    linkData: '',
                    navigationInfo: '',
                    events: [],
                    recInfo: {}
                },
                reportSuiteId: '',
                sephoraPageInfo: {
                    pageName: '',
                    contentCountry: '',
                    productFindingMethod: '',
                    categoryFilters: []
                },
                specialProdCategories: [],
                ursChannelId: '',
                world: '',
                tempProps: {
                    isAddOrRemovePromo: false
                },
                search: {
                    searchTerm: '',
                    numberOfResults: '',
                    searchAlgorithmType: ''
                },
                experienceDetails: { storeId: '' },
                uniqueId: ''
            },
            category: {
                primaryCategory: '',
                pageType: '',
                doubleClickCategory: '',
                fbProductSkus: []
            },
            pageInfo: {
                pageID: '',
                pageName: '',
                destinationURL: '',
                referringURL: '',
                breadcrumbs: [],
                language: '',
                sysEnv: '',
                country: ''
            }
        },
        pageInstanceId: '',
        /* Already declared in headScript.js */
        product: [],
        transaction: {
            attributes: {
                firstTransactionOnline: false,
                productIds: [],
                skuIds: [],
                itemQty: [],
                itemPrice: [],
                itemName: [],
                brandNames: [],
                skuTypes: [],
                skuVariationTypes: [],
                skuVariationValue: [],
                sdd: {
                    skuIds: [],
                    itemQty: []
                }
            },
            itemShort: [],
            item: [],
            profile: {},
            total: {
                transactionTotal: 0,
                sdd: {}
            },
            transactionID: '',
            replacementOrderID: ''
        },
        user: [
            {
                profile: [
                    {
                        profileInfo: {
                            profileID: '',
                            profileStatus: '',
                            userName: ''
                        }
                    }
                ],
                segment: {
                    biStatus: '',
                    biPoints: '',
                    biAccountId: ''
                }
            }
        ],
        lastRefresh: 'hard',
        anonymousUserId: undefined
    };

    //We already declare and set some things that need to happen early, so now extend that
    window.digitalData = deepExtend(digitalData, window.digitalData);
}());
