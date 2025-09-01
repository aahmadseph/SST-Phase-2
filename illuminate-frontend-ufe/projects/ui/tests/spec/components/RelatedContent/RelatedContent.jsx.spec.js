/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const RelatedContent = require('components/RelatedContent').default;

describe('RelatedContent', () => {
    const props = {
        links: [
            {
                anchorText: 'Wellness + Skincare',
                url: 'https://www.sephora.com/shop/wellness-skincare'
            },
            {
                anchorText: 'Wrinkle Cream & Wrinkle Remover',
                url: 'https://www.sephora.com/shop/wrinkle-cream-wrinkle-remover'
            },
            {
                anchorText: 'Anti-Wrinkle Creams for Oily Skin',
                url: 'https://www.sephora.com/shop/wrinkle-cream-wrinkle-remover?ref=100069,100104'
            }
        ],
        hasDivider: false
    };
    let wrapper;

    describe('main tags', () => {
        beforeEach(() => {
            wrapper = shallow(<RelatedContent {...props} />);
        });

        it('should render the h2 tag', () => {
            const elem = wrapper.findWhere(n => n.prop('is') === 'h2');
            expect(elem.length).toEqual(1);
        });

        it('should render the h2 tag with correct text', () => {
            const elem = wrapper.findWhere(n => n.prop('is') === 'h2');
            expect(elem.props().children).toEqual('Related Content:');
        });

        it('should render the Link tag', () => {
            const elem = wrapper.findWhere(n => n.name() === 'Link');
            expect(elem.length).toEqual(3);
        });
    });

    describe('divider', () => {
        beforeEach(() => {
            props.hasDivider = true;
            wrapper = shallow(<RelatedContent {...props} />);
        });

        it('should render the Divider tag', () => {
            const elem = wrapper.findWhere(n => n.name() === 'Divider');
            expect(elem.length).toEqual(1);
        });
    });

    xdescribe('Link Render', () => {
        using('Links Data', props.links, config => {
            let elem;
            let navigateToSpy;
            const Location = require('utils/Location').default;

            beforeEach(() => {
                let newUrl = new URL(config.url);
                newUrl = newUrl.pathname + newUrl.search;
                wrapper = shallow(<RelatedContent {...props} />);
                elem = wrapper.find(`[href="${newUrl}"]`);
            });

            it('should show correct anchorText for ' + config.anchorText, () => {
                expect(elem.length).toEqual(1);
            });

            it('should call navigateTo method', () => {
                // splitURLSpy = spyOn(HistoryService, 'splitURL').and.returnValue('someValue');
                navigateToSpy = spyOn(Location, 'navigateTo');
                elem.simulate('click');
                expect(navigateToSpy).toHaveBeenCalled();
            });
        });
    });
});
