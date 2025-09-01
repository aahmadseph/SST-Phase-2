const LocaleUtils = require('utils/LanguageLocale').default;

describe('ColorIQ', () => {
    const React = require('react');
    const ColorIQ = require('components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ').default;

    // eslint-disable-next-line no-unused-vars
    const biAccount = {
        skinTones: [
            {
                creationDate: '09/17/2018',
                cssColor: '#B6907C',
                shadeCode: '1Y07',
                storeName: '',
                labValue: '60.372:14.025:25.056'
            },
            {
                creationDate: '09/17/2018',
                cssColor: '#BF9C8A',
                shadeCode: '1Y05',
                storeName: '',
                labValue: '60.372:14.025:25.056'
            },
            {
                creationDate: '09/17/2018',
                cssColor: '#A87E65',
                shadeCode: '1Y09',
                storeName: '',
                labValue: '60.372:14.025:25.056'
            },
            {
                creationDate: '09/17/2018',
                cssColor: '#B3876E',
                shadeCode: '1Y08',
                storeName: '',
                labValue: '60.372:14.025:25.056'
            },
            {
                creationDate: '09/17/2018',
                cssColor: '#C2A292',
                shadeCode: '1Y04',
                storeName: '',
                labValue: '60.372:14.025:25.056'
            }
        ]
    };

    describe('No LAB colorIQ saved in profile', () => {
        let shallowComponentEmpty;
        beforeEach(() => {
            spyOn(LocaleUtils, 'isFrench').and.returnValue(false);
            shallowComponentEmpty = enzyme.mount(<ColorIQ biAccount={undefined} />);
            shallowComponentEmpty.state = {
                show: false,
                noLABCodeInProfile: true
            };
        });

        it('should render multi-product shade finder link', () => {
            const cmp = shallowComponentEmpty.find('div').at(0);
            expect(cmp.find('[href="/beauty/makeup-color-match/"]')).toBeDefined();
        });

        it('should render Or', () => {
            const cmp = shallowComponentEmpty.find('div').at(0);
            expect(cmp.find('p').at(1).props().children).toBe('Or');
        });

        it('should render /happening/home link', () => {
            const cmp = shallowComponentEmpty.find('div').at(0);
            expect(cmp.find('[href="/happening/home"]')).toBeDefined();
        });
    });
});
