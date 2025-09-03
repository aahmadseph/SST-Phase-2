/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = enzyme;
const biApi = require('services/api/beautyInsider').default;
const BiInfoCard = require('components/RichProfile/BeautyInsider/BiInfoCard/BiInfoCard').default;
const userUtils = require('utils/User').default;

describe('BiInfoCard component', () => {
    const mockedUser = {
        profileId: 1,
        beautyInsiderAccount: { vibSegment: {} },
        firstName: 'John'
    };
    let wrapper;
    let component;

    describe('componentDidMount', () => {
        let setStateStub;

        beforeEach(() => {
            wrapper = shallow(<BiInfoCard user={mockedUser} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should set state with BI data retrieved', () => {
            const fakeBiPoints = {
                realTimeVIBMessages: ['Hello', 'World'],
                netBeautyBankPointsAvailable: 100
            };
            const fakeGetBankRewards = { a: 'b' };

            spyOn(userUtils, 'isBirthdayGiftEligible').and.returnValue(true);
            spyOn(userUtils, 'getBankRewards').and.returnValue(fakeGetBankRewards);
            spyOn(biApi, 'getBiPoints').and.returnValue({
                then: resolve => {
                    resolve(fakeBiPoints);
                }
            });

            component.componentDidMount();
            expect(setStateStub).toHaveBeenCalledWith({
                realTimeVIBMessages: fakeBiPoints.realTimeVIBMessages,
                netBeautyBankPointsAvailable: fakeBiPoints.netBeautyBankPointsAvailable,
                eligibleForBirthdayGift: true,
                bankRewards: fakeGetBankRewards
            });
        });

        it('should not call getBiPoints if BI is uanavailable', () => {
            wrapper = shallow(
                <BiInfoCard
                    user={mockedUser}
                    isBIPointsUnavailable={true}
                />,
                { disableLifecycleMethods: true }
            );
            const getBiPointsStub = spyOn(biApi, 'getBiPoints');
            component = wrapper.instance();
            component.componentDidMount();
            expect(getBiPointsStub).not.toHaveBeenCalled();
        });
    });

    describe('points multiplier', () => {
        const { COMPONENT_ID } = require('components/RichProfile/BeautyInsider/constants');
        const getLink = comp => comp.find('[href="#' + COMPONENT_ID.POINTS_MULTIPLIER + '"]');

        beforeEach(() => {
            spyOn(Sephora, 'isDesktop').and.returnValue(true);
            spyOn(Sephora, 'isMobile').and.returnValue(false);
        });

        describe('if PME is active', () => {
            beforeEach(() => {
                const biSummary = {
                    pointMultiplierOptions: {
                        pointMultiplierContentMsg: 'Use code **MOREPOINTS** as many times as you\'d like.',
                        pointMultiplierHeading: '**Event Details**',
                        promoApplied: false,
                        promoCode: 'morepoints',
                        promoEndDate: 'Thursday, December 31',
                        userLevelPointMultiplier: [
                            {
                                multiplier: '4X',
                                userType: 'Rouge'
                            },
                            {
                                multiplier: '3X',
                                userType: 'VIB'
                            },
                            {
                                multiplier: '2X',
                                userType: 'Insider'
                            }
                        ],
                        userMultiplier: {
                            multiplier: '4X',
                            userType: 'Rouge'
                        }
                    }
                };
                wrapper = shallow(
                    <BiInfoCard
                        user={mockedUser}
                        biSummary={biSummary}
                        isMinimal={false}
                    />,
                    { disableLifecycleMethods: true }
                );
            });

            it('should render points multiplier link', () => {
                const link = getLink(wrapper);
                expect(link.length).toEqual(1);
            });

            it('should render correct points multiplier text', () => {
                const link = getLink(wrapper);
                const textComp = link.find('[data-at="pme_msg"] Markdown');
                expect(textComp.prop('content')).toEqual('Point Multiplier Event: Earn *4X* points on your purchases');
            });
        });

        describe('if PME is not active', () => {
            beforeEach(() => {
                const biSummary = {};
                wrapper = shallow(
                    <BiInfoCard
                        user={mockedUser}
                        biSummary={biSummary}
                        isMinimal={false}
                    />,
                    { disableLifecycleMethods: true }
                );
            });

            it('should not render points multiplier link', () => {
                const link = getLink(wrapper);
                expect(link.length).toEqual(0);
            });
        });
    });
});
