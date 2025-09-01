const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const ReviewsFilters = require('components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFilters').default;
const ProductActions = require('actions/ProductActions').default;
const store = require('Store').default;

describe('<ReviewsFilters />', () => {
    let wrapper;
    let e;
    let filterConfiguration;

    beforeEach(() => {
        spyOn(store, 'dispatch');
        wrapper = shallow(
            <ReviewsFilters
                productId={'123'}
                filtersConfiguration={[]}
            />,
            { disableLifecycleMethods: true }
        );
        e = { preventDefault: jasmine.createSpy() };
        filterConfiguration = {
            id: 'someId',
            type: 'singleSelect',
            options: [
                {
                    value: 'someValue1',
                    bvValue: 'someBvValue1'
                },
                {
                    value: 'someValue2',
                    bvValue: 'someBvValue2'
                }
            ]
        };
    });

    describe('render', () => {
        it('should render cancel search link data-at when search is active', () => {
            wrapper.setState({ isSearch: true });

            const cancelLink = wrapper.findWhere(x => x.name() === 'Link' && x.prop('data-at') === 'rr_search_cancel');

            expect(cancelLink.exists()).toBeTruthy();
        });
    });

    describe('renderFilter', () => {
        // Temp removal of BeautyMatchFilter as per AC1 in https://jira.sephora.com/browse/INFL-642
        // this tets case should be updated once BM feature implemented
        // it('should render BeautyMatchFilter if filter id is beautyMatches', () => {
        //     filterConfiguration.id = 'beautyMatches';
        //     const component = wrapper.instance();

        //     const result = component.renderFilter(filterConfiguration);

        //     expect(result.type.class).toBe('BeautyMatchFilter');
        // });

        it('should render Pill if filter type is singleSelect and it has only one option', () => {
            filterConfiguration.type = 'singleSelect';
            filterConfiguration.options = [
                {
                    value: 'someValue',
                    bvValue: 'someBvValue'
                }
            ];
            const component = wrapper.instance();

            const result = component.renderFilter(filterConfiguration);

            expect(result.type.class).toBe('Pill');
        });

        it('should render Filter if filter type singleSelect with more than one option', () => {
            filterConfiguration.type = 'singleSelect';
            const component = wrapper.instance();

            const result = component.renderFilter(filterConfiguration);

            expect(result.type.class).toBe('Filter');
        });

        it('should render Filter is filter type is multiSelect', () => {
            filterConfiguration.type = 'multiSelect';
            const component = wrapper.instance();

            const result = component.renderFilter(filterConfiguration);

            expect(result.type.class).toBe('Filter');
        });
    });

    describe('renderContent', () => {
        let contentProps;

        beforeEach(() => {
            contentProps = {
                onClick: () => {},
                isSelected: x => !x,
                isModal: true
            };
        });

        it('should render array of ShadeFilters if filter id is sku and it is Modal', () => {
            filterConfiguration.id = 'sku';
            wrapper.setState({
                skuAggregatedList: [
                    {
                        skuId: '1',
                        smallImage: 'img',
                        variationValue: 'variationValue'
                    }
                ]
            });
            const component = wrapper.instance();

            const result = component.renderContent(filterConfiguration, contentProps);

            expect(result[0].type.class).toBe('ShadeFilter');
        });

        it('should render Box if filter id is sku and it is not Modal', () => {
            filterConfiguration.id = 'sku';
            contentProps.isModal = false;
            wrapper.setState({
                skuAggregatedList: [
                    {
                        skuId: '1',
                        smallImage: 'img',
                        variationValue: 'variationValue'
                    }
                ]
            });
            const component = wrapper.instance();

            const result = component.renderContent(filterConfiguration, contentProps);

            expect(result.type.class).toBe('Box');
        });

        it('should render array of RadioFilters if filter type is singleSelect', () => {
            filterConfiguration.type = 'singleSelect';
            const component = wrapper.instance();

            const result = component.renderContent(filterConfiguration, contentProps);

            expect(result[0].type.class).toBe('RadioFilter');
        });

        it('should render array of CheckboxImageFilters if filter type is multiSelect and optionType is withImage', () => {
            filterConfiguration.type = 'multiSelect';
            filterConfiguration.optionType = 'withImage';
            const component = wrapper.instance();

            const result = component.renderContent(filterConfiguration, contentProps);

            expect(result[0].type.class).toBe('CheckboxImageFilter');
        });

        it('should render array of Checkboxs if filter type is multiSelect', () => {
            filterConfiguration.type = 'multiSelect';
            const component = wrapper.instance();

            const result = component.renderContent(filterConfiguration, contentProps);

            expect(result[0].type.class).toBe('Checkbox');
        });
    });

    describe('handlePageClick()', () => {
        let applyReviewsSearchStub;

        beforeEach(() => {
            applyReviewsSearchStub = spyOn(ProductActions, 'applyReviewsSearch');
        });

        it('should call ApplyReviewsSearch with the correct values if search keyword is submitted', () => {
            wrapper.setState({ isSearch: true });

            const component = wrapper.instance();
            component.inputRef = { current: { getValue: createSpy().and.returnValue('red') } };
            component.handleSearchSubmit(e);

            expect(applyReviewsSearchStub).toHaveBeenCalledWith('123', 'red');
        });
    });
});
