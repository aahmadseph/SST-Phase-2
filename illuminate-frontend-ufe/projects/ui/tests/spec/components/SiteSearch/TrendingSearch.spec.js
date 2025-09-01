const React = require('react');
const { createSpy } = jasmine;
const TrendingSearch = require('components/SiteSearch/TrendingSearch').default;
const { mount } = require('enzyme');
const {
    colors, space, mediaQueries, lineHeights, fontSizes
} = require('style/config');

describe('TrendingSearch Component', () => {
    let wrapper;
    let baseProps;
    let handleItemClickSpy;
    let highlightSpy;
    let inputRefGetValueSpy;

    beforeEach(() => {
        handleItemClickSpy = createSpy();
        highlightSpy = createSpy().and.returnValue('item value');
        inputRefGetValueSpy = createSpy().and.returnValue(true);

        const styles = {
            result: {
                display: 'flex',
                alignItems: 'center',
                minWidth: '100%',
                paddingTop: space[2],
                paddingBottom: space[2],
                lineHeight: lineHeights.tight,
                fontSize: fontSizes.sm,
                [mediaQueries.xsMax]: {
                    marginLeft: -space.container,
                    marginRight: -space.container,
                    paddingLeft: space.container,
                    paddingRight: space.container
                },
                [mediaQueries.sm]: {
                    fontSize: fontSizes.base,
                    paddingLeft: space[4],
                    paddingRight: space[4]
                }
            },
            resultHover: {
                backgroundColor: colors.nearWhite
            },
            resultHeader: {
                color: colors.gray
            }
        };

        baseProps = {
            styles: styles,
            results: [
                {
                    term: 'lip balm treatment',
                    value: 'lip balm treatment'
                },
                {
                    term: 'clinique lip balm treatment',
                    value: 'clinique lip balm treatment'
                }
            ],
            handleItemClick: handleItemClickSpy,
            highlight: highlightSpy,
            inputRef: {
                current: {
                    getValue: inputRefGetValueSpy
                }
            },
            section: 'Trending Categories',
            trendingCategories: [
                {
                    value: 'Lip Balms & Treatments',
                    url: '/shop/lip-balm-lip-care'
                },
                {
                    value: 'Lip Balm & Treatment',
                    url: '/shop/lip-balm-treatments-lips-makeup'
                }
            ]
        };
    });

    describe('Rendering and Interaction', () => {
        beforeEach(() => {
            wrapper = mount(<TrendingSearch {...baseProps} />);
        });

        it('Should render trending list section', () => {
            expect(wrapper.find('li').first().text()).toBe(baseProps.section);
        });

        it('Should render trending icon in list item', () => {
            const imgSrc = wrapper.find('li').at(1).find('Image').prop('src');
            expect(imgSrc).toBe('/img/ufe/icons/trending.svg');
        });

        it('Should render li value', () => {
            const innerHTML = wrapper.find('li').at(1).find('span').prop('dangerouslySetInnerHTML');
            expect(innerHTML.__html).toBe('item value');
        });
    });

    describe('Null Render Conditions', () => {
        it('Should render null when inputRef is falsy', () => {
            const props = { ...baseProps, inputRef: { current: null } };
            const nullWrapper = mount(<TrendingSearch {...props} />);
            expect(nullWrapper.isEmptyRender()).toBe(true);
        });

        it('Should render null when trendingCategories is empty', () => {
            const props = { ...baseProps, trendingCategories: [] };
            const nullWrapper = mount(<TrendingSearch {...props} />);
            expect(nullWrapper.isEmptyRender()).toBe(true);
        });
    });
});
