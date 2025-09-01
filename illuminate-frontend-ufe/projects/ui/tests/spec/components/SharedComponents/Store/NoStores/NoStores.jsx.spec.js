/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const anaUtils = require('analytics/utils').default;

describe('NoStores', () => {
    let shallowComponent;
    let NoStores;

    beforeEach(() => {
        NoStores = require('components/SharedComponents/Stores/NoStores/NoStores').default;
        shallowComponent = shallow(
            <NoStores
                countryMismatch={true}
                currentLocation={'US'}
            />
        );
    });

    describe('render', () => {
        it('should render text for user to change to Canada store if in US', () => {
            const localeUtils = require('utils/LanguageLocale').default;
            spyOn(localeUtils, 'isUS').and.returnValue(true);
            const canadaText = shallowComponent.find('Text').props().children[0];
            expect(canadaText).toEqual('In order to select a store in Canada, please go to the ');
        });
    });
});
