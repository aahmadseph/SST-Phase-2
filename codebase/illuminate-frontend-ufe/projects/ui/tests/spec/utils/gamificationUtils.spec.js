var gamificationUtils = require('utils/gamificationUtils').default;
import userUtils from 'utils/User';
describe('gamificationUtils', () => {
    describe('buildTierMigrateCustomModalStatus', () => {
        it('should be null when not logged in', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(true);
            expect(gamificationUtils.buildTierMigrateCustomModalStatus(false, 'status', null, null)).toEqual(null);
        });

        it('should be null when logged in but summary is null', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            expect(gamificationUtils.buildTierMigrateCustomModalStatus(false, 'status', null, null)).toEqual(null);
        });

        it('should be null when logged in but summary has no currentTier', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            const summary = {};
            expect(gamificationUtils.buildTierMigrateCustomModalStatus(false, 'status', null, summary)).toEqual(null);
        });

        it('should be null when logged in but summary has no nextTier', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            const summary = {
                currentTier: 'BI'
            };
            expect(gamificationUtils.buildTierMigrateCustomModalStatus(false, 'status', null, summary)).toEqual(null);
        });

        it('should be congrats when ROUGE', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            const summary = {
                currentTier: 'ROUGE',
                nextTier: 'ROUGE'
            };
            const localization = {
                congrats: 'congrats'
            };
            expect(gamificationUtils.buildTierMigrateCustomModalStatus(false, 'status', localization, summary)).toEqual(localization.congrats);
        });

        it('should be congrats when completed', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            const summary = {
                currentTier: 'BI',
                nextTier: 'VIB'
            };
            const localization = {
                congrats: 'congrats'
            };
            expect(gamificationUtils.buildTierMigrateCustomModalStatus(true, 'status', localization, summary)).toEqual(localization.congrats);
        });
    });
});
