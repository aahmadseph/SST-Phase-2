import React from 'react';
import { shallow } from 'enzyme';
import VariationCarousel from 'components/PersonalizedPreviewPlacements/VariationCarousel/VariationCarousel';
import userUtils from 'utils/User';

describe('Variation Carousel component', () => {
    let shallowComponent;
    const props = {
        position: {
            top: 10,
            left: 10,
            height: 10
        },
        isRuleDetailBoxOpen: false,
        rule: {},
        variations: ['123', '456']
    };
    beforeEach(() => {
        shallowComponent = shallow(<VariationCarousel {...props} />);
    });

    it('should not render anything if isLoading is true', () => {
        shallowComponent.setState({
            isLoading: true
        });
        expect(shallowComponent.children().length).toBe(0);
    });

    it('should show numbered carousel when is loading is set to false', () => {
        shallowComponent.setState({
            isLoading: false
        });
        spyOn(userUtils, 'isAnonymous').and.returnValue(true);
        window.scrollX = 100;
        window.scrollY = 100;
        expect(shallowComponent.find('Pagination').length).toBe(1);
    });
});
