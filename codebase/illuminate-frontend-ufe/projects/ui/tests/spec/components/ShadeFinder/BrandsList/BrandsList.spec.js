const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('BrandsList component', () => {
    const BrandsList = require('components/ShadeFinder/BrandsList/BrandsList').default;
    const reverseLookUpApi = require('services/api/sdn').default;
    let component;
    let brandsList;
    let apiData;

    beforeEach(() => {
        brandsList = [
            {
                brandId: '5723',
                displayName: 'Amazing Cosmetics'
            },
            {
                brandId: '5945',
                displayName: 'AMOREPACIFIC'
            },

            {
                brandId: '5717',
                displayName: 'BECCA'
            },
            {
                brandId: '6127',
                displayName: 'Black Up'
            },
            {
                brandId: '6200',
                displayName: 'FENTY BEAUTY by Rihanna'
            },
            {
                brandId: '1517',
                displayName: 'Giorgio Armani Beauty'
            }
        ];

        apiData = { brands: brandsList };

        const wrapper = shallow(<BrandsList />, { disableLifecycleMethods: true });
        component = wrapper.instance();
    });

    describe('Controller', () => {
        let setStateStub;

        beforeEach(() => {
            setStateStub = spyOn(component, 'setState');

            spyOn(reverseLookUpApi, 'getBrandsList').and.returnValue({
                then: callback => {
                    callback(apiData);
                }
            });

            component.componentDidMount();
        });

        it('should call brands to set state', () => {
            expect(setStateStub).toHaveBeenCalledWith({ brandsList: apiData.brands });
        });
    });
});
