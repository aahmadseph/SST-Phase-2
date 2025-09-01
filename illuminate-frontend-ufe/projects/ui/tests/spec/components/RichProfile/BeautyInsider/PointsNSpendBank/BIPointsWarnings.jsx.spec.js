const React = require('react');
const { shallow } = require('enzyme');

describe('<BiPointsWarning /> component', () => {
    let BIPointsWarnings;
    let shallowComponent;

    beforeEach(() => {
        BIPointsWarnings = require('components/RichProfile/BeautyInsider/PointsNSpendBank/BIPointsWarnings').default;
        shallowComponent = shallow(<BIPointsWarnings> </BIPointsWarnings>);
    });

    it('should displays one text element', () => {
        expect(shallowComponent.find('Text').length).toEqual(1);
    });

    it('should displays correct informational message', () => {
        const informationText = 'See how what you spend translates into points, ' + 'view your reward redemptions, and more.';
        expect(shallowComponent.find('Text').at(0).prop('children')).toEqual(informationText);
    });

    describe('on desktop', () => {
        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            shallowComponent = shallow(<BIPointsWarnings> </BIPointsWarnings>);
        });

        it('should displays a bottom divider', () => {
            expect(shallowComponent.find('Divider').length).toEqual(1);
        });
    });

    describe('on mobile', () => {
        beforeEach(() => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            shallowComponent = shallow(<BIPointsWarnings> </BIPointsWarnings>);
        });

        it('should displays a divider after first text', () => {
            expect(shallowComponent.find('Divider').length).toEqual(1);
        });
    });

    describe('with no points and expired are true', () => {
        let textMessages;
        beforeEach(() => {
            shallowComponent = shallow(
                <BIPointsWarnings
                    noPoints={true}
                    expired={true}
                >
                    {' '}
                </BIPointsWarnings>
            );
            textMessages = shallowComponent.find('Text');
        });

        it('should displays information text', () => {
            expect(textMessages.length).toEqual(3);
        });

        it('should displays proper no points message ', () => {
            const noPointsMessage = 'You do not have any Beauty Insider activity to display.';
            const noPointsText = textMessages.at(1);
            expect(noPointsText.prop('children')).toEqual(noPointsMessage);
        });

        it('should displays proper expired message ', () => {
            const expiredMessage = 'Your points have expired.';
            const expiredText = textMessages.at(2).find('b');
            expect(expiredText.text()).toEqual(expiredMessage);
        });
    });
});
