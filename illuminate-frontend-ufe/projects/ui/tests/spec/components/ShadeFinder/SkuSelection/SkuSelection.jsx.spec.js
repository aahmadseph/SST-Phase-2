describe('SkuSelection', () => {
    const React = require('react');
    const SkuSelection = require('components/ShadeFinder/SkuSelection/SkuSelection').default;
    let wizardObject;
    let shallowComponent;
    let regularChildSkus;

    beforeEach(() => {
        regularChildSkus = [
            {
                image: '/productimages/sku/s1868710-main-hero.jpg',
                colorName: '100',
                shadeCode: '1R02',
                size: '0.32 oz/ 9.1 g',
                skuId: '1868710',
                type: 'Standard',
                variationValue: 'Alabaster',
                hexShadeCode: '098976'
            },
            {
                image: '/productimages/sku/s1868751-main-hero.jpg',
                shadeCode: '2Y02',
                colorName: '101',
                description: 'sku description',
                size: '0.32 oz/ 9.1 g',
                skuId: '1868751',
                swatchImage: '/productimages/sku/s1868751+sw.jpg',
                type: 'Standard',
                variationValue: 'Warm Alabaster'
            },
            {
                image: '/productimages/sku/s1852268-main-hero.jpg',
                shadeCode: '3Y01',
                colorName: '102',
                description: 'sku description',
                size: '0.32 oz/ 9.1 g',
                skuId: '1852268',
                swatchImage: '/productimages/sku/s1852268+sw.jpg',
                type: 'Standard',
                variationValue: 'Porcelain'
            },
            {
                image: '/productimages/sku/s1852284-main-hero.jpg',
                shadeCode: '2Y01',
                colorName: '103',
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

        shallowComponent = enzyme.shallow(<SkuSelection />);
        shallowComponent.setState(wizardObject);
    });

    describe('render', () => {
        let WizardSubhead;
        let WizardBody;
        beforeEach(() => {
            WizardSubhead = shallowComponent.children().find('WizardSubhead');
            WizardBody = shallowComponent.children().find('WizardBody');
        });

        describe('WizardSubhead', () => {
            it('WizarSubhead should have 3 children', () => {
                expect(WizardSubhead.children().length).toBe(3);
            });

            it('should render displayName', () => {
                const RenderedDisplayName = wizardObject.brandName + ' ' + wizardObject.displayName;
                expect(WizardSubhead.childAt(2).props().children).toBe(RenderedDisplayName);
            });
        });

        describe('WizardBody', () => {
            it('WizardBody should render regularChildSku.length children', () => {
                expect(WizardBody.children().length).toBe(regularChildSkus.length);
            });
        });

        describe('Sku List item', () => {
            let sku0;
            let sku1;
            beforeEach(() => {
                sku0 = WizardBody.children().children().at(0).props();
                sku1 = WizardBody.children().children().at(1).props();
            });

            it('Sku should render hexShadeCode as background when no swatchImage is present', () => {
                expect(sku0.children[0].props.backgroundColor).toBe(`#${regularChildSkus[0].hexShadeCode}`);
            });

            it('Sku should render swatchImage', () => {
                expect(sku1.children[0].props.src).toBe(regularChildSkus[1].swatchImage);
            });

            it('Sku should render only colorName', () => {
                expect(sku0.children[1].props.children).toBe(`${regularChildSkus[0].colorName} `);
            });

            it('Sku should render colorName - Description', () => {
                expect(sku1.children[1].props.children).toBe('101 - sku description');
            });
        });
    });
});
