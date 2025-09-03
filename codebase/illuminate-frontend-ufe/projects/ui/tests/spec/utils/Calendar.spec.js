const dateUtils = require('utils/Date').default;
const calendarUtils = require('utils/Calendar').default;

describe('Calendar utils', () => {
    describe('buildCalendarUrl', () => {
        const data = {
            startDate: '2018-12-12T10:00:00.000Z',
            duration: 60,
            summary: 'summary'
        };

        beforeEach(() => {
            spyOn(dateUtils, 'formatISODateVariation').and.callFake((_argOne, argTwo) => {
                if (argTwo) {
                    return '20181212T110000Z';
                } else {
                    return '20181212T100000Z';
                }
            });
        });

        it('should return correct value with no options', () => {
            const result = calendarUtils.buildCalendarUrl(data.startDate, data.duration, data.summary);
            const expected =
                'data:text/calendar;charset=utf8,BEGIN:VCALENDAR' +
                '\nVERSION:2.0' +
                '\nBEGIN:VEVENT' +
                '\nDTSTART:20181212T100000Z' +
                '\nDTEND:20181212T110000Z' +
                '\nSUMMARY:summary' +
                '\nEND:VEVENT' +
                '\nEND:VCALENDAR';
            expect(decodeURIComponent(result)).toEqual(expected);
        });

        it('should return correct value with options', () => {
            const result = calendarUtils.buildCalendarUrl(data.startDate, data.duration, data.summary, {
                location: 'my location',
                description: 'my description',
                url: 'https://sephora.com/'
            });
            const expected =
                'data:text/calendar;charset=utf8,BEGIN:VCALENDAR' +
                '\nVERSION:2.0' +
                '\nBEGIN:VEVENT' +
                '\nDTSTART:20181212T100000Z' +
                '\nDTEND:20181212T110000Z' +
                '\nSUMMARY:summary' +
                '\nDESCRIPTION:my description\\n' +
                'https://sephora.com/' +
                '\nLOCATION:my location' +
                '\nEND:VEVENT' +
                '\nEND:VCALENDAR';
            expect(decodeURIComponent(result)).toEqual(expected);
        });

        it('should escape parameters if needed', () => {
            const result = calendarUtils.buildCalendarUrl(
                data.startDate,
                data.duration,
                'Line #5, \n new line' // '/n' should be escaped
            );
            const expected =
                'data:text/calendar;charset=utf8,BEGIN:VCALENDAR' +
                '\nVERSION:2.0' +
                '\nBEGIN:VEVENT' +
                '\nDTSTART:20181212T100000Z' +
                '\nDTEND:20181212T110000Z' +
                '\nSUMMARY:Line #5,\\n new line' +
                '\nEND:VEVENT' +
                '\nEND:VCALENDAR';
            expect(decodeURIComponent(result)).toEqual(expected);
        });
    });
});
