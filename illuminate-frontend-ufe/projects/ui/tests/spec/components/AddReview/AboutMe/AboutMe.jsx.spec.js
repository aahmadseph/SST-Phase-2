xdescribe('AboutMe Component JSX', () => {
    let shallowComponent;
    let React;
    let AboutMe;
    let props;

    beforeEach(() => {
        React = require('react');
        AboutMe = require('components/AddReview/AboutMe/AboutMe').default;
    });

    describe('render without props', () => {
        beforeEach(() => {
            shallowComponent = enzyme.shallow(<AboutMe />);
        });

        it('should display container', () => {
            expect(shallowComponent.exists('LegacyContainer')).toBeTruthy();
        });

        it('should display AddReviewTitle', () => {
            expect(shallowComponent.exists('AddReviewTitle')).toBeTruthy();
        });

        it('should display Text', () => {
            expect(shallowComponent.exists('Text')).toBeTruthy();
        });

        it('should display div', () => {
            expect(shallowComponent.exists('div')).toBeTruthy();
        });

        it('should display AddReviewNote', () => {
            expect(shallowComponent.exists('AddReviewNote')).toBeTruthy();
        });

        it('should display Button', () => {
            expect(shallowComponent.exists('Button')).toBeTruthy();
        });
    });

    describe('render with skin values', () => {
        beforeEach(() => {
            props = {
                aboutMeBiTraits: {
                    skinType: 'someSkinType',
                    skinTone: 'someSkinTone',
                    skinConcerns: 'someSkinConcerns'
                }
            };
            shallowComponent = enzyme.shallow(<AboutMe {...props} />);
        });

        it('should display Skin', () => {
            expect(shallowComponent.exists('Skin')).toBeTruthy();
        });
    });

    describe('render with hair values', () => {
        beforeEach(() => {
            props = {
                aboutMeBiTraits: {
                    hairColor: 'someHairColor',
                    hairDescribe: 'someHairDescribe',
                    hairConcerns: 'someHairConcerns'
                }
            };
            shallowComponent = enzyme.shallow(<AboutMe {...props} />);
        });

        it('should display Skin', () => {
            expect(shallowComponent.exists('Hair')).toBeTruthy();
        });
    });

    describe('render with eye values', () => {
        beforeEach(() => {
            props = { aboutMeBiTraits: { eyeColor: 'someEyeColor' } };
            shallowComponent = enzyme.shallow(<AboutMe {...props} />);
        });

        it('should display Skin', () => {
            expect(shallowComponent.exists('Eyes')).toBeTruthy();
        });
    });
});
