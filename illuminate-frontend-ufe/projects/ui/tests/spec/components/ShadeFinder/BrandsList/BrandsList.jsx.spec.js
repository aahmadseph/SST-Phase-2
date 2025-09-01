describe('brandslist', () => {
    let React;
    let BrandsList;
    let shallowComponent;
    let brandsListMock;

    beforeEach(() => {
        brandsListMock = [
            {
                brandId: '6149',
                displayName: 'Wander Beauty'
            },
            {
                brandId: '1070',
                displayName: 'Yves Saint Laurent'
            },
            {
                brandId: '5723',
                displayName: 'Amazing Cosmetics'
            },
            {
                brandId: '6212',
                displayName: 'Antonym'
            },
            {
                brandId: '5737',
                displayName: 'bareMinerals'
            },
            {
                brandId: '5938',
                displayName: 'beautyblender'
            },
            {
                brandId: '5717',
                displayName: 'BECCA'
            },
            {
                brandId: 'cb561000',
                displayName: 'CHANEL'
            },
            {
                brandId: '6236',
                displayName: 'Charlotte Tilbury'
            },
            {
                brandId: '1254',
                displayName: 'CLINIQUE'
            },
            {
                brandId: '4225',
                displayName: 'Too Faced'
            },
            {
                brandId: '3806',
                displayName: 'Urban Decay'
            }
        ];

        React = require('react');
        BrandsList = require('components/ShadeFinder/BrandsList/BrandsList').default;
        shallowComponent = enzyme.shallow(<BrandsList />, { disableLifecycleMethods: true });
    });

    describe('it should render brandslist', () => {
        let WizardBody;
        let Flex;
        let brandListContainer;

        beforeEach(() => {
            shallowComponent.setState({ brandsList: brandsListMock });
            WizardBody = shallowComponent.children().find('WizardBody');
            Flex = WizardBody.children().find('Flex');
            brandListContainer = WizardBody.find('div');
        });

        it('should render "Select your current foundation brand" ', () => {
            expect(shallowComponent.childAt(0).props().children).toBe('Select your current foundation brand');
        });

        it('list should render letters', () => {
            expect(Flex.children().length).toBe(27);
        });

        it('should render the list of brands', () => {
            brandListContainer = WizardBody.find('div');
            expect(brandListContainer.children.length).toBeGreaterThan(0);
        });

        it('should organize brands by alphabetical order', () => {
            const firstLetter = Flex.childAt(0).childAt(0).text();
            expect(firstLetter).toBe('A');
        });
    });

    describe('groupBrandsByInitial', () => {
        beforeEach(() => {
            shallowComponent.setState({ brandsList: brandsListMock });
        });

        it('should group brands by their initials', () => {
            const groupedBrands = shallowComponent.instance().groupBrandsByInitial(brandsListMock);
            expect(groupedBrands.B.length).toEqual(3);
        });
    });
});
