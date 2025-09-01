describe('addToBasketEvent analytics', () => {
    let addToBasketEvent;
    let anaConsts;
    let utils;
    let data;
    let currentEvent;

    beforeEach(() => {
        addToBasketEvent = require('analytics/bindings/pages/all/addToBasketEvent').default;
        anaConsts = require('analytics/constants').default;
        utils = require('analytics/utils').default;
        data = {
            sku: {},
            context: '',
            analyticsData: {},
            previousPage: ''
        };
        currentEvent = { eventInfo: { attributes: {} } };
        spyOn(utils, 'getMostRecentEvent').and.returnValue(currentEvent);
    });

    it('should populate the eventStrings array with anaConsts.Event.SC_ADD by default', () => {
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.eventStrings).toEqual([anaConsts.Event.SC_ADD]);
    });

    it('should set prop55 to \'add to basket\' value by default', () => {
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.actionInfo).toEqual('Add To Basket');
    });

    it('should set linkName to \'Add To Basket\' value by default', () => {
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.linkName).toEqual('Add To Basket');
    });

    it('should set prop55 to \'Add To Basket For Store Pickup\' value when adding item to pickup basket', () => {
        data.analyticsData.isPickup = true;
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.actionInfo).toEqual('Add To Basket For Store Pickup');
    });

    it('should set linkName to \'Add To Basket For Store Pickup\' value when adding item to pickup basket', () => {
        data.analyticsData.isPickup = true;
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.linkName).toEqual('Add To Basket For Store Pickup');
    });

    it('should set linkName to \'add to basket for same day delivery\' value when adding item to pickup basket', () => {
        data.analyticsData.isSameDay = true;
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.linkName).toEqual('add to basket for same day delivery');
    });

    it('should add container name to prop55 if presented', () => {
        data.sku.rootContainerName = 'container name';
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.actionInfo).toEqual('container name:add to basket');
    });

    it('should ignore container name in case of Use It With section even if presented', () => {
        data.sku.rootContainerName = anaConsts.CONTEXT.USE_IT_WITH;
        data.context = anaConsts.CONTEXT.USE_IT_WITH;
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.actionInfo).toEqual('Add To Basket');
    });

    it('should set actionInfo as "add to basket" (lowercaps) if previousPage contains "basket"', () => {
        data.previousPage = 'basket';
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.actionInfo).toEqual('add to basket');
    });

    it('should set linkName to \'Add Full Size\' value when isAddFullSize flag comes true', () => {
        data.analyticsData.isAddFullSize = true;
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.linkName).toEqual('Add Full Size');
    });

    it('should set linkName to \'product:custom set:add all to basket\' value when it is a Custom Set', () => {
        data.sku.configurableOptions = {
            groupedSkuOptions: [{ groupProduct: {} }],
            displayName: 'LM_Custom_FlawlessFace_071620'
        };
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.linkName).toEqual(anaConsts.LinkData.ADD_TO_BASKET_CUSTOM_SET);
    });

    it('should set actionInfo as "product:custom set:add all to basket" value when it is a Custom Set', () => {
        data.sku.configurableOptions = {
            groupedSkuOptions: [{ groupProduct: {} }],
            displayName: 'LM_Custom_FlawlessFace_071620'
        };
        addToBasketEvent(data);
        expect(currentEvent.eventInfo.attributes.actionInfo).toEqual(anaConsts.LinkData.ADD_TO_BASKET_CUSTOM_SET);
    });
});
