import React from 'react';
import { shallow } from 'enzyme';
import ProfileAttributes from 'components/ProfileAttributes/ProfileAttributes.es6';

describe('ProfileAttributes component', () => {
    let shallowComponent;
    beforeEach(() => {
        shallowComponent = shallow(
            <ProfileAttributes
                isModal={true}
                handlePreviewWithProfileAttr={() => {}}
            />
        );
    });

    it('should render profileAttributes container', () => {
        expect(shallowComponent.find('[data-at="profile-attribute-container"]').length).toEqual(1);
        expect(shallowComponent.find('Text').at(0).prop('children')).toEqual('Preview with Profile Attributes');
        expect(shallowComponent.find('InputSwitch').length).toBe(1);
    });
    it('should render iframe container', () => {
        shallowComponent.setState({
            showIframe: true
        });
        expect(shallowComponent.find('iframe').length).toEqual(1);
        expect(shallowComponent.find('iframe').exists()).toBe(true);
    });
});
