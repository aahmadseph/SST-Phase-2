import {
    getPreferences,
    fetchPromotionalEmailPreferences,
    fetchNotificationsAndRemindersPreferences,
    fetchPostalMailPreferences
} from 'services/api/profile/mailingPreferences/common/getPreferences';
import ufeApi from 'services/api/ufeApi';
import constants from 'services/api/profile/constants';

const { EmailSubscriptionTypes, SubscriptionStatus } = constants;

describe('Preferences', () => {
    describe('getPreferences', () => {
        it('should call the correct API endpoint', async () => {
            spyOn(ufeApi, 'makeRequest').and.returnValue(Promise.resolve({}));
            await getPreferences('testId', 'testParams', data => data);
            expect(ufeApi.makeRequest).toHaveBeenCalledWith('/api/users/profiles/testId?testParams', { method: 'GET' });
        });
    });

    describe('fetchPromotionalEmailPreferences', () => {
        it('should return the correct preferences', () => {
            const data = {
                emailSubscriptionInfo: [
                    {
                        subscriptionType: EmailSubscriptionTypes.CONSUMER,
                        subscriptionStatus: SubscriptionStatus.SUBSCRIBED,
                        subscriptionFrequency: 'WEEKLY',
                        countryLocation: 'US',
                        subscriptionZip: '12345'
                    }
                ]
            };
            const result = fetchPromotionalEmailPreferences(data);
            expect(result).toEqual({
                subscribed: true,
                frequency: 'WEEKLY',
                country: 'US',
                zipPostalCode: '12345'
            });
        });
    });

    describe('fetchNotificationsAndRemindersPreferences', () => {
        it('should return the correct preferences', () => {
            const data = {
                emailSubscriptionInfo: [
                    {
                        subscriptionType: EmailSubscriptionTypes.TRIGGERED,
                        subscriptionStatus: SubscriptionStatus.SUBSCRIBED
                    }
                ]
            };
            const result = fetchNotificationsAndRemindersPreferences(data);
            expect(result).toEqual({
                subscribed: true
            });
        });
    });

    describe('fetchPostalMailPreferences', () => {
        it('should return the correct preferences when catalogAddress is not present', () => {
            const data = {
                emailSubscriptionInfo: [
                    {
                        subscriptionType: EmailSubscriptionTypes.MAIL,
                        subscriptionStatus: SubscriptionStatus.SUBSCRIBED
                    }
                ]
            };
            const result = fetchPostalMailPreferences(data);
            expect(result).toEqual({
                subscribed: true,
                address: {}
            });
        });

        it('should return the correct preferences when catalogAddress is present', () => {
            const data = {
                catalogAddress: {
                    firstName: 'John',
                    lastName: 'Doe',
                    country: 'US',
                    city: 'New York',
                    state: 'NY',
                    address1: '123 Main St',
                    address2: 'Apt 4B',
                    postalCode: '10001'
                },
                emailSubscriptionInfo: [
                    {
                        subscriptionType: EmailSubscriptionTypes.MAIL,
                        subscriptionStatus: SubscriptionStatus.SUBSCRIBED
                    }
                ]
            };
            const result = fetchPostalMailPreferences(data);
            expect(result).toEqual({
                subscribed: true,
                address: {
                    firstName: 'John',
                    lastName: 'Doe',
                    country: 'US',
                    city: 'New York',
                    state: 'NY',
                    address1: '123 Main St',
                    address2: 'Apt 4B',
                    postalCode: '10001'
                }
            });
        });
    });
});
