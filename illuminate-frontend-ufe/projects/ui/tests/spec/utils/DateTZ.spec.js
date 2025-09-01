describe('DateTZ utils', () => {
    const DateTZ = require('utils/DateTZ').default;
    let DateTZObj;
    let timeZoneStub;
    let dateTimeStub;
    let updateOffsetStub;

    beforeEach(() => {
        timeZoneStub = 'GMT-5';
        dateTimeStub = new Date('August 3, 2018 11:24:00');
        updateOffsetStub = spyOn(DateTZ.prototype, 'updateOffset');
        DateTZObj = new DateTZ(dateTimeStub, timeZoneStub);
        DateTZObj._timeZoneTime = new Date('July 25, 2019 12:55:22.111');
        DateTZObj._utcOffset = -300; // GMT-5
    });

    describe('constructor', () => {
        it('should create a new DateTZ object', () => {
            expect(DateTZObj instanceof DateTZ).toEqual(true);
        });

        it('should call updateOffset', () => {
            expect(updateOffsetStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTime', () => {
        it('should get the correct timestamp from the timezone date', () => {
            const expectedTimeStamp = DateTZObj._timeZoneTime.getTime();
            expect(DateTZObj.getTime()).toEqual(expectedTimeStamp);
        });
    });

    describe('getFullYear', () => {
        it('should get the correct year from the timezone date', () => {
            const expectedYear = DateTZObj._timeZoneTime.getFullYear();
            expect(DateTZObj.getFullYear()).toEqual(expectedYear);
        });
    });

    describe('getMonth', () => {
        it('should get the correct month from the timezone date', () => {
            expect(DateTZObj.getMonth()).toEqual(6);
        });
    });

    describe('getDate', () => {
        it('should get the correct date from the timezone date', () => {
            expect(DateTZObj.getDate()).toEqual(25);
        });
    });

    describe('getDay', () => {
        it('should get the correct day from the timezone date', () => {
            expect(DateTZObj.getDay()).toEqual(4);
        });
    });

    describe('getHours', () => {
        it('should get the correct hours from the timezone date', () => {
            expect(DateTZObj.getHours()).toEqual(12);
        });
    });

    describe('getMinutes', () => {
        it('should get the correct minutes from the timezone date', () => {
            expect(DateTZObj.getMinutes()).toEqual(55);
        });
    });

    describe('getSeconds', () => {
        it('should get the correct seconds from the timezone date', () => {
            expect(DateTZObj.getSeconds()).toEqual(22);
        });
    });

    describe('getMilliseconds', () => {
        it('should get the correct milliseconds from the timezone date', () => {
            expect(DateTZObj.getMilliseconds()).toEqual(111);
        });
    });

    describe('setDate', () => {
        it('should set the correct date to timezone date', () => {
            DateTZObj.setDate(20);
            expect(DateTZObj._timeZoneTime.getDate()).toEqual(20);
        });
    });

    describe('setMonth', () => {
        it('should set the correct month to timezone date', () => {
            DateTZObj.setMonth(2);
            expect(DateTZObj._timeZoneTime.getMonth()).toEqual(2);
        });
    });

    describe('setFullYear', () => {
        it('should set the correct year to timezone date', () => {
            DateTZObj.setFullYear(2020);
            expect(DateTZObj._timeZoneTime.getFullYear()).toEqual(2020);
        });
    });

    describe('setHours', () => {
        it('should set the correct year to timezone date', () => {
            DateTZObj.setHours(15);
            expect(DateTZObj._timeZoneTime.getHours()).toEqual(15);
        });
    });

    describe('setMinutes', () => {
        it('should set the correct year to timezone date', () => {
            DateTZObj.setMinutes(10);
            expect(DateTZObj._timeZoneTime.getMinutes()).toEqual(10);
        });
    });

    describe('setSeconds', () => {
        it('should set the correct year to timezone date', () => {
            DateTZObj.setSeconds(33);
            expect(DateTZObj._timeZoneTime.getSeconds()).toEqual(33);
        });
    });

    describe('toDateString', () => {
        it('should get the correct date string of timezone date', () => {
            expect(DateTZObj.toDateString()).toEqual('Thu Jul 25 2019');
        });
    });

    describe('toISOString', () => {
        it('should get the correct ISO date string of timezone date', () => {
            const expectedString = '2019-07-25T17:55:22.111Z';
            expect(DateTZObj.toISOString()).toEqual(expectedString);
        });
    });

    describe('toString', () => {
        it('should get the correct ISO date string of timezone date', () => {
            const expectedString = 'Thu Jul 25 2019 12:55:22 GMT-0500';
            expect(DateTZObj.toString()).toEqual(expectedString);
        });
    });

    describe('updateOffset', () => {
        beforeEach(() => {
            DateTZObj._timeZone = 'PST8PDT';
            updateOffsetStub.and.callThrough();
        });

        it('should have correct timezone offset for standard time', () => {
            DateTZObj._localUserTime = new Date('January 3, 2018 12:24:00');
            DateTZObj._timeZoneTime = new Date('January 3, 2018 12:24:00');
            DateTZObj.updateOffset();
            const expectedOffset = -8;
            expect(DateTZObj._utcOffset).toEqual(expectedOffset * 60);
        });

        it('should have correct timezone offset for Daylight Saving Time', () => {
            DateTZObj._localUserTime = new Date('August 3, 2018 12:24:00');
            DateTZObj._timeZoneTime = new Date('August 3, 2018 12:24:00');
            DateTZObj.updateOffset();
            const expectedOffset = -7;
            expect(DateTZObj._utcOffset).toEqual(expectedOffset * 60);
        });

        it('should not offset the time if timezone is not provided', () => {
            DateTZObj._timeZone = null;
            DateTZObj._localUserTime = new Date('August 3, 2018 12:24:00');
            DateTZObj._timeZoneTime = new Date('August 3, 2018 12:24:00');
            DateTZObj.updateOffset();
            expect(DateTZObj._localUserTime).toEqual(DateTZObj._timeZoneTime);
        });
    });
});
