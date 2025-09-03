const { clock } = jasmine;

describe('ExperienceDetails', () => {
    let ExperienceDetails;
    let storeUtils;

    beforeEach(() => {
        ExperienceDetails = require('utils/ExperienceDetails').default;
        storeUtils = require('utils/Store').default;
    });

    describe('getAllExperiencesWithFilters', () => {
        it('should call getStores', () => {
            const fakePromise = {
                then: () => fakePromise,
                catch: () => {}
            };
            const locationObj = {};
            const getStoresSpy = spyOn(storeUtils, 'getStores').and.returnValue(fakePromise);
            ExperienceDetails.getAllExperiencesWithFilters(locationObj);
            expect(getStoresSpy).toHaveBeenCalledWith(locationObj, true, true, true);
        });
    });

    describe('formatAPIDateTime', () => {
        let formattedTime;
        let dateToFormat;
        let timeZone;
        let isSameDayStub;
        let dateUtils;

        beforeEach(() => {
            dateUtils = require('utils/Date').default;
            isSameDayStub = spyOn(dateUtils, 'isSameDay');
            timeZone = 'GMT-5';
            dateToFormat = '2018-08-03T08:24:00Z';
            formattedTime = '2018-08-03T05:00:00Z'; //offset +5

            clock().install();
        });

        afterEach(() => {
            clock().uninstall();
        });

        it('should return correctly formatted date string', () => {
            expect(ExperienceDetails.formatAPIDateTime(dateToFormat, timeZone)).toEqual(formattedTime);
        });

        it('should make start date the current store time + 2 hrs for same day calls', () => {
            // Arrange
            isSameDayStub.and.returnValue(true);
            clock().mockDate(new Date(1533298260000)); // fake today as 2018-08-03T12:11:00Z (GMT) / 7:11am store time (GMT-5)
            const expectedDateTime = '2018-08-03T14:11:00Z'; // current date time + 2 hrs / 9:11am store Time (GMT-5)

            // Act
            const result = ExperienceDetails.formatAPIDateTime(dateToFormat, timeZone);

            // Assert
            expect(result).toEqual(expectedDateTime);
        });

        it('should make start date the current store time if it is later than 9pm for same day calls', () => {
            // Arrange
            isSameDayStub.and.returnValue(true);
            clock().mockDate(new Date(1533351900000)); // fake today as 2018-08-04T03:05:00Z (GMT) / 10:05pm store time (GMT-5)
            const expectedDateTime = '2018-08-04T03:05:00Z';

            // Act
            const result = ExperienceDetails.formatAPIDateTime(dateToFormat, timeZone);

            // Assert
            expect(result).toEqual(expectedDateTime);
        });

        it('should make end date the last second of the day', () => {
            const expectedDateTime = '2018-08-04T04:59:59Z';
            expect(ExperienceDetails.formatAPIDateTime(dateToFormat, timeZone, true)).toEqual(expectedDateTime);
        });
    });

    describe('getFullDateStoreTimeFormat', () => {
        let formattedTime;
        let dateToFormat;
        let timeZone;
        let DateUtils;
        let isSameDayStub;

        beforeEach(() => {
            DateUtils = require('utils/Date').default;
            isSameDayStub = spyOn(DateUtils, 'isSameDay').and.returnValue(false);
            timeZone = 'GMT-5';
            dateToFormat = '2018-07-27T16:24:00Z';
            formattedTime = 'Fri, Jul 27, 11:24 AM';
        });

        it('should return correctly formatted date string', () => {
            expect(ExperienceDetails.getFullDateStoreTimeFormat(dateToFormat, timeZone)).toEqual(formattedTime);
        });

        it('should return correctly formatted date string for today', () => {
            isSameDayStub.and.returnValue(true);

            const fullDateStoreTime = ExperienceDetails.getFullDateStoreTimeFormat(dateToFormat, timeZone);

            expect(fullDateStoreTime).toEqual('Today, 11:24 AM');
        });

        it('should return correctly formatted date string for tomorrow', () => {
            isSameDayStub.and.returnValues(false, true);

            const fullDateStoreTime = ExperienceDetails.getFullDateStoreTimeFormat(dateToFormat, timeZone);

            expect(fullDateStoreTime).toEqual('Tomorrow, 11:24 AM');
        });

        describe('with duration', () => {
            let duration;

            beforeEach(() => {
                duration = '90';
                formattedTime = 'Fri, Jul 27, 11:24 AM - 12:54 PM';
            });

            it('should return correctly formatted date string', () => {
                expect(ExperienceDetails.getFullDateStoreTimeFormat(dateToFormat, timeZone, duration)).toEqual(formattedTime);
            });

            it('should return correctly formatted date string for today', () => {
                isSameDayStub.and.returnValue(true);

                const fullDateStoreTime = ExperienceDetails.getFullDateStoreTimeFormat(dateToFormat, timeZone, duration);

                expect(fullDateStoreTime).toEqual('Today, 11:24 AM - 12:54 PM');
            });

            it('should return correctly formatted date string for tomorrow', () => {
                isSameDayStub.and.returnValues(false, true);

                const fullDateStoreTime = ExperienceDetails.getFullDateStoreTimeFormat(dateToFormat, timeZone, duration);

                expect(fullDateStoreTime).toEqual('Tomorrow, 11:24 AM - 12:54 PM');
            });
        });
    });

    describe('getAMPMFormat', () => {
        it('should format time correctly for the morning', () => {
            const dateToFormat = new Date('July 27, 2018 09:24:00');
            const expectedTime = '9:24 AM';
            expect(ExperienceDetails.getAMPMFormat(dateToFormat)).toEqual(expectedTime);
        });

        it('should format time correctly for noon', () => {
            const dateToFormat = new Date('July 27, 2018 12:24:00');
            const expectedTime = '12:24 PM';
            expect(ExperienceDetails.getAMPMFormat(dateToFormat)).toEqual(expectedTime);
        });

        it('should format time correctly for the afternoon', () => {
            const dateToFormat = new Date('July 27, 2018 18:24:00');
            const expectedTime = '6:24 PM';
            expect(ExperienceDetails.getAMPMFormat(dateToFormat)).toEqual(expectedTime);
        });

        it('should format time correctly for midnight', () => {
            const dateToFormat = new Date('July 27, 2018 00:24:00');
            const expectedTime = '12:24 AM';
            expect(ExperienceDetails.getAMPMFormat(dateToFormat)).toEqual(expectedTime);
        });
    });

    describe('handleDateFormats', () => {
        let timeZone;
        let dateToFormat;
        describe('receiving Date JS date time', () => {
            beforeEach(() => {
                timeZone = 'GMT-7';
                dateToFormat = new Date('July 27, 2018 18:24:00');
            });

            it('should not offset the date', () => {
                const expectedDate = 'Fri Jul 27 2018';
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone).toDateString()).toEqual(expectedDate);
            });

            it('should not offset the time', () => {
                const expectedTime = '18:24';
                const actualDateTime = ExperienceDetails.handleDateFormats(dateToFormat, timeZone);
                expect(`${actualDateTime.getHours()}:${actualDateTime.getMinutes()}`).toEqual(expectedTime);
            });

            it('should have the correct time zone', () => {
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone)._timeZone).toEqual(timeZone);
            });
        });

        describe('receiving DateTZ date time', () => {
            let DateTZ;
            let newTimeZone;
            beforeEach(() => {
                DateTZ = require('utils/DateTZ').default;
                timeZone = 'GMT-7';
                newTimeZone = 'GMT-5';
                const dateTime = new Date('July 27, 2018 18:24:00');
                dateToFormat = new DateTZ(dateTime, timeZone);
                dateToFormat.setDateTime(dateTime);
            });

            it('should not offset the date', () => {
                const expectedDate = 'Fri Jul 27 2018';
                const actualDateString = ExperienceDetails.handleDateFormats(dateToFormat, newTimeZone).toDateString();
                expect(actualDateString).toEqual(expectedDate);
            });

            it('should not offset the time', () => {
                const expectedTime = '18:24';
                const actualTime = ExperienceDetails.handleDateFormats(dateToFormat, newTimeZone);
                expect(`${actualTime.getHours()}:${actualTime.getMinutes()}`).toEqual(expectedTime);
            });

            it('should have the correct time zone', () => {
                expect(ExperienceDetails.handleDateFormats(dateToFormat, newTimeZone)._timeZone).toEqual(newTimeZone);
            });
        });

        describe('receiving ISO Date format date time', () => {
            beforeEach(() => {
                timeZone = 'GMT-7';
                dateToFormat = '2018-07-27T18:24:00Z';
            });

            it('should offset the date if time zone offset is on next day', () => {
                dateToFormat = '2018-07-28T01:24:00Z';
                const expectedDate = 'Fri Jul 27 2018';
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone).toDateString()).toEqual(expectedDate);
            });

            it('should not offset the date if time zone offset is on same day', () => {
                const expectedDate = 'Fri Jul 27 2018';
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone).toDateString()).toEqual(expectedDate);
            });

            it('should offset the time', () => {
                const expectedTime = '11:24';
                const actualDateTime = ExperienceDetails.handleDateFormats(dateToFormat, timeZone);
                expect(`${actualDateTime.getHours()}:${actualDateTime.getMinutes()}`).toEqual(expectedTime);
            });

            it('should have the correct time zone', () => {
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone)._timeZone).toEqual(timeZone);
            });
        });

        describe('receiving ISO Date format without time', () => {
            beforeEach(() => {
                timeZone = 'GMT-7';
                dateToFormat = '2018-07-27';
            });

            it('should not offset the date', () => {
                const expectedDate = 'Fri Jul 27 2018';
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone).toDateString()).toEqual(expectedDate);
            });

            it('should have the time reset', () => {
                const expectedHr = '0';
                const actualDateTime = ExperienceDetails.handleDateFormats(dateToFormat, timeZone);
                expect(`${actualDateTime.getHours()}`).toEqual(expectedHr);
            });

            it('should have the correct time zone', () => {
                expect(ExperienceDetails.handleDateFormats(dateToFormat, timeZone)._timeZone).toEqual(timeZone);
            });
        });
    });

    describe('getStartDateFromParam', () => {
        let dateUtils;
        let urlUtils;
        let getParamsByNameStub;
        let isISODateStub;
        let getDateObjectFromStringStub;
        let addDaysStub;
        let isDayBetweenStub;
        let isSameDayStub;
        let startDateParam = '2018-10-12T00:00:00.000Z';

        beforeEach(() => {
            dateUtils = require('utils/Date').default;
            urlUtils = require('utils/Url').default;
            getParamsByNameStub = spyOn(urlUtils, 'getParamsByName');
            getParamsByNameStub.and.returnValue([startDateParam]);
            getDateObjectFromStringStub = spyOn(dateUtils, 'getDateObjectFromString');
            getDateObjectFromStringStub.and.returnValue('date_obj');
            addDaysStub = spyOn(dateUtils, 'addDays').and.returnValue('lastAvailableDay');
            isDayBetweenStub = spyOn(dateUtils, 'isDayBetween').and.returnValue(true);
            isSameDayStub = spyOn(dateUtils, 'isSameDay').and.returnValue(false);
            isISODateStub = spyOn(dateUtils, 'isISODate');
        });

        it('should call getParamsByName', () => {
            ExperienceDetails.getStartDateFromParam();
            expect(getParamsByNameStub).toHaveBeenCalledTimes(1);
        });

        it('should return null if param is missing', () => {
            getParamsByNameStub.and.returnValue(null);
            expect(ExperienceDetails.getStartDateFromParam()).toEqual(null);
        });

        describe('with ISO date', () => {
            beforeEach(() => {
                isISODateStub.and.callFake((_func, flag) => !flag);
            });

            it('should return the ISO date if correct', () => {
                const result = ExperienceDetails.getStartDateFromParam();
                expect(result).toEqual(startDateParam);
            });

            it('should call addDays', () => {
                ExperienceDetails.getStartDateFromParam();
                expect(addDaysStub).toHaveBeenCalledTimes(2);
            });

            it('should call isDayBetween', () => {
                ExperienceDetails.getStartDateFromParam();
                expect(isDayBetweenStub).toHaveBeenCalledTimes(1);
            });

            it('should call isSameDay', () => {
                isDayBetweenStub.and.returnValue(false); // to fire isDayBetween || isSameDay
                ExperienceDetails.getStartDateFromParam();
                expect(isSameDayStub).toHaveBeenCalledTimes(2); // to check for today and yesterday
            });

            it('should not call getDateObjectFromString', () => {
                expect(getDateObjectFromStringStub).not.toHaveBeenCalled();
            });

            it('should return null if param date is out of range', () => {
                isDayBetweenStub.and.returnValue(false);
                expect(ExperienceDetails.getStartDateFromParam()).toEqual(null);
            });
        });

        describe('with YYYY-MM-DD date format', () => {
            beforeEach(() => {
                startDateParam = '2018-10-12';
                getParamsByNameStub.and.returnValue([startDateParam]);
                isISODateStub.and.returnValue(false).and.callFake((_func, flag) => (flag === true ? true : undefined));
            });

            it('should call getDateObjectFromString', () => {
                ExperienceDetails.getStartDateFromParam();
                expect(getDateObjectFromStringStub).toHaveBeenCalledTimes(1);
            });

            it('should return param string if correct', () => {
                expect(ExperienceDetails.getStartDateFromParam()).toEqual(startDateParam);
            });
        });
    });
});
