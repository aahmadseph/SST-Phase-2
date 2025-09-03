describe('Constructor Recs utils', () => {
    const constructorRecsUtils = require('utils/ConstructorRecs').default;

    describe('convertToBoolean', () => {
        it('should return true if the param is string and is "true"', () => {
            expect(constructorRecsUtils.convertToBoolean('true')).toBeTruthy();
        });

        it('should return true if the param is string and is "True"', () => {
            expect(constructorRecsUtils.convertToBoolean('True')).toBeTruthy();
        });

        it('should return true if the param is boolean and is true', () => {
            expect(constructorRecsUtils.convertToBoolean(true)).toBeTruthy();
        });

        it('should return true if the param is boolean and is false', () => {
            expect(constructorRecsUtils.convertToBoolean(false)).toBeFalsy();
        });

        it('should return false if the param is string and "false"', () => {
            expect(constructorRecsUtils.convertToBoolean('false')).toBeFalsy();
        });

        it('should return false if the param is string and "False"', () => {
            expect(constructorRecsUtils.convertToBoolean('False')).toBeFalsy();
        });

        it('should return false if the param is string and "T"', () => {
            expect(constructorRecsUtils.convertToBoolean('T')).toBeFalsy();
        });

        it('should return false if the param is null', () => {
            expect(constructorRecsUtils.convertToBoolean(null)).toBeFalsy();
        });

        it('should return false if the param is undefined', () => {
            expect(constructorRecsUtils.convertToBoolean(undefined)).toBeFalsy();
        });

        it('should return false if the param is number', () => {
            expect(constructorRecsUtils.convertToBoolean(1)).toBeFalsy();
        });

        it('should return false if the param is any string', () => {
            expect(constructorRecsUtils.convertToBoolean('abc')).toBeFalsy();
        });
    });
});
