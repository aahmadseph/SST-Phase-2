describe('Order Confirmation My Beauty Bank Render', function () {
    const React = require('react');
    const { shallow } = require('enzyme');

    let propsStub;
    let MyBeautyBank;
    let wrapper;

    beforeEach(() => {
        MyBeautyBank = require('components/OrderConfirmation/BeautyInsiderSection/MyBeautyBank/MyBeautyBank').default;
    });

    describe('when the earned/redeemed points are available', () => {
        beforeEach(() => {
            propsStub = {
                previousBalance: 10,
                earnedPoints: 20,
                redeemedPoints: 5
            };

            wrapper = shallow(<MyBeautyBank {...propsStub} />);
        });

        it('should have data-at property for the beauty bank section', () => {
            const dataAt = wrapper.findWhere(
                n => n.name() === 'Box' && n.prop('data-at') === `${Sephora.debug.dataAt('bi_points_activity_section')}`
            );
            expect(dataAt.length).toEqual(1);
        });

        it('should have data-at property for the beauty bank section title', () => {
            const dataAt = wrapper.findWhere(n => n.name() === 'Text' && n.prop('data-at') === `${Sephora.debug.dataAt('bi_points_activity_label')}`);
            expect(dataAt.length).toEqual(1);
        });

        it('should render the title of section', () => {
            const title = wrapper.childAt(0);
            expect(title.prop('children')).toEqual('Beauty Insider Points Activity');
        });

        using(
            'BI Information',
            [
                {
                    label: 'Points Earned',
                    value: '+20'
                },
                {
                    label: 'Points Used',
                    value: '-5'
                }
            ],
            config => {
                it('should render the value of ' + config.label, () => {
                    const value = wrapper.find('span[children="' + config.label + '"] + span').at(0);
                    expect(enzyme.getText(value)).toEqual(config.value);
                });
            }
        );
    });

    describe('when the earned/used points are zero', () => {
        it('should not render earned points if equal or less than 0', () => {
            propsStub = {
                earnedPoints: 0,
                redeemedPoints: 5
            };
            wrapper = shallow(<MyBeautyBank {...propsStub} />);
            expect(wrapper.find('span[children="Points Earned"]').length).toBe(0);
        });

        it('should not render used points if equal or less than 0', () => {
            propsStub = {
                earnedPoints: 5,
                redeemedPoints: 0
            };
            wrapper = shallow(<MyBeautyBank {...propsStub} />);
            expect(wrapper.find('span[children="Points Used"]').length).toBe(0);
        });
    });
});
