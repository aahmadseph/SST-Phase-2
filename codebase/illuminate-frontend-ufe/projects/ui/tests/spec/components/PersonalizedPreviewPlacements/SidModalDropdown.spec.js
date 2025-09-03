import React from 'react';
import { shallow } from 'enzyme';
import SidModalDropdown from 'components/PersonalizedPreviewPlacements/SidModalDropdown/SidModalDropdown';

describe('SidModalDropdown component', () => {
    let shallowComponent;
    beforeEach(() => {
        shallowComponent = shallow(
            <SidModalDropdown
                p13n={{
                    sid: ['Angela Below The Nav Test', 'Banner_Smart_Skin_Scan_AA', 'global_persistentbanner1_promofinancial']
                }}
            />
        );
        shallowComponent.setState({
            shouldSeePreview: true
        });
    });

    it('should show SidModalDropdown container', () => {
        expect(shallowComponent.find('[data-at="sid-modal-dropdown"]').exists()).toBe(true);
        expect(shallowComponent.find('Text').at(0).prop('children')).toEqual('Personalized Placements');
    });

    it('should not render sid list initially', () => {
        shallowComponent.setState({
            showSidList: false
        });
        expect(shallowComponent.find('[data-at="sid-list"]').length).toEqual(0);
    });

    it('should render sid list when the user clicks on right arrow', () => {
        shallowComponent.setState({
            showSidList: true
        });
        expect(shallowComponent.find('[data-at="sid-list"]').length).toEqual(1);
    });

    it('should render list of sid links correctly', () => {
        shallowComponent.setState({
            showSidList: true
        });
        expect(shallowComponent.find('Link').length).toEqual(3);
    });
});
