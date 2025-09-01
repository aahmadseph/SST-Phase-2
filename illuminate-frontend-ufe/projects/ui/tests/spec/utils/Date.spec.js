const { clock } = jasmine;

describe('Date utils', () => {
    var dateUtils = require('utils/Date').default;

    // @TODO: This test may potentially fail if not run in PST
    // @ToDo: Find a fix for this and uncomment once fixed
    /*
    describe('getDayOfWeek', () => {
        it('gets the name of the day of the week', () => {
            let testDate = new Date('Wed Nov 16 2016');

            expect(dateUtils.getDayOfWeek(testDate)).toEqual('wednesday');
        });
    });
    */

    describe('getLocalDate', () => {
        it('gets client date and adjusts to PST in the format YYYY|MM|DD', () => {
            const testDate = new Date('Wed Nov 16 2016 11:24:26 GMT-0800 (PST)');

            expect(dateUtils.getLocalDate(testDate)).toEqual('2016|11|16');
        });
    });

    describe('getLongDate', () => {
        it('formats a JS date object in the format DD MM YYYY', () => {
            const testDate = new Date('01/30/2017');

            expect(dateUtils.getLongDate(testDate)).toEqual('30 Jan 2017');
        });
    });

    describe('isValidDateTime', () => {
        it('should return false if month is invalid', () => {
            expect(dateUtils.isValidDateTime('2020-13-14T23:38')).toBeFalsy();
        });
        it('should return false if day is invalid', () => {
            expect(dateUtils.isValidDateTime('2020-01-32T23:38')).toBeFalsy();
        });
        it('should return false if hour value is invalid', () => {
            expect(dateUtils.isValidDateTime('2020-01-14T24:38')).toBeFalsy();
        });
        it('should return false if minute value is invalid', () => {
            expect(dateUtils.isValidDateTime('2020-01-14T23:60')).toBeFalsy();
        });
        it('should return false if year is invalid', () => {
            expect(dateUtils.isValidDateTime('20200-01-14T23:38')).toBeFalsy();
        });
        it('should return true if the date time string is valid for AM', () => {
            expect(dateUtils.isValidDateTime('2020-01-14T03:38')).toBeTruthy();
        });
        it('should return true if the date time string is valid for PM', () => {
            expect(dateUtils.isValidDateTime('2020-01-14T23:38')).toBeTruthy();
        });
    });

    describe('generateCurrentDateTime', () => {
        beforeEach(() => {
            clock().install();
        });

        it('should properly format the date string for 0 Hours and 0 Minutes', () => {
            // Arrange
            clock().mockDate(new Date(1985, 3, 9, 0, 0, 0));

            // Act
            const dateTime = dateUtils.generateCurrentDateTime();

            // Assert
            expect(dateTime).toEqual('1985-04-09T00:00:00');
        });

        it('should properly format the date string for the very end of the day', () => {
            // Arrange
            clock().mockDate(new Date(1985, 3, 9, 23, 59, 0));

            // Act
            const dateTime = dateUtils.generateCurrentDateTime();

            // Assert
            expect(dateTime).toEqual('1985-04-09T23:59:00');
        });

        afterEach(() => {
            clock().uninstall();
        });
    });

    describe('addRemoveDays', () => {
        it('should add x # of days to date', () => {
            const addDays = true;
            const startDay = 1;
            const numberOfDays = 14;
            let testDate = new Date(`1/${startDay}/2017`);
            testDate = testDate.setHours(0, 0, 0, 0);
            const returnDate = new Date(testDate);
            returnDate.setDate(startDay + numberOfDays);
            returnDate.setHours(0, 0, 0, 0);
            expect(dateUtils.addRemoveDays(addDays, testDate, numberOfDays)).toEqual(returnDate);
        });

        it('should remove x # of days to date', () => {
            const addDays = false;
            const startDay = 1;
            const numberOfDays = 14;
            let testDate = new Date(`1/${startDay}/2017`);
            testDate = testDate.setHours(0, 0, 0, 0);
            const returnDate = new Date(testDate);
            returnDate.setDate(startDay - numberOfDays);
            returnDate.setHours(0, 0, 0, 0);
            expect(dateUtils.addRemoveDays(addDays, testDate, numberOfDays)).toEqual(returnDate);
        });
    });

    describe('formatDateMDY', () => {
        let iso8601DateString;

        beforeEach(() => {
            iso8601DateString = '2017-06-27T06:28:06.070-0700';
        });

        it('should return a Mon DD YYYY formatted string', () => {
            const expectedFormattedDate = 'Jun 27 2017';
            const formattedDate = dateUtils.formatDateMDY(iso8601DateString);
            expect(formattedDate).toEqual(expectedFormattedDate);
        });

        it('should return a Mon DD, YYYY formatted string', () => {
            const expectedFormattedDate = 'Jun 27, 2017';
            const formattedDate = dateUtils.formatDateMDY(iso8601DateString, true);
            expect(formattedDate).toEqual(expectedFormattedDate);
        });
    });

    describe('getEstimatedDeliveryString', () => {
        it('should return the correct date string from date', () => {
            // Arrange
            const SHORTENED_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            // 3/19/2018 - 3/20/2018
            const dateTime = 1521504000000;
            const fakeDate = new Date(dateTime);
            const day = fakeDate.getDate();
            const dayOfWeek = SHORTENED_DAYS[fakeDate.getDay()];
            const month = fakeDate.getMonth() + 1;
            const checkString = `${dayOfWeek} ${month}/${day}`;

            // Act
            const estimatedDeliveryString = dateUtils.getEstimatedDeliveryString(dateTime);

            // Assert
            expect(estimatedDeliveryString).toEqual(checkString);
        });
    });

    describe('clone()', () => {
        let date;
        let clonedDate;

        beforeEach(() => {
            date = new Date();
            clonedDate = dateUtils.clone(date);
        });

        it('should return the same date', () => {
            expect(clonedDate).toEqual(date);
        });

        it('should be a clone of the date', () => {
            date.setDate(date.getDate() + 10);
            expect(clonedDate).not.toEqual(date);
        });
    });

    describe('addMonths()', () => {
        it('should return the date with "n" months added', () => {
            const initialMonth = 2;
            const finalMonth = 7;
            const n = 5;
            const date = new Date(2018, initialMonth, 1);
            const expectedDate = dateUtils.addMonths(date, n);
            expect(expectedDate).toEqual(new Date(2018, finalMonth, 1));
        });

        it('should return the date with "n" months added even when the final month has less days than the initial month', () => {
            const initialMonth = 0;
            const finalMonth = 1;
            const n = 1;
            const date = new Date(2018, initialMonth, 31);
            const expectedDate = dateUtils.addMonths(date, n);
            expect(expectedDate).toEqual(new Date(2018, finalMonth, 28));
        });
    });

    describe('addDays()', () => {
        it('should return the date with "n" days added', () => {
            const initialDay = 2;
            const finalDay = 7;
            const n = 5;
            const date = new Date(2018, 0, initialDay);
            const expectedDate = dateUtils.addDays(date, n);
            expect(expectedDate).toEqual(new Date(2018, 0, finalDay));
        });
    });

    describe('getFirstDayOfMonth()', () => {
        it('should return the first day of month from a date', () => {
            const date = new Date(2018, 0, 20);
            const expectedDate = dateUtils.getFirstDayOfMonth(date);
            expect(expectedDate).toEqual(new Date(2018, 0, 1));
        });
    });

    describe('getDaysInMonth()', () => {
        it('should return the correct number of days for February', () => {
            expect(dateUtils.getDaysInMonth(2018, 1)).toEqual(28);
        });
        it('should return the correct number of days for February in a leap year', () => {
            expect(dateUtils.getDaysInMonth(2020, 1)).toEqual(29);
        });
        it('should return the correct number of days for November', () => {
            expect(dateUtils.getDaysInMonth(2018, 10)).toEqual(30);
        });
    });

    describe('isLeapYear()', () => {
        it('should return true for year 2020', () => {
            expect(dateUtils.isLeapYear(2020)).toEqual(true);
        });
        it('should return true for year 2024', () => {
            expect(dateUtils.isLeapYear(2024)).toEqual(true);
        });
        it('should return false for 2018', () => {
            expect(dateUtils.isLeapYear(2018)).toEqual(false);
        });
        it('should return false for 2021', () => {
            expect(dateUtils.isLeapYear(2021)).toEqual(false);
        });
    });

    describe('getWeekArray()', () => {
        let date;
        beforeEach(() => {
            date = new Date(2018, 0, 20);
        });

        it('should return the correct amount of weeks', () => {
            const numberOfWeeks = dateUtils.getWeekArray(date).length;
            expect(numberOfWeeks).toEqual(5);
        });

        it('should return the correct amount of days on a week', () => {
            const numberOfDays = dateUtils.getWeekArray(date)[0].length;
            expect(numberOfDays).toEqual(7);
        });

        it('should return the correct first day of the array correctly', () => {
            const numberOfDays = dateUtils.getWeekArray(date)[0][0];
            expect(numberOfDays).toEqual(new Date(2017, 11, 31));
        });

        it('should return the correct last day of the array correctly', () => {
            const numberOfDays = dateUtils.getWeekArray(date)[4][6];
            expect(numberOfDays).toEqual(new Date(2018, 1, 3));
        });
    });

    describe('getWeekNumberInMonth()', () => {
        it('should return the number of the week of the month the date belongs to', () => {
            const date = new Date(2018, 0, 20);
            const numberOfWeek = dateUtils.getWeekNumberInMonth(date);
            expect(numberOfWeek).toEqual(2);
        });
    });

    describe('isSameDay()', () => {
        it('should return true if the dates are the same', () => {
            const dateA = new Date(2018, 0, 20);
            const dateB = new Date(2018, 0, 20);
            expect(dateUtils.isSameDay(dateA, dateB)).toEqual(true);
        });

        it('should return false if the dates are not the same', () => {
            const dateA = new Date(2018, 0, 20);
            const dateB = new Date(2018, 0, 21);
            expect(dateUtils.isSameDay(dateA, dateB)).toEqual(false);
        });
    });

    describe('isSameMonth()', () => {
        it('should return true if the dates belong to the same month', () => {
            const dateA = new Date(2018, 0, 20);
            const dateB = new Date(2018, 0, 10);
            expect(dateUtils.isSameMonth(dateA, dateB)).toEqual(true);
        });

        it('should return false if the dates are from different months', () => {
            const dateA = new Date(2018, 0, 20);
            const dateB = new Date(2018, 1, 10);
            expect(dateUtils.isSameMonth(dateA, dateB)).toEqual(false);
        });

        it('should return false if the dates are from the same month but different year', () => {
            const dateA = new Date(2018, 0, 20);
            const dateB = new Date(2017, 0, 20);
            expect(dateUtils.isSameMonth(dateA, dateB)).toEqual(false);
        });
    });

    describe('isDayInArray()', () => {
        it('should return true if the date belong to the collection of dates', () => {
            const date = new Date(2018, 0, 20);
            const array = [new Date(2018, 0, 20), new Date(2018, 0, 21)];
            expect(dateUtils.isDayInArray(date, array)).toEqual(true);
        });

        it('should return false if the date does not belong to the collection of dates', () => {
            const date = new Date(2018, 0, 20);
            const array = [new Date(2018, 0, 21), new Date(2018, 0, 22)];
            expect(dateUtils.isDayInArray(date, array)).toEqual(false);
        });
    });

    describe('isDayBetween()', () => {
        it('should return true if the day is between the dates', () => {
            const day = new Date(2018, 0, 20);
            const dateA = new Date(2018, 0, 1);
            const dateB = new Date(2018, 0, 31);
            expect(dateUtils.isDayBetween(day, dateA, dateB)).toEqual(true);
        });

        it('should return false if the day is not between the dates', () => {
            const day = new Date(2018, 1, 20);
            const dateA = new Date(2018, 0, 1);
            const dateB = new Date(2018, 0, 31);
            expect(dateUtils.isDayBetween(day, dateA, dateB)).toEqual(false);
        });

        it('should return false if the day is one of the dates', () => {
            const day = new Date(2018, 0, 1);
            const dateA = new Date(2018, 0, 1);
            const dateB = new Date(2018, 0, 31);
            expect(dateUtils.isDayBetween(day, dateA, dateB)).toEqual(false);
        });
    });

    describe('isDayBefore()', () => {
        let date;
        beforeEach(() => {
            date = new Date(2018, 0, 20);
        });

        it('should return true if the date is before another date', () => {
            const dateInPast = new Date(2018, 0, 1);
            expect(dateUtils.isDayBefore(dateInPast, date)).toEqual(true);
        });

        it('should return false if the date is after another date', () => {
            const dateInPast = new Date(2018, 0, 21);
            expect(dateUtils.isDayBefore(dateInPast, date)).toEqual(false);
        });

        it('should return false if the date is the same date to check', () => {
            const dateInPast = new Date(2018, 0, 20);
            expect(dateUtils.isDayBefore(dateInPast, date)).toEqual(false);
        });
    });

    describe('isDayAfter()', () => {
        let date;
        beforeEach(() => {
            date = new Date(2018, 0, 20);
        });

        it('should return true if the date is after another date', () => {
            const dateAfter = new Date(2018, 0, 22);
            expect(dateUtils.isDayAfter(dateAfter, date)).toEqual(true);
        });

        it('should return false if the date is before another date', () => {
            const dateAfter = new Date(2018, 0, 19);
            expect(dateUtils.isDayAfter(dateAfter, date)).toEqual(false);
        });

        it('should return false if the date is the same date to check', () => {
            const dateAfter = new Date(2018, 0, 20);
            expect(dateUtils.isDayAfter(dateAfter, date)).toEqual(false);
        });
    });

    describe('isToday()', () => {
        it('should return true if the date is todays date', () => {
            const currentDate = new Date();
            const currentISODate = currentDate.toISOString();
            expect(dateUtils.isToday(currentISODate)).toEqual(true);
        });

        it('should return false if the date is not todays date', () => {
            const dateParam = '2017-08-10T01:00:00Z';
            expect(dateUtils.isToday(dateParam)).toEqual(false);
        });
    });

    describe('isTomorrow()', () => {
        let currentDate;
        let tomorrowsISODate;

        it('should return true if the date is tomorrows date', () => {
            currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);
            tomorrowsISODate = currentDate.toISOString();
            expect(dateUtils.isTomorrow(tomorrowsISODate)).toEqual(true);
        });

        it('should return false if the date is not tomorrows date', () => {
            currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 2);
            tomorrowsISODate = currentDate.toISOString();
            expect(dateUtils.isTomorrow(tomorrowsISODate)).toEqual(false);
        });
    });

    describe('isISODate()', () => {
        let dateToTest;

        it('should return true for Standard ISO format', () => {
            dateToTest = '2018-09-10T16:00:00.000Z';
            expect(dateUtils.isISODate(dateToTest)).toEqual(true);
        });

        it('should return true for Standard ISO format without milliseconds', () => {
            dateToTest = '2018-09-10T16:00:00Z';
            expect(dateUtils.isISODate(dateToTest)).toEqual(true);
        });

        it('should return false for no time format by default', () => {
            dateToTest = '2018-09-10';
            expect(dateUtils.isISODate(dateToTest)).toEqual(false);
        });

        describe('with dateOnlyFormatAllowed flag', () => {
            it('should return true for Standard ISO format', () => {
                dateToTest = '2018-09-10T16:00:00.000Z';
                expect(dateUtils.isISODate(dateToTest, true)).toEqual(true);
            });

            it('should return true for no time format', () => {
                dateToTest = '2018-09-10';
                expect(dateUtils.isISODate(dateToTest, true)).toEqual(true);
            });

            it('should return false for invalid input', () => {
                dateToTest = 'invalid';
                expect(dateUtils.isISODate(dateToTest, true)).toEqual(false);
            });
        });
    });

    describe('formatISODateVariation', () => {
        const dateToTest = '2018-09-10T20:20:00.000Z';

        it('should return correct UTC date string.', () => {
            expect(dateUtils.formatISODateVariation(dateToTest)).toEqual('20180910T202000Z');
        });

        it('should return correct UTC date string with offset.', () => {
            // add 1.5h
            expect(dateUtils.formatISODateVariation(dateToTest, 90)).toEqual('20180910T215000Z');
        });

        it('should return correct UTC date string with offset next day.', () => {
            // add 5h
            expect(dateUtils.formatISODateVariation(dateToTest, 300)).toEqual('20180911T012000Z');
        });
    });

    describe('getAgeInYears', () => {
        it('should return difference in years between dates', () => {
            const curDate = new Date(2019, 1, 23);
            const oldDate = new Date(1914, 7, 28);
            const result = dateUtils.getAgeInYears(oldDate, curDate);
            expect(result).toEqual(104);
        });

        it('should return zero if both dates are the same', () => {
            const curDate = new Date();
            const oldDate = new Date();
            const result = dateUtils.getAgeInYears(oldDate, curDate);
            expect(result).toEqual(0);
        });
    });

    describe('getDateObjectFromString', () => {
        it('should return correct date Object if string is valid', () => {
            const result = dateUtils.getDateObjectFromString('2019-01-20');
            expect([result.getFullYear(), result.getMonth() + 1, result.getDate()]).toEqual([2019, 1, 20]);
        });

        it('should accept ISO date strings with time', () => {
            const result = dateUtils.getDateObjectFromString('2019-01-20T10:20:30Z');
            expect([result.getFullYear(), result.getMonth() + 1, result.getDate()]).toEqual([2019, 1, 20]);
        });

        it('should return null if string is malformed', () => {
            expect(dateUtils.getDateObjectFromString('malformed string')).toEqual(null);
        });
    });

    describe('getMonthDiff', () => {
        it('should return correct month diff when month 1 < month 2', () => {
            const date1 = new Date(2018, 3, 5);
            const date2 = new Date(2019, 1, 5);
            const result = dateUtils.getMonthDiff(date1, date2);
            expect(result).toEqual(10);
        });

        it('should return correct month diff when month 1 > month 2', () => {
            const date1 = new Date(2019, 2, 5);
            const date2 = new Date(2018, 12, 5);
            const result = dateUtils.getMonthDiff(date1, date2);
            expect(result).toEqual(-2);
        });

        it('should return correct month diff when month 1 === month 2', () => {
            const date1 = new Date(2019, 3, 5);
            const date2 = new Date(2019, 3, 5);
            const result = dateUtils.getMonthDiff(date1, date2);
            expect(result).toEqual(0);
        });
    });

    describe('formatQueryDate', () => {
        it('should return the date in the correct format', () => {
            const date = new Date(2019, 3, 5);
            const result = dateUtils.formatQueryDate(date);
            expect(result).toEqual('2019-04-05');
        });
    });

    describe('getDateInMMDD', () => {
        it('should return the date full month and date without year', () => {
            const date = '2020-07-22 00:00:00';
            const result = dateUtils.getDateInMMDD(date);
            expect(result).toEqual('Jul 22');
        });
    });

    describe('getDateInMDYFormat', () => {
        it('should return formatted date if input is a valid string', () => {
            expect(dateUtils.getDateInMDYFormat('03/07/2021')).toEqual('3/7/2021');
        });

        it('should return formatted date if input is a Date object', () => {
            expect(dateUtils.getDateInMDYFormat(new Date(2021, 0, 9))).toEqual('1/9/2021');
        });

        it('should return empty string on malformed input', () => {
            expect(dateUtils.getDateInMDYFormat()).toEqual('');
        });

        it('should return empty string on random obj input ', () => {
            expect(dateUtils.getDateInMDYFormat({ aaa: 'bbb' })).toEqual('');
        });
    });
    // nth, day, month, year
    describe('getNthDayOfMonth', () => {
        it('should return correct value for 1st TUE of a month starting on a WED ', () => {
            expect(dateUtils.getNthDayOfMonth(1, 2, 0, 2020)).toEqual(7);
        });

        it('should return correct value for 3rd TUE of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(3, 2, 0, 2020)).toEqual(21);
        });

        it('should return correct value for 1st WED of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(1, 3, 0, 2020)).toEqual(1);
        });

        it('should return correct value for 4th WED of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(4, 3, 0, 2020)).toEqual(22);
        });

        it('should return correct value for 5th WED of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(5, 3, 0, 2020)).toEqual(29);
        });

        it('should return correct value for 1st THU of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(1, 4, 0, 2020)).toEqual(2);
        });

        it('should return correct value for 2nd THU of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(2, 4, 0, 2020)).toEqual(9);
        });

        it('should return correct value for 1st SAT of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(1, 6, 0, 2020)).toEqual(4);
        });

        it('should return correct value for 3rd SAT of a month starting on a WED', () => {
            expect(dateUtils.getNthDayOfMonth(3, 6, 0, 2020)).toEqual(18);
        });

        describe('for initial Daylight Saving', () => {
            const DST = {
                2020: 8,
                2021: 14,
                2022: 13,
                2023: 12,
                2024: 10,
                2025: 9,
                2026: 8,
                2027: 14,
                2028: 12,
                2029: 11
            };

            // eslint-disable-next-line guard-for-in
            for (const year in DST) {
                it(`should return correct value for ${year}`, () => {
                    expect(dateUtils.getNthDayOfMonth(2, 0, 2, year)).toEqual(DST[year]);
                });
            }
        });

        describe('for end of Daylight Saving', () => {
            const DST = {
                2020: 1,
                2021: 7,
                2022: 6,
                2023: 5,
                2024: 3,
                2025: 2,
                2026: 1,
                2027: 7,
                2028: 5,
                2029: 4
            };

            // eslint-disable-next-line guard-for-in
            for (const year in DST) {
                it(`should return correct value for ${year}`, () => {
                    expect(dateUtils.getNthDayOfMonth(1, 0, 10, year)).toEqual(DST[year]);
                });
            }
        });
    });

    describe('getDateInMDDShortMonthFormat', () => {
        it('should return correct date format', () => {
            expect(dateUtils.getDateInMDDShortMonthFormat('2022-05-11', false)).toEqual('May 11');
        });
    });

    describe('getEpochSecondsFromPSTDateTime', () => {
        it('should return correct epochSeconds when daylight savings are in effect', () => {
            expect(dateUtils.getEpochSecondsFromPSTDateTime('2025-03-23T02:00')).toEqual(1742720400);
        });
        it('should return correct epochSeconds when daylight savings are not in effect', () => {
            expect(dateUtils.getEpochSecondsFromPSTDateTime('2025-12-10T23:50')).toEqual(1765439400);
        });
        it('should return correct epochSeconds when daylight savings are an additional date to test', () => {
            expect(dateUtils.getEpochSecondsFromPSTDateTime('2025-04-30T23:55')).toEqual(1746082500);
        });
    });
});
