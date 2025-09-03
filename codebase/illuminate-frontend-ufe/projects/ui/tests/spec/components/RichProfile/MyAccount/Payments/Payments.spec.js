/* eslint-disable no-unused-vars */
const React = require('react');
const { PaymentsComponent } = require('components/RichProfile/MyAccount/Payments/Payments.ctrlr');

describe('My Account Payment section', () => {
    let Payments;
    let component;
    let profileApi;
    let userMockData;
    let paymentsMockData;
    let expectedState;
    let fakePromise;
    let wrapper;

    const renderComp = (isMount = false) => {
        wrapper = enzyme[isMount ? 'mount' : 'shallow'](<Payments />);
        component = wrapper.instance();
    };

    beforeEach(() => {
        Payments = PaymentsComponent;
        profileApi = require('services/api/profile').default;

        userMockData = {
            profileId: '20002360076',
            storeCredits: [
                {
                    amount: '$22.07',
                    expirationDate: '2020-02-27 00:00:00.0'
                },
                {
                    amount: '$30.00',
                    expirationDate: '2020-03-06 00:00:00.0'
                },
                {
                    amount: '$100.00',
                    expirationDate: null
                }
            ],
            subscriptionPrograms: { flash: { isActive: false } }
        };

        paymentsMockData = {
            creditCards: [
                {
                    cardNumber: 'xxxx-xxxx-xxxx-1111',
                    cardType: 'VISA',
                    creditCardId: 'usercc9005120009',
                    expirationMonth: '12',
                    expirationYear: '2021',
                    firstName: 'vj',
                    isDefault: true,
                    isExpired: false,
                    lastName: 'qa4'
                }
            ]
        };

        expectedState = {
            creditCards: paymentsMockData.creditCards,
            paypal: undefined,
            storeCredits: userMockData.storeCredits,
            defaultPayment: 'afterpay'
        };
    });

    xdescribe('ensureUserIsSignedIn', () => {
        it('should set the comp isDecorated property to be true ', () => {
            renderComp();

            component.originalCtrlr(userMockData);
            expect(component.isDecorated).toBeTruthy();
        });
    });

    describe('storeCredits', () => {
        const storeCredits = [
            {
                amount: '$10.00',
                expirationDate: '2020-03-15 00:00:00.0'
            },
            {
                amount: '$20.00 CAD',
                expirationDate: null
            }
        ];

        const getStoreCreditsList = w => w.findWhere(n => n.prop('data-at') === 'ac_section');

        beforeEach(() => {
            renderComp(true);
            spyOn(component, 'isUserAuthenticated').and.returnValue(true);
            spyOn(component, 'isUserReady').and.returnValue(true);
        });
        /*
        it('should render store credits list if exists in state', () => {
            wrapper.setState({ storeCredits });
            wrapper.update();

            const texts = getStoreCreditsList(wrapper).find('Text[data-at="account_credit"]');

            for (let i = 0; i < storeCredits.length; i++) {
                const { amount } = storeCredits[i];
                expect(texts.at(i).text().indexOf(amount)).not.toEqual(-1);
            }
        });

        it('should render store credits amount if exists in state', () => {
            wrapper.setState({ storeCredits });
            wrapper.update();
            const firstAcWrapper = getStoreCreditsList(wrapper).find('Text[data-at="account_credit"]').at(0);
            expect(firstAcWrapper.exists('Text[data-at="ac_amount"]')).toBe(true);
        });

        it('should render store credits exp date if exists in state', () => {
            wrapper.setState({ storeCredits });
            wrapper.update();
            const firstAcWrapper = getStoreCreditsList(wrapper).find('Text[data-at="account_credit"]').at(0);
            expect(firstAcWrapper.exists('Text[data-at="ac_expires"]')).toBe(true);
        });
        */

        it('should not render store credits list if does not exist in state', () => {
            expect(getStoreCreditsList(wrapper).length).toEqual(0);
        });
    });
});
