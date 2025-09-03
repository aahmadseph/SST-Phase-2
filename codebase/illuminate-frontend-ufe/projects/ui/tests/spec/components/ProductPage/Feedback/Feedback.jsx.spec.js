/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const Feedback = require('components/ProductPage/Feedback/Feedback').default;

const bazaarVoice = require('services/api/thirdparty/BazaarVoice').default;

describe('<Feedback />', () => {
    const props = {
        positiveCount: 10,
        negativeCount: 20,
        onVote: () => {}
    };

    describe('Render', () => {
        it('should render helpfull text', () => {
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            expect(component.findWhere(x => x.key() === 'helpfullText').prop('children')).toBe('Helpful?');
        });

        it('should render helpfull number', () => {
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            expect(component.findWhere(x => x.key() === 'helpfulNumber').prop('children')).toBe(`(${props.positiveCount})`);
        });

        it('should render separator', () => {
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            expect(component.findWhere(x => x.key() === 'separator').prop('children')).toBe('|');
        });

        it('should not render unhelpfull number', () => {
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            expect(component.findWhere(x => x.key() === 'unhelpfulNumber').prop('children')).toBe(`(${props.negativeCount})`);
        });

        it('should render thanks in voted state', () => {
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            component.setState({ isVoted: true });

            expect(component.findWhere(x => x.key() === 'thanksText').prop('children')).toBe('Thanks for your feedback');
        });
    });

    describe('Can process clicks', () => {
        it('should call props.onVote() callback on Helpful button click with isPositive=true', () => {
            const onVoteSpy = spyOn(props, 'onVote');
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            component.findWhere(x => x.key() === 'helpfulLink').simulate('click');

            expect(onVoteSpy).toHaveBeenCalledWith(true);
        });

        it('should call props.onVote() callback on Unhelpful button click with isPositive=false', () => {
            const onVoteSpy = spyOn(props, 'onVote');
            const component = shallow(<Feedback {...props} />, { disableLifecycleMethods: true });

            component.findWhere(x => x.key() === 'unhelpfulLink').simulate('click');

            expect(onVoteSpy).toHaveBeenCalledWith(false);
        });
    });
});
