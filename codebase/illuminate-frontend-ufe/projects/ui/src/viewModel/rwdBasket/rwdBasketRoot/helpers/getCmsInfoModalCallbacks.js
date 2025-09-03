import store from 'store/Store';
import Actions from 'Actions';
const { showContentModal } = Actions;

import {
    ROOT_BASKET_TYPES, MAIN_BASKET_TYPES, DC_BASKET_TYPES, SECONDARY_COLUMN_TYPES, CXS_INFO_MODAL_KEYS
} from 'constants/RwdBasket';
const { MAIN_BASKET, PRE_BASKET } = ROOT_BASKET_TYPES;
const { DC_BASKET, BOPIS_BASKET } = MAIN_BASKET_TYPES;
const { SAMEDAY_BASKET, AUTOREPLENISH_BASKET, STANDARD_BASKET } = DC_BASKET_TYPES;
const { PAYMENT_INFO, BI_BENEFITS } = SECONDARY_COLUMN_TYPES;

import { globalModals, renderModal } from 'utils/globalModals';
const { AUTO_REPLENISH_PRODUCT_INFO } = globalModals;

function getCmsInfoModalCallbacks(cmsData = {}, globalModalsData) {
    const callbackMap = {};

    for (const key of CXS_INFO_MODAL_KEYS) {
        const modalConfig = cmsData[key];

        if (modalConfig != null) {
            callbackMap[key] = () => {
                store.dispatch(showContentModal({ isOpen: true, data: modalConfig }));
            };
        }
    }

    const biBenefits = {
        featuredOffers: callbackMap?.foModal,
        cbr: callbackMap?.biCashModal,
        pfd: callbackMap?.discountEventPointsModal,
        applyRougeRewards: callbackMap?.rougeRewardsModal,
        ccTermsConditions: callbackMap?.crditCadRewrdTemsCond,
        creditCardRewardsModal: callbackMap?.creditCardRewardsModal,
        biFeaturedOffers: callbackMap?.biFeaturedOffers
    };

    return {
        [MAIN_BASKET]: {
            [BOPIS_BASKET]: {
                cartHeader: callbackMap?.bopisModal,
                [BI_BENEFITS]: biBenefits,
                [PAYMENT_INFO]: {
                    bagFee: callbackMap?.bagFeeModal,
                    salesTax: callbackMap?.bopisEstimatedTaxModal
                }
            },
            [DC_BASKET]: {
                [BI_BENEFITS]: biBenefits,
                [PAYMENT_INFO]: {
                    salesTax: callbackMap?.stModal,
                    shippingAndHandling: callbackMap?.shModal
                },
                [AUTOREPLENISH_BASKET]: {
                    cartHeader: () => renderModal(globalModalsData[AUTO_REPLENISH_PRODUCT_INFO], callbackMap?.arModal)
                },
                [SAMEDAY_BASKET]: {
                    cartHeader: callbackMap?.sddModal
                },
                [STANDARD_BASKET]: {}
            }
        },
        [PRE_BASKET]: {
            [BOPIS_BASKET]: {
                cartHeader: callbackMap?.bopisModal
            },
            [DC_BASKET]: {
                [AUTOREPLENISH_BASKET]: {
                    cartHeader: callbackMap?.arModal
                },
                [SAMEDAY_BASKET]: {
                    cartHeader: callbackMap?.sddModal
                }
            }
        }
    };
}

export { getCmsInfoModalCallbacks };
