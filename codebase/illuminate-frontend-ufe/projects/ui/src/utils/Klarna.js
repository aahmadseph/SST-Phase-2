/*global Klarna*/
import LoadScripts from 'utils/LoadScripts';
import store from 'store/Store';
import orderUtils from 'utils/Order';
import basketUtils from 'utils/Basket';
import AddToBasketActions from 'actions/AddToBasketActions';
import locationUtils from 'utils/Location';
import skuUtils from 'utils/Sku';
import checkoutUtils from 'utils/Checkout';
import localeUtils from 'utils/LanguageLocale';
import bccUtil from 'utils/BCC';
import ResetSessionExpiryActions from 'actions/ResetSessionExpiryActions';
import utilityApi from 'services/api/utility';
import anaConsts from 'analytics/constants';
import OrderUtils from 'utils/Order';
import checkoutApi from 'services/api/checkout';
import ufeApi from 'services/api/ufeApi';
import sessionExtensionService from 'services/SessionExtensionService';

const { IMAGE_SIZES } = bccUtil;

const {
    BASKET_TYPES: { SAMEDAY_BASKET }
} = AddToBasketActions;

const KLARNA_LIB_STATES = {
    LOADING: 'loading',
    READY: 'ready'
};

const SESSION_STATUSES = {
    NEW: 'new',
    UPDATE: 'update',
    empty: 'empty'
};

// Spec: https://developers.klarna.com/api/#payments-api-create-a-new-credit-session
const KLARNA_ITEM_TYPES = {
    PHYSICAL: 'physical',
    DIGITAL: 'digital',
    DISCOUNT: 'discount',
    SHIPPING_FEE: 'shipping_fee',
    SALES_TAX: 'sales_tax',
    GIFT_CARD: 'gift_card',
    STORE_CREDIT: 'store_credit',
    SURCHARGE: 'surcharge',
    FEE: 'fee',
    RETAIL_DELIVERY_FEE: 'rdf'
};

const KLARNA_INSTANCE_ID = 'InstanceId';
const EXTENDED_SESSIONS = 0;

const KLARNA_PAYMENT_METHOD_CATEGORIES =
    localeUtils.isCanada() && Sephora.configurationSettings.installmentPaymentCA === 'Klarna' ? ['pay_later'] : ['pay_over_time'];

const KlarnaUtils = {
    // UPC-348, original URL: https://x.klarnacdn.net/kp/lib/v1/api.js
    KLARNA_LIB_SRC: '/js/ufe/isomorphic/thirdparty/klarna/api.js',
    KLARNA_LIB_STATE: null,
    SESSION_STATUSES,
    EXTENDED_SESSIONS,
    initToken: null,
    loadCallId: 0,
    ERROR_TYPES: {
        AUTH_ERROR: 'auth_error',
        AUTH_DENIAL: 'auth_denial'
    },

    useKlarna: () => {
        return (localeUtils.isCanada() && Sephora.configurationSettings.installmentPaymentCA === 'Klarna') || localeUtils.isUS();
    },

    loadLibrary: function (onLibLoad) {
        switch (this.KLARNA_LIB_STATE) {
            case KLARNA_LIB_STATES.READY:
                onLibLoad && onLibLoad();

                break;
            case KLARNA_LIB_STATES.LOADING:
                // loading in progress, replace current callback with the new one
                this.onLibLoad = onLibLoad;

                break;
            default:
                // loading has not been started yet
                this.KLARNA_LIB_STATE = KLARNA_LIB_STATES.LOADING;
                this.onLibLoad = onLibLoad;
                LoadScripts.loadScripts(
                    [this.KLARNA_LIB_SRC],
                    () => {
                        this.KLARNA_LIB_STATE = KLARNA_LIB_STATES.READY;
                        this.onLibLoad && this.onLibLoad();
                    },
                    true
                );
        }
    },

    convertPrice(amountWithCurrency) {
        return amountWithCurrency ? Math.round(Number(basketUtils.removeCurrency(amountWithCurrency)) * 100) : 0;
    },

    /* eslint-disable camelcase */
    convertAddressToKlarnaAddress: function (address = {}, orderDetails = {}) {
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const { guestProfile, profile } = orderDetails.header;

        return {
            given_name: address.firstName,
            family_name: address.lastName,
            street_address: address.address1,
            phone: address.phone,
            street_address2: address.address2,
            city: address.city,
            region: address.state,
            postal_code: address.postalCode,
            country: address.country,
            email: isGuestCheckout ? guestProfile.email : profile.login
        };
    },

    getOrderPayload(dummyLine = false) {
        const orderDetails = store.getState().order.orderDetails;
        const { header = {} } = orderDetails;

        const orderAmount = this.convertPrice(orderUtils.getCreditCardTotal(orderDetails));

        const orderLines = dummyLine
            ? [
                {
                    quantity: 1,
                    unit_price: orderAmount,
                    total_amount: orderAmount,
                    name: 'Dummy Line'
                }
            ]
            : this.getOrderLines(orderDetails);

        const totalTaxAmount = orderLines.reduce((acc, line) => {
            if (line.type === KLARNA_ITEM_TYPES.SALES_TAX) {
                // eslint-disable-next-line no-param-reassign
                acc += line.total_amount;
            }

            return acc;
        }, 0);

        const locale = localeUtils.isCanada() ? (localeUtils.isFrench() ? 'fr-CA' : 'en-CA') : 'en-US';

        const payload = {
            order_amount: orderAmount,
            order_lines: orderLines,
            order_tax_amount: totalTaxAmount,
            purchase_country: header.orderLocale,
            locale: locale,
            purchase_currency: localeUtils.ISO_CURRENCY[header.orderLocale]
        };

        if (!dummyLine && orderDetails?.header?.isBopisOrder) {
            const bopisPayload = {
                attachment: {
                    content_type: 'application/vnd.klarna.internal.emd-v2+json',
                    body: JSON.stringify({
                        other_delivery_address: [
                            {
                                shipping_method: 'store pick-up',
                                shipping_type: 'express',
                                first_name: orderDetails.pickup?.firstname,
                                last_name: orderDetails.pickup?.lastName,
                                street_address: orderDetails.pickup?.storeDetails.address.address1,
                                street_number: '',
                                postal_code: orderDetails.pickup?.storeDetails.address.postalCode,
                                city: orderDetails.pickup?.storeDetails.address.city,
                                country: orderDetails.pickup?.storeDetails.address.country
                            }
                        ]
                    })
                }
            };

            Object.assign(payload, bopisPayload);
        }

        return payload;
    },

    getOrderLines(orderDetails) {
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Klarna');
        const { header = {}, items = {}, priceInfo = {} } = orderDetails;

        let orderLines = [];

        // Merch Items
        if (items.items && items.items.length) {
            const host = Sephora.UFE_ENV !== 'LOCAL' ? locationUtils.getLocation().origin : 'https://qa.sephora.com';
            const buildCategoryPath = function (catItem = {}, catList = []) {
                const { displayName, parentCategory } = catItem;
                displayName && catList.push(displayName);

                return parentCategory ? buildCategoryPath(parentCategory, catList) : catList.reverse();
            };

            /* eslint-disable-next-line complexity */
            orderLines = items.items.map(item => {
                const { sku } = item;
                const isPriceInPoints = skuUtils.isBiReward(sku);

                const productIdentifiers = {};
                let type = KLARNA_ITEM_TYPES.PHYSICAL;

                if (skuUtils.isSubscription(sku) || skuUtils.isRougeRewardCard(sku)) {
                    type = KLARNA_ITEM_TYPES.DIGITAL;
                }

                const klarnaItem = {
                    type: type,
                    quantity: item.qty,
                    unit_price: !isPriceInPoints ? this.convertPrice(sku.salePrice || sku.listPrice) : 0,
                    total_amount: !isPriceInPoints ? this.convertPrice(item.salePriceSubtotal || item.listPriceSubtotal) : 0,
                    name: sku.productName || ''
                };

                if (sku.skuId && sku.skuId.length <= 64) {
                    klarnaItem.reference = sku.skuId;
                }

                if (sku.fullSiteProductUrl && sku.fullSiteProductUrl.length <= 1024) {
                    klarnaItem.product_url = sku.fullSiteProductUrl;
                }

                if (sku.skuImages) {
                    const imagePath = skuUtils.getImgSrc(IMAGE_SIZES[450], sku.skuImages);
                    const imageFullUrl = `${host}${imagePath}`;

                    if (imagePath && imageFullUrl.length <= 1024) {
                        klarnaItem.image_url = imageFullUrl;
                    }
                }

                if (sku.brandName) {
                    productIdentifiers.brand = sku.brandName;
                }

                if (sku.parentCategory) {
                    const categoryPath = buildCategoryPath(sku.parentCategory).join(' > ');

                    if (categoryPath && categoryPath.length <= 750) {
                        productIdentifiers.category_path = categoryPath;
                    }
                }

                if (Object.keys(productIdentifiers).length) {
                    klarnaItem.product_identifiers = productIdentifiers;
                }

                return klarnaItem;
            });
        }

        // Taxes
        if (header.orderLocale === 'CA') {
            const caTaxes = [
                [priceInfo.goodsAndServicesTax, getText('gstOrHst')],
                [priceInfo.harmonizedSalesTax, getText('gstOrHst')],
                [priceInfo.provincialSalesTax, getText('pst')]
            ];

            for (const caTax of caTaxes) {
                if (!orderUtils.isZeroPrice(caTax[0])) {
                    const caTaxConverted = this.convertPrice(caTax[0]);
                    orderLines.push({
                        type: KLARNA_ITEM_TYPES.SALES_TAX,
                        name: caTax[1],
                        quantity: 1,
                        unit_price: caTaxConverted,
                        total_amount: caTaxConverted
                    });
                }
            }
        } else {
            const usAmount = priceInfo.tax || priceInfo.stateTax;

            if (usAmount) {
                const usTaxConverted = this.convertPrice(usAmount);
                orderLines.push({
                    type: KLARNA_ITEM_TYPES.SALES_TAX,
                    name: getText('tax'),
                    quantity: 1,
                    unit_price: usTaxConverted,
                    total_amount: usTaxConverted
                });
            }
        }

        // Bag fee
        if (priceInfo.bagFeeSubtotal) {
            const priceConverted = this.convertPrice(priceInfo.bagFeeSubtotal);
            orderLines.push({
                type: KLARNA_ITEM_TYPES.PHYSICAL,
                name: getText('bagFee'),
                quantity: 1,
                unit_price: priceConverted,
                total_amount: priceConverted
            });
        }

        // Special fee (pif - Public improvement fees)
        if (priceInfo.pif) {
            const priceConverted = this.convertPrice(priceInfo.pif);
            orderLines.push({
                type: KLARNA_ITEM_TYPES.SURCHARGE,
                name: getText('specialFee'),
                quantity: 1,
                unit_price: priceConverted,
                total_amount: priceConverted
            });
        }

        // Fees
        if (priceInfo.fees && priceInfo.fees.length) {
            priceInfo.fees.forEach(fee => {
                const priceConverted = this.convertPrice(fee.feeAmount);
                // For states that require a Retail Delivery Fee line item,
                // we need to convert the type to a shipping_fee
                const type =
                    fee.feeName?.toLowerCase() === KLARNA_ITEM_TYPES.RETAIL_DELIVERY_FEE ? KLARNA_ITEM_TYPES.SHIPPING_FEE : KLARNA_ITEM_TYPES.FEE;

                orderLines.push({
                    type,
                    name: fee.feeName,
                    quantity: 1,
                    unit_price: priceConverted,
                    total_amount: priceConverted
                });
            });
        }

        // Promos
        if (priceInfo.promotionDiscount) {
            const discountConverted = this.convertPrice(priceInfo.promotionDiscount);
            orderLines.push({
                type: KLARNA_ITEM_TYPES.DISCOUNT,
                name: getText('discounts'),
                quantity: 1,
                unit_price: -discountConverted,
                total_amount: -discountConverted
            });
        }

        // Shipping
        if (priceInfo.totalShipping && !checkoutUtils.isZeroFee(priceInfo.totalShipping)) {
            const shippingFeeConverted = this.convertPrice(priceInfo.totalShipping);
            orderLines.push({
                type: KLARNA_ITEM_TYPES.SHIPPING_FEE,
                name: getText('shippingAndHandling'),
                quantity: 1,
                unit_price: shippingFeeConverted,
                total_amount: shippingFeeConverted
            });
        }

        // store credits
        if (priceInfo.storeCardAmount) {
            const storeCardConverted = this.convertPrice(priceInfo.storeCardAmount);
            orderLines.push({
                type: KLARNA_ITEM_TYPES.STORE_CREDIT,
                name: getText('storeCreditRedeemed'),
                quantity: 1,
                unit_price: -storeCardConverted,
                total_amount: -storeCardConverted
            });
        }

        [
            [priceInfo.giftCardAmount, getText('giftCardRedeemed')],
            [priceInfo.eGiftCardAmount, getText('eGiftCardRedeemed')]
        ].forEach(type => {
            if (type[0]) {
                const priceConverted = this.convertPrice(type[0]);
                orderLines.push({
                    type: KLARNA_ITEM_TYPES.GIFT_CARD,
                    name: type[1],
                    quantity: 1,
                    unit_price: -priceConverted,
                    total_amount: -priceConverted
                });
            }
        });

        return orderLines;
    },

    load: function (elId, clientToken) {
        return new Promise((resolve, reject) => {
            try {
                // since Klarna.Payments.load() is not cancellable,
                // multiple simultaneous calls are possible and the obsolete ones will fire callback with an error.
                // getKlarnaLoadCallback generates callback for Klarna.Payments.load with a call identifier injected.
                // if multiple calls are made, results of the last one (the current) will only be processed
                const getKlarnaLoadCallback = id => {
                    return res => {
                        if (id !== this.loadCallId) {
                            return;
                        }

                        if (res && res.show_form) {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    };
                };

                this.loadLibrary(() => {
                    if (!this.initToken || this.initToken !== clientToken) {
                        Klarna.Payments.init({ client_token: clientToken });
                        this.initToken = clientToken;
                    }

                    const orderTotalPayload = this.getOrderPayload(true);
                    this.loadCallId = performance && performance.now ? performance.now() : Date.now();

                    Klarna.Payments.load(
                        {
                            container: '#' + elId,
                            instance_id: KLARNA_INSTANCE_ID,
                            payment_method_categories: KLARNA_PAYMENT_METHOD_CATEGORIES
                        },
                        orderTotalPayload,
                        getKlarnaLoadCallback(this.loadCallId)
                    );
                });
            } catch (e) {
                reject(e);
            }
        });
    },

    initPaymentGroup: function () {
        return new Promise((resolve, reject) => {
            checkoutApi
                .initializeKlarnaCheckout({ status: SESSION_STATUSES.UPDATE })
                .then(session => {
                    checkoutApi
                        .getOrderDetails(OrderUtils.getOrderId())
                        .then(order => {
                            resolve({ session, order });
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    authorize: function (orderDetails, useMyShippingAddress) {
        return new Promise((resolve, reject) => {
            try {
                const sameDayDeliveryBasket = orderDetails?.items?.itemsByBasket?.find(obj => obj.basketType === SAMEDAY_BASKET);
                const shippingAddress = sameDayDeliveryBasket
                    ? orderUtils.getSameDayShippingAddress(orderDetails)
                    : orderUtils.getHardGoodShippingAddress(orderDetails);
                const payload = this.getOrderPayload();
                const isBopisOrder = orderDetails?.header?.isBopisOrder;

                if (!isBopisOrder) {
                    payload.shipping_address = this.convertAddressToKlarnaAddress(shippingAddress, orderDetails);
                }

                if (useMyShippingAddress) {
                    payload.billing_address = payload.shipping_address;
                    payload.merchant_reference2 = 'address_collected';
                }

                Klarna.Payments.authorize(
                    {
                        instance_id: KLARNA_INSTANCE_ID,
                        payment_method_categories: KLARNA_PAYMENT_METHOD_CATEGORIES
                    },
                    payload,
                    res => {
                        if (!res.show_form && !res.approved) {
                            // eslint-disable-next-line no-console
                            console.error(res);
                            // eslint-disable-next-line prefer-promise-reject-errors
                            reject({
                                type: this.ERROR_TYPES.AUTH_DENIAL,
                                error: res
                            });
                        } else {
                            resolve(res);
                        }
                    }
                );
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({
                    type: this.ERROR_TYPES.AUTH_ERROR,
                    error: e
                });
            }
        });
    },

    makeSessionCall: function () {
        utilityApi
            .resetSessionExpiry()
            .then(() => {
                const { getCallsCounter } = ufeApi;

                store.dispatch(ResetSessionExpiryActions.resetSessionExpiry());
                sessionExtensionService.setExpiryTimer(getCallsCounter());
                this.EXTENDED_SESSIONS++;
            })
            .catch(console.error); // eslint-disable-line no-console
    },

    extendSessionInBackground: function () {
        const { isActive } = store.getState().klarna;

        if (isActive) {
            this.EXTENDED_SESSIONS < 3 && this.makeSessionCall();

            return true;
        }

        return false;
    },

    getPageDetail: function (isAfterpayEnabled, isKlarnaEnabled) {
        const { AFTERPAY_PAYMENT, KLARNA_PAYMENT, FLEXIBLE_PAYMENTS } = anaConsts.PAGE_DETAIL;

        const pageDetail = isAfterpayEnabled && isKlarnaEnabled ? FLEXIBLE_PAYMENTS : isAfterpayEnabled ? AFTERPAY_PAYMENT : KLARNA_PAYMENT;

        return `${pageDetail} modal`;
    }
};

export default KlarnaUtils;
