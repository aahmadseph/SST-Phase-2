import React from 'react';
import { shallow } from 'enzyme';
import Hair from 'components/RichProfile/EditMyProfile/Content/Hair/Hair';

describe('<Hair />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Hair
                biAccount={{
                    personalizedInformation: {
                        hairConcerns: [],
                        hairColor: [],
                        hairDescrible: []
                    }
                }}
            />
        );
    });

    it('should render without crashing', () => {
        expect(wrapper).not.toBeNull();
    });
});
