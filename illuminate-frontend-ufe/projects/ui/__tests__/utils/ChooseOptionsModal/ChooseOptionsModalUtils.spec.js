import PageTemplateType from 'constants/PageTemplateType';
import ChooseOptionsModalUtils from 'utils/ChooseOptionsModal/ChooseOptionsModalUtils';
import * as showBuyItAgainATBModalSelector from 'selectors/testTarget/offers/showBuyItAgainATBModal/showBuyItAgainATBModalSelector';
import store from 'store/Store';
import { COMPONENT_SIDS } from 'constants/ShopYourStore';
import basketConstants from 'constants/Basket';
import { DELIVERY_OPTION_TYPES, COMPONENT_SIDS as SIDS } from 'components/GlobalModals/ChooseOptionsModal/constants';

const { shouldShowChooseOptionsModal, getEligiblePagesToShowChooseOptionsModal, mapDeliveryOptionToType } = ChooseOptionsModalUtils;
const { DELIVERY_OPTIONS } = basketConstants;
const { BASKET_YOUR_SAVED_ITEMS_CAROUSEL } = SIDS;

jest.mock('store/Store', () => ({
    getState: jest.fn()
}));

jest.mock('selectors/testTarget/offers/showBuyItAgainATBModal/showBuyItAgainATBModalSelector', () => ({
    showBuyItAgainATBModalSelector: jest.fn()
}));

describe('ChooseOptionsModalUtils', () => {
    const originalSephora = window.Sephora;
    const props = {
        componentName: COMPONENT_SIDS.SHOP_MY_STORE_BUY_IT_AGAIN
    };

    beforeEach(() => {
        window.Sephora = {
            configurationSettings: {
                chooseOptionsModal: {
                    buyItAgain: {},
                    myLists: {}
                }
            },
            pagePath: ''
        };
        jest.resetAllMocks();
    });

    afterAll(() => {
        window.Sephora = originalSephora;
    });

    describe('getEligiblePagesToShowChooseOptionsModal', () => {
        test('should return an empty array when buyItAgain KillSwitch is disabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = false;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = false;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: true });
            store.getState.mockReturnValue({});

            expect(getEligiblePagesToShowChooseOptionsModal(props)).toEqual([]);
        });

        test('should return eligible pages when buyItAgain KillSwitch is enabled and T&T flag is enabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: true });
            store.getState.mockReturnValue({});

            expect(getEligiblePagesToShowChooseOptionsModal(props)).toEqual([
                PageTemplateType.PurchaseHistory,
                PageTemplateType.ShopMyStore,
                PageTemplateType.ShopSameDay
            ]);
        });

        test('should return only SYS and SDD pages when buyItAgain KillSwitch is enabled but T&T flag is disabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: false });
            store.getState.mockReturnValue({});

            expect(getEligiblePagesToShowChooseOptionsModal(props)).toEqual([PageTemplateType.ShopMyStore, PageTemplateType.ShopSameDay]);
        });

        test('should return MyLists and MyCustomList when myLists KillSwitch is enabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;
            store.getState.mockReturnValue({});

            expect(getEligiblePagesToShowChooseOptionsModal(props)).toEqual([PageTemplateType.MyLists, PageTemplateType.MyCustomList]);
        });

        test('should return eligible pages when myLists KillSwitch is enabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;

            expect(
                getEligiblePagesToShowChooseOptionsModal({
                    componentName: COMPONENT_SIDS.SHOP_MY_STORE_FROM_YOUR_LOVES
                })
            ).toEqual([PageTemplateType.MyLists, PageTemplateType.MyCustomList, PageTemplateType.ShopMyStore, PageTemplateType.ShopSameDay]);
        });

        test('should return eligible pages when myLists KillSwitch is enabled and origin is saved items carousel', () => {
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;

            expect(
                getEligiblePagesToShowChooseOptionsModal({
                    componentName: BASKET_YOUR_SAVED_ITEMS_CAROUSEL
                })
            ).toEqual([PageTemplateType.MyLists, PageTemplateType.MyCustomList, PageTemplateType.RwdBasket]);
        });

        test('should return all eligible pages when all conditions are met', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: true });
            store.getState.mockReturnValue({});

            expect(getEligiblePagesToShowChooseOptionsModal(props)).toEqual([
                PageTemplateType.PurchaseHistory,
                PageTemplateType.MyLists,
                PageTemplateType.MyCustomList,
                PageTemplateType.ShopMyStore,
                PageTemplateType.ShopSameDay
            ]);
        });
    });

    describe('shouldShowChooseOptionsModal', () => {
        beforeEach(() => {
            // Default to no features enabled
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = false;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = false;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: false });
            store.getState.mockReturnValue({});
        });

        test('should return false if fromChooseOptionsModal is true', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;
            expect(shouldShowChooseOptionsModal({ fromChooseOptionsModal: true })).toBe(false);
        });

        test('should return false if buyItAgain KillSwitch is disabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = false;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;

            Sephora.pagePath = PageTemplateType.PurchaseHistory;
            expect(shouldShowChooseOptionsModal()).toBe(false);

            Sephora.pagePath = PageTemplateType.ShopMyStore;
            expect(shouldShowChooseOptionsModal()).toBe(false);

            Sephora.pagePath = PageTemplateType.ShopSameDay;
            expect(shouldShowChooseOptionsModal()).toBe(false);
        });

        test('should return false if myLists KillSwitch is disabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = false;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: true });

            Sephora.pagePath = PageTemplateType.MyLists;
            expect(shouldShowChooseOptionsModal()).toBe(false);

            Sephora.pagePath = PageTemplateType.MyCustomList;
            expect(shouldShowChooseOptionsModal()).toBe(false);
        });

        test('should return true for inline loves when myLists KillSwitch is enabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = false;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;
            expect(shouldShowChooseOptionsModal({ isInlineLoves: true })).toBe(true);
        });

        test('should return false for inline loves when myLists KillSwitch is disabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = false;
            expect(shouldShowChooseOptionsModal({ isInlineLoves: true })).toBe(false);
        });

        test('should return true if on an eligible page and both features are enabled', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: true });

            Sephora.pagePath = PageTemplateType.PurchaseHistory;
            expect(shouldShowChooseOptionsModal()).toBe(true);

            Sephora.pagePath = PageTemplateType.ShopMyStore;
            expect(shouldShowChooseOptionsModal(props)).toBe(true);

            Sephora.pagePath = PageTemplateType.ShopSameDay;
            expect(shouldShowChooseOptionsModal(props)).toBe(true);

            Sephora.pagePath = PageTemplateType.MyLists;
            expect(shouldShowChooseOptionsModal()).toBe(true);

            Sephora.pagePath = PageTemplateType.MyCustomList;
            expect(shouldShowChooseOptionsModal()).toBe(true);
        });

        test('should return false if not on an eligible page', () => {
            Sephora.configurationSettings.chooseOptionsModal.buyItAgain.isEnabled = true;
            Sephora.configurationSettings.chooseOptionsModal.myLists.isEnabled = true;
            showBuyItAgainATBModalSelector.showBuyItAgainATBModalSelector.mockReturnValue({ show: true });
            Sephora.pagePath = 'some-other-page';
            expect(shouldShowChooseOptionsModal()).toBe(false);
        });
    });

    describe('mapDeliveryOptionToType', () => {
        test('should map STANDARD delivery option to SHIPPED type', () => {
            const result = mapDeliveryOptionToType(DELIVERY_OPTIONS.STANDARD);
            expect(result).toBe(DELIVERY_OPTION_TYPES.SHIPPED);
        });

        test('should map SAME_DAY delivery option to SAME_DAY type', () => {
            const result = mapDeliveryOptionToType(DELIVERY_OPTIONS.SAME_DAY);
            expect(result).toBe(DELIVERY_OPTION_TYPES.SAME_DAY);
        });

        test('should map PICKUP delivery option to PICKUP type', () => {
            const result = mapDeliveryOptionToType(DELIVERY_OPTIONS.PICKUP);
            expect(result).toBe(DELIVERY_OPTION_TYPES.PICKUP);
        });

        test('should return null for undefined delivery option', () => {
            const result = mapDeliveryOptionToType(undefined);
            expect(result).toBe(null);
        });

        test('should return null for null delivery option', () => {
            const result = mapDeliveryOptionToType(null);
            expect(result).toBe(null);
        });

        test('should return null for empty string delivery option', () => {
            const result = mapDeliveryOptionToType('');
            expect(result).toBe(null);
        });

        test('should return null for invalid delivery option', () => {
            const result = mapDeliveryOptionToType('INVALID_OPTION');
            expect(result).toBe(null);
        });
    });
});
