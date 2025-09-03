const ufeApi = require('services/api/ufeApi').default;
const notificationsAndReminders = require('services/api/profile/mailingPreferences/notificationsAndReminders').default;

describe('service getNotificationsAndRemindersPreferences', function () {
    let makeRequest;
    let userId;
    let url;

    beforeEach(() => {
        userId = 123456789;
        url = `/api/users/profiles/${userId}?propertiesToInclude=emailSubscriptionInfo`;
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(
            Promise.resolve({
                emailSubscriptionInfo: [
                    {
                        countryLocation: 'US',
                        subscriptionFrequency: 'DAILY',
                        subscriptionLanguage: 'EN',
                        subscriptionRegion: 'US',
                        subscriptionStatus: 'SUBSCRIBED',
                        subscriptionType: 'CONSUMER',
                        subscriptionZip: '94609'
                    },
                    {
                        countryLocation: 'US',
                        subscriptionFrequency: 'ANNUAL',
                        subscriptionLanguage: 'EN',
                        subscriptionRegion: 'US',
                        subscriptionStatus: 'SUBSCRIBED',
                        subscriptionType: 'MAIL'
                    },
                    {
                        countryLocation: 'US',
                        subscriptionFrequency: 'DAILY',
                        subscriptionLanguage: 'EN',
                        subscriptionRegion: 'US',
                        subscriptionStatus: 'SUBSCRIBED',
                        subscriptionType: 'TRIGGERED'
                    }
                ]
            })
        );
    });

    it('should send a request to the API endpoint', () => {
        notificationsAndReminders.getNotificationsAndRemindersPreferences(userId);
        expect(makeRequest.calls.first().args).toEqual([url, { method: 'GET' }]);
    });
});
