describe('configurations', function () {
    let reportingStates;

    beforeEach(() => {
        reportingStates = require('analytics/configurations').default.reportingStates;
    });

    describe('reportingStates', () => {
        const deprecatedDomains = [
            'm.sephora.com',
            'm-qa.sephora.com',
            'm-qa.illuminate.sephora.com',
            'm-qa.sephora.com',
            'm-qa.illuminate.sephora.com',
            'm.sephora.com'
        ];

        it('should not contain any references to the m. or m- deprecated domain', () => {
            const existingReferences = reportingStates.filter(state => state.HOSTS.some(host => deprecatedDomains.some(domain => domain === host)));
            expect(existingReferences.length).toEqual(0);
        });
    });
});
