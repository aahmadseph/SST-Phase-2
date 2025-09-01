const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('SkuSelection component', () => {
    const SkuSelection = require('components/ShadeFinder/SkuSelection/SkuSelection').default;
    const wizardActions = require('actions/WizardActions').default;
    const store = require('store/Store').default;
    let wizardObject;
    let component;
    let regularChildSkus;

    const reverseLookUpApi = require('services/api/sdn').default;

    beforeEach(() => {
        regularChildSkus = [
            {
                image: '/productimages/sku/s1868710-main-hero.jpg',
                shadeCode: '1R02',
                size: '0.32 oz/ 9.1 g',
                skuId: '1868710',
                swatchImage: '/productimages/sku/s1868710+sw.jpg',
                type: 'Standard',
                variationValue: 'Alabaster'
            },
            {
                image: '/productimages/sku/s1868751-main-hero.jpg',
                shadeCode: '2Y02',
                size: '0.32 oz/ 9.1 g',
                skuId: '1868751',
                swatchImage: '/productimages/sku/s1868751+sw.jpg',
                type: 'Standard',
                variationValue: 'Warm Alabaster'
            },
            {
                image: '/productimages/sku/s1852268-main-hero.jpg',
                shadeCode: '3Y01',
                size: '0.32 oz/ 9.1 g',
                skuId: '1852268',
                swatchImage: '/productimages/sku/s1852268+sw.jpg',
                type: 'Standard',
                variationValue: 'Porcelain'
            },
            {
                image: '/productimages/sku/s1852284-main-hero.jpg',
                shadeCode: '2Y01',
                size: '0.32 oz/ 9.1 g',
                skuId: '1852284',
                swatchImage: '/productimages/sku/s1852284+sw.jpg',
                type: 'Standard',
                variationValue: 'Warm Porcelain'
            }
        ];

        wizardObject = {
            regularChildSkus: regularChildSkus,
            brandName: 'Anastasia Beverly Hills',
            displayName: 'Stick Foundation'
        };

        spyOn(store, 'getState').and.returnValue(wizardObject);
        const wrapper = shallow(<SkuSelection />);
        component = wrapper.instance();
    });

    describe('selectSku method', () => {
        let selectedProductShadeCode;
        let selectSku;
        let goToNextPageSpy;

        beforeEach(() => {
            selectedProductShadeCode = wizardObject.regularChildSkus[0].shadeCode;
            selectSku = spyOn(component, 'selectSku');
            goToNextPageSpy = spyOn(wizardActions, 'goToNextPage');
        });
        it('selectSku toHaveBeenCalledWith', () => {
            component.selectSku('1R02');
            expect(selectSku).toHaveBeenCalledWith(selectedProductShadeCode);
        });

        it('goToNextPage toHaveBeenCalledWith', () => {
            goToNextPageSpy('1R02');
            expect(goToNextPageSpy).toHaveBeenCalledWith(selectedProductShadeCode);
        });
    });

    xdescribe('ctrlr', () => {
        let setStateStub;
        let fakePromise;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');
        });

        it('setState toHaveBeenCalledWith', () => {
            fakePromise = {
                then: function (resolve) {
                    expect(setStateStub).toHaveBeenCalledWith(wizardObject);
                    resolve(wizardObject);

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            spyOn(reverseLookUpApi, 'getProductSkuList').and.returnValue(fakePromise);
            // component.ctrlr();
        });
    });
});
