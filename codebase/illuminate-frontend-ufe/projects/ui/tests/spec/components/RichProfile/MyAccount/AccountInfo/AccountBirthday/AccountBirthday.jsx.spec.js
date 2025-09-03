const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('<AccountBirthday /> component', () => {
    let AccountBirthday;
    let shallowedComponent;
    let setEditSectionSpy;

    beforeEach(() => {
        AccountBirthday = require('components/RichProfile/MyAccount/AccountInfo/AccountBirthday/AccountBirthday').default;
        setEditSectionSpy = createSpy();
    });

    describe('on display mode', () => {
        beforeEach(() => {
            shallowedComponent = shallow(
                <AccountBirthday
                    user={{
                        firstName: 'User',
                        lastName: 'Name',
                        beautyInsiderAccount: {
                            birthMonth: '05',
                            birthDay: '25'
                        }
                    }}
                    isEditMode={false}
                    setEditSection={setEditSectionSpy}
                />
            );
        });

        it('should display a LegacyGrid', () => {
            expect(shallowedComponent.find('LegacyGrid').length).toBe(1);
        });

        it('should display a LegacyGrid with data-at attribute', () => {
            expect(shallowedComponent.find('LegacyGrid[data-at="account_birthday_field"]').length).toBe(1);
        });

        it('should have birthday text rendered', () => {
            expect(shallowedComponent.find('LegacyGridCell').at(0).prop('children')).toBe('Birthday');
        });

        it('should have user birthday rendered', () => {
            const userBirthdayLegacyGridCell = shallowedComponent.find('LegacyGridCell').at(1);
            const birthdayText = userBirthdayLegacyGridCell.find('Text').at(0);
            expect(birthdayText.prop('children')).toEqual(['May', ' ', '25']);
        });
    });
});
