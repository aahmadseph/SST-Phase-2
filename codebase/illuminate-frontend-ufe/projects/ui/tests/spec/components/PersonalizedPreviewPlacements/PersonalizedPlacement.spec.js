import React from 'react';
import { shallow } from 'enzyme';
import PersonalizedPlacement from 'components/PersonalizedPreviewPlacements/PersonalizedPlacement/PersonalizedPlacement';

describe('Personalized Placement component', () => {
    let shallowComponent;
    beforeEach(() => {
        shallowComponent = shallow(
            <PersonalizedPlacement
                setSidData={() => {}}
                isPersistentBanner={false}
                personalizedComponent={{
                    ruleId: '123',
                    startDate: '09/09/2024',
                    endDate: '10/09/2024'
                }}
                setPersonalizedVariations={() => {}}
            />
        );
    });

    it('should show Info Button Component', () => {
        expect(shallowComponent.find('InfoButton').length).toEqual(1);
    });

    it('should render Variation Carousel component when isVariationCarouselOpen is true', () => {
        shallowComponent.setState({
            isVariationCarouselOpen: true
        });
        expect(shallowComponent.find('VariationCarousel').length).toEqual(1);
    });

    it('should not render Variation Carousel component when isVariationCarouselOpen is false', () => {
        shallowComponent.setState({
            isVariationCarouselOpen: false
        });
        expect(shallowComponent.find('VariationCarousel').length).toEqual(0);
    });
});
