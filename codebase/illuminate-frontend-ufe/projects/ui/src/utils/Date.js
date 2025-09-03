import localeUtils from 'utils/LanguageLocale';
import uiUtils from 'utils/UI';

export default {
    /**
     * Clone a date object.
     * @param  {Date} date The date to clone
     * @return {Date}      The cloned date
     */
    clone: function (date) {
        return new Date(date.getTime());
    },

    /**
     * Return `date` as a new date with `n` months added.
     *
     * @export
     * @param {[type]} date JS Date object
     * @param {[type]} n    n months to add
     */
    addMonths: function (date, n) {
        const newDate = this.clone(date);
        const currentDay = newDate.getDate();
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + n);
        newDate.setDate(Math.min(currentDay, this.getDaysInMonth(newDate.getFullYear(), newDate.getMonth())));

        return newDate;
    },

    /**
     * Return `date` as a new date with `n` days added.
     *
     * @export
     * @param {[type]} date JS Date object
     * @param {[type]} n    n months to add
     */
    addDays: function (date, n) {
        const newDate = this.clone(date);
        newDate.setDate(date.getDate() + n);

        return newDate;
    },

    /**
     * Get the name of the day of the week.
     * @param  {object} date JS Date object.
     * @return {string}      The name of the day in the date object such as 'Monday'
     */
    getDayOfWeek: function (date, makeLowerCase = true, translate = false) {
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
        const DAYS = translate ? getText('DAYS') : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return makeLowerCase ? DAYS[date.getDay()].toLowerCase() : DAYS[date.getDay()];
    },

    /**
     * Gets client date and adjusts to PST
     * @param  {object} now A JS date object.
     * @return {string}     The current date converted to YYYY|MM|DD
     */
    getLocalDate: function (clientDate) {
        try {
            var pstOffset = '-8';
            var utcDate = clientDate.getTime() + clientDate.getTimezoneOffset() * 60000;
            var serverDate = new Date(utcDate + 3600000 * pstOffset);
            var _m = serverDate.getMonth() + 1;
            var _d = serverDate.getDate();

            return serverDate.getFullYear() + '|' + (_m < 10 ? '0' + _m : _m) + '|' + (_d < 10 ? '0' + _d : _d);
        } catch (e) {
            return null;
        }
    },

    /**
     * Gets the month array for drop downs on forms
     */
    getMonthArray: function () {
        return localeUtils.getLocaleResourceFile('utils/locales', 'Date')('MONTHS');
    },

    /**
     * Gets the month array for drop downs on forms
     */
    getShortenedMonthArray: function () {
        return localeUtils.getLocaleResourceFile('utils/locales', 'Date')('SHORTENED_MONTHS');
    },

    /**
     * Get numeric month array for drop down on forms
     */
    getNumericMonthArray: function () {
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    },

    /**
     * Gets the first day of the month
     * @param  {object} date A JS date object.
     * @return {object}      The first day of the month as a JS date object
     */
    getFirstDayOfMonth: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    /**
     * Gets the number of days of the month
     * @param  {number} year getFullYear of date 'YYYY'
     * @param  {number} month getMonth ('MM') - 1
     * @return {number}      The number of days of the month
     */
    getDaysInMonth: function (year, month) {
        return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    /**
     * Get the number of months apart between dates
     * @param  {date} date1 A JS date object.
     * @param  {date} date2 A JS date object.
     * @return {number}     The number of months apart
     */
    getMonthDiff: function (date1, date2) {
        let months = (date2.getFullYear() - date1.getFullYear()) * 12;
        months -= date1.getMonth();
        months += date2.getMonth();

        return months;
    },

    isLeapYear: function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },

    /**
     * Gets the date array for drop downs on forms
     */
    getDayArray: function () {
        const daysArray = [];

        for (let i = 1; i <= 31; i++) {
            daysArray.push(i);
        }

        return daysArray;
    },

    /**
     * Gets the name of the day array
     */
    getWeekdaysArray: function () {
        return localeUtils.getLocaleResourceFile('utils/locales', 'Date')('DAYS');
    },

    /**
     * Gets the name of the day array
     */
    getShortenedWeekdaysArray: function () {
        return localeUtils.getLocaleResourceFile('utils/locales', 'Date')('SHORTENED_DAYS');
    },

    /**
     * Gets weeks array of the month
     * @param  {object} date A JS date object.
     * @return {string}      The first day of the month as a JS date object
     */
    getWeekArray: function (date) {
        const firstDayOfWeek = 0;
        const daysInMonth = this.getDaysInMonth(date.getFullYear(), date.getMonth());
        const dayArray = [];

        let week = [];
        const weekArray = [];

        for (let i = 1; i <= daysInMonth; i += 1) {
            dayArray.push(new Date(date.getFullYear(), date.getMonth(), i));
        }

        dayArray.forEach(day => {
            if (week.length > 0 && day.getDay() === firstDayOfWeek) {
                weekArray.push(week);
                week = [];
            }

            week.push(day);

            if (dayArray.indexOf(day) === dayArray.length - 1) {
                weekArray.push(week);
            }
        });

        // unshift days to start the first week
        const firstWeek = weekArray[0];

        for (let i = 7 - firstWeek.length; i > 0; i -= 1) {
            const outsideDate = this.clone(firstWeek[0]);
            outsideDate.setDate(firstWeek[0].getDate() - 1);
            firstWeek.unshift(outsideDate);
        }

        // push days until the end of the last week
        const lastWeek = weekArray[weekArray.length - 1];

        for (let i = lastWeek.length; i < 7; i += 1) {
            const outsideDate = this.clone(lastWeek[lastWeek.length - 1]);
            outsideDate.setDate(lastWeek[lastWeek.length - 1].getDate() + 1);
            lastWeek.push(outsideDate);
        }

        return weekArray;
    },

    /**
     * Return the number of the week of the month the date belongs to
     * @export
     * @param  {Date} date JS Data Obj
     * @return {number}
     */
    getWeekNumberInMonth(date) {
        const firstDayMonth = this.getFirstDayOfMonth(date).getDay();
        const currentDayNumber = date.getDate();
        const DAYS_IN_WEEK = 7;

        return parseInt((currentDayNumber + firstDayMonth - 1) / DAYS_IN_WEEK);
    },

    /**
     * Gets the year array for drop downs on forms
     */
    getYearArray: function () {
        const yearCeling = new Date().getFullYear() - 13;
        const yearArray = [];

        for (let i = yearCeling; i >= 1900; i--) {
            yearArray.push(i);
        }

        return yearArray;
    },

    getBiMaxDateString: function () {
        const validDate = new Date().setFullYear(new Date().getFullYear() - 13);
        const date = new Date(validDate);

        return date.toISOString().substring(0, 10);
    },

    getCreditCardExpYears: function () {
        const currentYear = new Date().getFullYear();
        const creditCardExpYears = [];

        for (let i = currentYear; i < currentYear + 12; i++) {
            creditCardExpYears.push(i);
        }

        return creditCardExpYears;
    },

    /**
     * @param {object} date JS Date object
     * @return {string} Long data format DD MM YYYY
     */
    getLongDate: function (date) {
        const SHORTENED_MONTHS = localeUtils.getLocaleResourceFile('utils/locales', 'Date')('SHORTENED_MONTHS');

        return date.getDate() + ' ' + SHORTENED_MONTHS[date.getMonth()] + ' ' + date.getFullYear();
    },

    /**
     * Takes a ISO8601 date string and returns a Mon DD YYYY formatted string
     * @param {string} iso8601DateString - ISO8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {boolean} addComma=false - should it have a comma before YYYY?
     * @param {boolean} longMonth=false - use full or 3-letter notation
     * @param {boolean} showYear=true - to show or hide a year from the string
     * @return {string} Mon DD YYYY or Mon DD, YYYY formatted string
     */
    formatDateMDY: function (iso8601DateString, addComma = false, longMonth = false, showYear = true) {
        // Safari does not support the ISO8601 date format, so we are getting
        // the first 10 characters of the string and replacing the dashes for
        // slashes to create a data string supported by all browsers (YYYY/MM/DD)
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
        const SHORTENED_MONTHS = getText('SHORTENED_MONTHS');
        const MONTHS = getText('MONTHS');

        let dateMDY = '';

        if (iso8601DateString) {
            const dateString = iso8601DateString.slice(0, 10).replace(/-/g, '/');
            const date = new Date(dateString);
            const leftPad = n => ('0' + n).slice(-2);
            const day = leftPad(date.getDate());

            const month = longMonth ? MONTHS[date.getMonth()] : SHORTENED_MONTHS[date.getMonth()];

            const yearSpace = addComma ? ', ' : ' ';
            const yearStr = showYear ? yearSpace + date.getFullYear() : '';

            dateMDY = month + ' ' + day + yearStr;
        }

        return dateMDY;
    },

    /**
     * @param {string} timestamp string from reservations object
     * @return {string} HH:MM (am or pm)
     */
    getReservationTime: function (timeString) {
        const time = new Date(timeString);

        //get accurate hours for time zone where reservation is located
        let splitTime = timeString.split('T');
        splitTime = splitTime[splitTime.length - 1].split(':');
        time.setHours(splitTime[0]);

        let timeOfDay = 'am';
        let hours = time.getHours();
        let minutes = time.getMinutes();

        // convert from military time
        if (hours > 12) {
            hours = hours - 12;
            timeOfDay = 'pm';
        }

        //add zero if minutes is less than 10
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + ':' + minutes + ' ' + timeOfDay;
    },

    /**
     * @param {number that correlates to month}
     * @return {string}
     * note: can be built out to take longer version of month string and give back shorter version
     */
    getShortenedMonth: function (month) {
        const SHORTENED_MONTHS = localeUtils.getLocaleResourceFile('utils/locales', 'Date')('SHORTENED_MONTHS');
        const monthNum = parseInt(month);

        return SHORTENED_MONTHS[monthNum - 1];
    },

    /**
     * @param {number that correlates to month}
     * @return {string}
     * note: can be built out to take longer version of month string and give back shorter version
     */
    getLongMonth: function (month) {
        const MONTHS = localeUtils.getLocaleResourceFile('utils/locales', 'Date')('MONTHS');
        const monthNum = parseInt(month);

        return MONTHS[monthNum - 1];
    },

    /**
     * Return `true` if two dates are the same day, ignoring the time.
     * @export
     * @param  {Date} date1
     * @param  {Date} date2
     * @return {Boolean}
     */
    isSameDay: function (date1, date2) {
        if (!date1 || !date2) {
            return false;
        }

        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    },

    /**
     * Return `true` if two dates fall in the same month.
     *
     * @export
     * @param  {Date}  date1
     * @param  {Date}  date2
     * @return {Boolean}
     */
    isSameMonth: function (date1, date2) {
        if (!date1 || !date2) {
            return false;
        }

        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    },

    /**
     * Return `true` if the date is present in a collection of dates
     * @export
     * @param  {Date} date JS Data Obj
     * @param  {Array} arr collection of dates
     * @return {Boolean}
     */
    isDayInArray: function (date, arr) {
        const result = arr.filter(d => d.toDateString() === date.toDateString());

        return result.length > 0;
    },

    /**
     * Return `true` if the 'day' is between `date1` and `date2`,
     * without including them.
     *
     * @export
     * @param  {Date}  day
     * @param  {Date}  date1
     * @param  {Date}  date2
     * @return {Boolean}
     */
    isDayBetween: function (day, date1, date2) {
        const date = this.clone(day);
        date.setHours(0, 0, 0, 0);

        return (this.isDayAfter(date, date1) && this.isDayBefore(date, date2)) || (this.isDayAfter(date, date2) && this.isDayBefore(date, date1));
    },

    /**
     * Return true if the day is before today
     * @export
     * @param  {Date} date JS Data Obj
     * @return {Boolean}
     */
    isPastDay: function (date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.isDayBefore(date, today);
    },

    /**
     * Returns `true` if the first day is before the second day.
     * @export
     * @param {Date} date1
     * @param {Date} date2
     * @returns {Boolean}
     */
    isDayBefore: function (date1, date2) {
        const day1 = this.clone(date1).setHours(0, 0, 0, 0);
        const day2 = this.clone(date2).setHours(0, 0, 0, 0);

        return day1 < day2;
    },

    /**
     * Returns `true` if the first day is after the second day.
     * @export
     * @param {Date} date1
     * @param {Date} date2
     * @returns {Boolean}
     */
    isDayAfter: function (date1, date2) {
        const day1 = this.clone(date1).setHours(0, 0, 0, 0);
        const day2 = this.clone(date2).setHours(0, 0, 0, 0);

        return day1 > day2;
    },

    /**
     * formats time for My Profile according to rules:
     * if posted <59 minutes, displays '#m ago'
     * if posted <23.59 hr ago, displays '#h ago'
     * if posted <30 days ago, displays '#d ago'
     * if posted >30 days ago, displays 'MM DD, YYYY'
     * @param date String
     * @return {string}
     */
    formatSocialDate: function (dateString, defaultToLongDate) {
        const date = new Date(dateString);
        const today = new Date();
        const millisecondsDiff = Math.abs(today - date);
        const minsDiff = Math.floor(millisecondsDiff / 1000 / 60);

        switch (true) {
            case minsDiff < 60:
                return minsDiff + ' m ago';
            case minsDiff < 60 * 23.59:
                return Math.floor(minsDiff / 60) + ' h ago';
            case minsDiff <= 60 * 24 * 30: {
                const day = Math.floor(minsDiff / 60 / 24);

                return `${day} d ago`;
            }

            case minsDiff > 60 * 24 * 30:
                return defaultToLongDate ? this.getLongDate(date) : dateString.split(' ').slice(0, 3).join(' ');
            default:
                return null;
        }
    },

    /**
     * @param {string} dateString - optional, Date() acceptable string
     * @param {int} offset - optional, offset in minutes
     * @return {string} ISO8601 date string (YYYYMMDDTHHmmssZ)
     */
    formatISODateVariation: function (dateString = null, offset = 0) {
        const date = dateString ? new Date(dateString) : new Date();

        if (!date) {
            return null;
        }

        const offsetInt = parseInt(offset);

        if (offsetInt) {
            date.setMinutes(date.getMinutes() + offsetInt);
        }

        const pad = number => (number < 10 ? '0' + number : number);
        const fullYear = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hour = pad(date.getUTCHours());
        const minute = pad(date.getUTCMinutes());
        const second = pad(date.getUTCSeconds());

        return `${fullYear}${month}${day}T${hour}${minute}${second}Z`;
    },

    addRemoveDays: function (add, date, days) {
        const result = new Date(date);

        if (add) {
            result.setDate(result.getDate() + days);
        } else {
            result.setDate(result.getDate() - days);
        }

        result.setHours(0, 0, 0, 0);

        return result;
    },

    getEstimatedDeliveryString: function (date) {
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
        const SHORTENED_DAYS = getText('SHORTENED_DAYS');

        const estimatedDelivery = new Date(date);
        const dayOfWeek = SHORTENED_DAYS[estimatedDelivery.getDay()];
        const month = estimatedDelivery.getMonth() + 1;
        const day = estimatedDelivery.getDate();

        return `${dayOfWeek} ${month}/${day}`;
    },

    getPromiseDate: function (date, showYear = false, useUTCTreatment = false) {
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
        const SHORTENED_DAYS = getText('SHORTENED_DAYS');

        const promiseDate = useUTCTreatment ? new Date(date.split('T')[0] + 'T00:00:00Z') : new Date(date);
        const day = useUTCTreatment ? SHORTENED_DAYS[promiseDate.getUTCDay()] : SHORTENED_DAYS[promiseDate.getDay()];
        const month = useUTCTreatment
            ? new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(promiseDate)
            : new Intl.DateTimeFormat('en-US', { month: 'short' }).format(promiseDate);
        const year = promiseDate.getFullYear();
        const fDate = useUTCTreatment ? promiseDate.getUTCDate() : promiseDate.getDate();

        return `${day}, ${month} ${fDate}${showYear ? ', ' + year : ''}`;
    },

    getPromiseDateRange: function (promiseDateRange) {
        if (!promiseDateRange) {
            return '';
        }

        const [from = '', to = ''] = promiseDateRange.split(' - ');

        let result = '';

        if (from) {
            result += this.getPromiseDate(from, false, true);
        }

        if (to) {
            result += ' – ' + this.getPromiseDate(to, false, true);
        }

        return result;
    },

    getEstimatedDeliveryDateRange: function (estimatedMinDeliveryDate, estimatedMaxDeliveryDate) {
        const from = new Date(estimatedMinDeliveryDate).toISOString();
        const to = new Date(estimatedMaxDeliveryDate).toISOString();
        const promiseDateRange = from + ' - ' + to;
        const result = this.getPromiseDateRange(promiseDateRange);

        return result;
    },

    /**
     * @param {string} iso8601DateString - ISO8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
     * @return {boolean} True if param is Today's date
     */
    isToday: function (iso8601DateString) {
        const currentDate = new Date();
        const paramDate = new Date(iso8601DateString);
        const todayMDY = `${currentDate.getMonth()} ${currentDate.getDate()} ${currentDate.getFullYear()}`;
        const paramMDY = `${paramDate.getMonth()} ${paramDate.getDate()} ${paramDate.getFullYear()}`;

        return todayMDY === paramMDY;
    },

    /**
     * @param {string} iso8601DateString - ISO8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
     * @return {boolean} True if param is Tomorrows's date
     */
    isTomorrow: function (iso8601DateString) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const paramDate = new Date(iso8601DateString);
        const tomorrowMDY = `${currentDate.getMonth()} ${currentDate.getDate()} ${currentDate.getFullYear()}`;
        const paramMDY = `${paramDate.getMonth()} ${paramDate.getDate()} ${paramDate.getFullYear()}`;

        return tomorrowMDY === paramMDY;
    },

    previousFromToday: function (iso8601DateString) {
        let currentDate = new Date();
        currentDate = currentDate.setHours(0, 0, 0, 0);
        let paramDate = new Date(iso8601DateString);
        paramDate = paramDate.setHours(0, 0, 0, 0);

        return paramDate < currentDate;
    },

    /**
     * Get the nth day of a month - for example get the second thursday of January 2020 = 9
     * @param {number} nth - the week needed
     * @param {number} weekday - weekday needed: 0-6, where Sunday=0 and Saturday=6
     * @param {number} month - month to look for: 0-11, where Jan=0, and Dec=11
     * @param {number} year - year to look for (YYYY)
     * @return {number} the nth day of the month (like 21)
     */
    getNthDayOfMonth: function (nth, weekday, month, year) {
        const DAYS_OF_WEEK = 7;
        const firstWeekdayOfMonth = new Date(year, month, 1).getDay();
        const weekAdjustment = weekday < firstWeekdayOfMonth ? DAYS_OF_WEEK : 0;
        const dayOfFirstWeekdayNeeded = 1 + weekday + (weekAdjustment - firstWeekdayOfMonth);

        return dayOfFirstWeekdayNeeded + DAYS_OF_WEEK * (nth - 1);
    },

    isISODate: function (date, dateOnlyFormatAllowed = false) {
        const regexp = dateOnlyFormatAllowed ? /^\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d:[0-5]\d)?/ : /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;

        return regexp.test(date);
    },

    isValidDateTime: function (date) {
        const regexp = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]/g;

        return regexp.test(date);
    },

    // Does not require HH:MM like the isValidDateTime() function
    isValidDate: function (date) {
        const regexp = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;

        return regexp.test(date);
    },

    getCreditCardExpiry: function (expireDate) {
        const expiry = expireDate.split('-');

        return expiry[1] + '/' + expiry[0];
    },

    generateCurrentDateTime: function () {
        const d = new Date();

        return (
            `${d.getFullYear()}-${d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}` +
            `-${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}T` +
            `${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:` +
            `${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}:00`
        );
    },

    /**
     * returns date object from month, day, year numeric values
     * @param {*} month
     * @param {*} day
     * @param {*} year
     */
    getDateFromMDY: function (month, day, year) {
        return new Date(year, month, day);
    },

    /**
     * returns age depending on passed birthday date and current date
     * default current date is today
     * @param {*} bdDate
     * @param {*} curDate
     */
    getAgeInYears: function (bdDate, curDate = new Date()) {
        const curYear = curDate.getFullYear();
        const curMonth = curDate.getMonth();
        const curDay = curDate.getDate();

        const bdYear = bdDate.getFullYear();
        const bdMonth = bdDate.getMonth();
        const bdDay = bdDate.getDate();

        const diffInYears = curYear - bdYear;

        return bdMonth > curMonth ? diffInYears - 1 : curMonth === bdMonth ? (bdDay > curDay ? diffInYears - 1 : diffInYears) : diffInYears;
    },

    /**
     * Converts a string representation of a date into a Date object
     * Returned object still has to be validated against a range, if any
     * @param {string} str - string to parse (format: YYYY-mm-dd)
     * @return {object} Date object or null if unable to parse
     */
    getDateObjectFromString: function (str) {
        const m = str.match(/^(\d{4})-([01]\d)-([0-3]\d)/);

        return m && m.length > 2 ? new Date(m[1], m[2] - 1, m[3]) : null;
    },

    /**
     * Converts a Date object into a string with the format YYYY-mm-dd
     * @param  {Date} date - Date object to convert
     * @return {string} date string with the format: YYYY-mm-dd
     */
    formatQueryDate: function (date) {
        const newDate = new Date(date);

        return `${newDate.getFullYear()}-` + `${('0' + (newDate.getMonth() + 1)).slice(-2)}-` + `${('0' + newDate.getDate()).slice(-2)}`;
    },

    /**
     * Converts a Date object into a string with the format YYYY-MM-DDTHH:mm:ssZ
     * @param  {Date|DateTZ} date - Date or DateTZ object to convert
     * @return {string} date string with the format:  YYYY-MM-DDTHH:mm:ssZ
     */
    getShortenedISOString: function (date) {
        const msTimeRegex = /[.]\d*/;

        return date.toISOString().replace(msTimeRegex, '');
    },

    /**
     * Converts a Date object into a string with the format as Aug 10[without year]
     * @param  {Date} date - Date object to convert
     * @return {string} date string with the format: shortMonth Date
     */
    getDateInMMDD: function (date) {
        const newDate = new Date(date);
        const month = this.getShortenedMonthArray()[newDate.getMonth()];
        const fDate = newDate.getDate();

        return `${month} ${fDate}`;
    },

    /**
     * Converts a Date object into a string with the format as March 25, 2019
     * @param  {Date} date - Date object to convert
     * @return {string} date string with the format: LongMonth Date, Year
     */
    getDateInMMDDYYYY: function (date) {
        const newDate = new Date(date);

        return `${this.getLongMonth(newDate.getMonth() + 1)}
              ${newDate.getDate()}, ${newDate.getFullYear()}`;
    },

    getDateInMMYYYY: function (dateInput) {
        const date = new Date(dateInput);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${year}`;
    },

    /**
     * Converts a Date object into a string with the format as Mar 25, 2019
     * @param  {Date} date - Date object to convert
     * @return {string} date string with the format: LongMonth Date, Year
     */
    getDateInMMDDYYYYShortMonth: function (date) {
        const dateArr = date && date.replace(/T.+/, '').split('-');

        if (!dateArr || dateArr.length !== 3) {
            return null;
        }

        const [year, month, day] = dateArr;
        const dateFormatted = `${month}/${day}/${year}`;
        const newDate = new Date(dateFormatted);

        return `${this.getShortenedMonth(newDate.getMonth() + 1)}
              ${newDate.getDate()}, ${newDate.getFullYear()}`;
    },

    /**
     * Specific error on iOS/Safari devices with the new Date() Javascript constructor, so we have to pass each element individually for it to work on these devices
     * @param {string} string - Date to be transformed with the following format 2023-10-25 11:59:00.0
     * @returns {date} Date object converted
     */
    convertDateForIOS(date) {
        if (!date) {
            return '';
        }

        const splitDate = date.split(/[- :]/);

        return new Date(splitDate[0], splitDate[1] - 1, splitDate[2], splitDate[3], splitDate[4], splitDate[5]);
    },

    /**
     * Converts a Date object into a string with the format as MM/DD/YYYY
     * @param  {Date} date - Date object to convert or string in Date.parse compatible format
     * @return {string} date string with the format: MM/DD/YYYY
     */
    getDateInMDYFormat: function (date) {
        if (typeof date === 'string') {
            // eslint-disable-next-line no-param-reassign
            date = uiUtils.isIOS() ? this.convertDateForIOS(date) : new Date(date);
        }

        return date && date instanceof Date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : '';
    },

    /**
     * Converts a Date object into a string with format MMDD for example 0106
     * @param {Date} date - Date object to convert or string in Date.parse compatible format
     * @returns {string} date string with format MMDD, Example - January 6 as 0106
     */
    getDateInMDFormat: function (date) {
        if (typeof date === 'string') {
            // eslint-disable-next-line no-param-reassign
            date = new Date(date);
        }

        var _m = date.getMonth() + 1;
        var _d = date.getDate();

        return date && date instanceof Date ? `${_m < 10 ? '0' + _m : _m}${_d < 10 ? '0' + _d : _d}` : '';
    },

    getDateInMDDShortMonthFormat: function (date, includeYear) {
        const dateArr = date && date.replace(/T.+/, '').split('-');

        if (!dateArr || dateArr.length !== 3) {
            return null;
        }

        const [year, month, day] = dateArr;
        const dateFormatted = `${month}/${day}/${year}`;
        const newDate = new Date(dateFormatted);

        return `${this.getShortenedMonth(newDate.getMonth() + 1)} ${newDate.getDate()}${includeYear ? ` , ${newDate.getFullYear()}` : ''}`;
    },

    /**
     * Converts a Date object into a string with the format as full year
     * Use this util only when you want to display year in 4 digit format
     * @param  {Date} date - Date object to convert or string in Date.parse compatible format
     * @return {string} date string with the format: DD/MM/YYYY
     */
    getDateInFullYearFormat: function (date) {
        if (typeof date === 'string') {
            const splitted = date.split('/');
            const day = splitted[0];
            const month = splitted[1];
            const year = splitted[2].length > 2 ? splitted[2] : new Date(`01/01/${splitted[2]}`).getFullYear();

            return `${day}/${month}/${year}`;
        }

        return '';
    },

    /**
     * Converts a Date object into a string with the format as MM/DD/YY
     * @param  {Date} date - Date object to convert or string in Date.parse compatible format
     * @return {string} date string with the format: MM/DD/YYYY
     */
    getDateInMMDDYYFormat: function (date) {
        if (typeof date === 'string') {
            // eslint-disable-next-line no-param-reassign
            date = new Date(date);
        }

        const year = Number(date.getFullYear().toString().substr(2));

        return date && date instanceof Date ? `${date.getMonth() + 1}/${date.getDate()}/${year}` : '';
    },

    /**
     * Converts a Date object into a string with the format as Weekday, Month Day
     * @param  {String} dateISOformat - Date string in ISO format
     * @return {string} date string with the format: Weekday, Month Day
     */
    getDateInWeekdayMonthDayFormat: function (dateISOformat) {
        const date = this.getDateObjectFromString(dateISOformat);
        const weekday = this.getWeekdaysArray()[date.getDay()];
        const month = this.getMonthArray()[date.getMonth()];
        const day = date.getDate();

        return `${weekday}, ${month} ${day}`;
    },

    /**
     * Returns the time zone name
     * @return {string} time zone name, for instance 'America/Costa_Rica' or 'Asia/Kolkata'
     */
    getTimeZoneName: function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },

    /**
     * Returns the time zone
     * @return {string} time zone, for instance 'GMT-06:00' or 'GMT+5:30'
     */
    getFormattedTimezone: function () {
        const offset = new Date().getTimezoneOffset();
        const hourOffset = Math.abs(parseInt(offset / 60));
        const twoDigitsHour = hourOffset.toString().padStart(2, '0');
        const minuteOffset = Math.abs(offset % 60);
        const twoDigitsMinutes = minuteOffset.toString().padStart(2, '0');
        const sign = offset <= 0 ? '+' : '-';

        return `GMT${sign}${twoDigitsHour}:${twoDigitsMinutes}`;
    },

    /**
     * Format a date to ISO-8601 with timezone
     * ex: 2021-06-24T16:40:59-00:00
     * @param {Date} date date to format
     * @return {string} ISO-8601 string
     */
    formatAsISO8601WTz: function formatAsISO8601WTz(date) {
        const tzo = -date.getTimezoneOffset();
        const dif = tzo >= 0 ? '+' : '-';
        const pad = function (num) {
            const norm = Math.floor(Math.abs(num));

            return (norm < 10 ? '0' : '') + norm;
        };

        return (
            date.getFullYear() +
            '-' +
            pad(date.getMonth() + 1) +
            '-' +
            pad(date.getDate()) +
            'T' +
            pad(date.getHours()) +
            ':' +
            pad(date.getMinutes()) +
            ':' +
            pad(date.getSeconds()) +
            dif +
            pad(tzo / 60) +
            ':' +
            pad(tzo % 60)
        );
    },

    /**
     * Get the different in hours of a given date and current date
     * @param  {Date} date - JS Date object
     * @return {Number}  -amount of hours different with the given date
     */
    getDifferentInHour: function (date) {
        const currentDate = new Date(new Date().toISOString());

        let diff = (currentDate.getTime() - date.getTime()) / 1000;
        diff /= 60 * 60;

        return Math.abs(Math.round(diff));
    },

    isDataExpired: function (date) {
        if (date) {
            return new Date(date).getTime() < new Date().getTime();
        }

        return false;
    },

    getDateInMDYFormatRewards: function (date) {
        if (typeof date === 'string') {
            // eslint-disable-next-line no-param-reassign
            date = new Date(date);
        }

        return date && date instanceof Date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : '';
    },

    formatStringDateToMMDDYY: function (dateString) {
        const [year, month, day] = dateString.split('-');

        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year.slice(-2)}`;
    },

    formatBeforeDateToYYYYMMDD: function (numberOfDaysBefore) {
        const today = new Date();
        today.setDate(today.getDate() - numberOfDaysBefore);
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const date = today.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${date}`;
    },

    getDateInDMYwithTimeFormat: function (input) {
        const date = new Date(input);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedDate = `${month}/${day}/${year}, ${hours}:${minutes} ${period}`;

        return formattedDate;
    },

    /**
     * Formats a custom date string using the ISO-8601.
     * @param {date} date date in the string format "20241122T154135Z"
     * @returns {string} ISO-8601 string
     */
    restoreISO8601Format: function (date) {
        if (!date && date !== null && date !== '') {
            return '';
        }

        const year = date.slice(0, 4);
        const month = date.slice(4, 6);
        const day = date.slice(6, 8);
        const time = date.slice(9, 15);

        return `${year}-${month}-${day}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}Z`;
    },

    /**
     * Formats a given date string (ISO 8601) into a shortened date format: "M/D/YY".
     *
     * - The month and day will not have leading zeros (e.g., "3/1/25" instead of "03/01/25").
     * - The year will be displayed as two digits (e.g., "2025" becomes "25").
     *
     * @param {string} date - An ISO 8601 date string (e.g., "2024-12-31T00:00:00.000-08:00").
     * @returns {string} - The formatted date in the "M/D/YY" format, or an empty string if the input is not a valid date.
     *
     * Example:
     *
     * getDateInShortFormat("2024-12-31T00:00:00.000-08:00"); // "12/31/24"
     * getDateInShortFormat("2025-03-01T00:00:00.000-08:00"); // "3/1/25"
     *
     */
    getDateInShortFormat: function (date) {
        if (typeof date === 'string') {
            // Parse the ISO 8601 date string
            const parsedDate = new Date(date);

            // Check if the date is valid
            if (isNaN(parsedDate)) {
                return '';
            }

            const day = parsedDate.getDate(); // Day of the month without leading zero
            const month = parsedDate.getMonth() + 1; // Month (1-based, not 0-based)
            const year = parsedDate.getFullYear().toString().slice(-2); // Last two digits of the year

            // Return the date in "M/D/YY" format
            return `${month}/${day}/${year}`;
        }

        return '';
    },
    isDateInPacificDST: function (date) {
        // U.S. DST starts at 2am local time on the second Sunday in March
        // and ends at 2am local time on the first Sunday in November

        const year = date.getFullYear();

        // Second Sunday in March
        const marchStart = new Date(Date.UTC(year, 2, 8));

        while (marchStart.getUTCDay() !== 0) {
            marchStart.setUTCDate(marchStart.getUTCDate() + 1);
        }

        // First Sunday in November
        const novEnd = new Date(Date.UTC(year, 10, 1)); // November 1

        while (novEnd.getUTCDay() !== 0) {
            novEnd.setUTCDate(novEnd.getUTCDate() + 1);
        }

        // Convert the date to UTC (no user local influence)
        const utcDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
        );

        return utcDate >= marchStart && utcDate < novEnd;
    },
    getEpochSecondsFromPSTDateTime: function (selectedDate) {
        // Input: '2025-04-30T23:55:00'
        const [datePart, timePart] = selectedDate.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second = 0] = timePart.split(':').map(Number);

        // Treat this date as if it's in Pacific time
        const pstDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

        const isDST = this.isDateInPacificDST(pstDate);
        const pacificOffset = isDST ? 7 : 8; // PDT = UTC-7, PST = UTC-8

        // Convert Pacific Time to UTC by adding offset hours
        const utcDate = new Date(Date.UTC(year, month - 1, day, hour + pacificOffset, minute, second));

        return Math.floor(utcDate.getTime() / 1000);
    },

    /**
     * Gets the current date formatted as MM/DD/YYYY with zero padding
     * @return {string} Current date string in MM/DD/YYYY format (e.g., "07/05/2025")
     */
    getCurrentDateInMDYYYYFormat: function () {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const year = now.getFullYear();

        return `${month}/${day}/${year}`;
    },

    /**
     * Return true if string is in unambiguous DD/MM/YYYY form.
     * Ambiguous inputs (both parts <= 12) are treated as MDY elsewhere.
     * Examples treated as DMY: "22/08/2025", "31/1/2025"
     * Examples NOT treated as DMY: "8/22/2025", "10/11/2025"
     *
     * DMY === Day/Month/Year
     */
    isDMYDate: function (date) {
        if (typeof date !== 'string') {
            return false;
        }

        const m = date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/);

        if (!m) {
            return false;
        }

        const [dayStr, monthStr] = date.split('/');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);

        // Only treat as DMY when clearly unambiguous: day >= 13 and month within 1..12
        return day >= 13 && day <= 31 && month >= 1 && month <= 12;
    },

    /**
     * Accepts pretty much any date string (ISO, DD/MM/YYYY, or anything Date can handle)
     * and gives you a zero-padded MM/DD/YYYY string. If it can't figure it out, you'll just get back what you passed in.
     *
     * Use this when you need to normalize any date input to a consistent MM/DD/YYYY format for display or API usage.
     *
     * Examples:
     *   DateUtils.getDateInMDYFromString("2025-08-22T12:23:36-07:00") -> "08/22/2025"
     *   DateUtils.getDateInMDYFromString("22/08/2025") -> "08/22/2025"
     */
    getDateInMDYFromString: function (input) {
        // handle explicit empty values
        if (input === null || input === undefined || input === '') {
            return '';
        }

        // If already a Date object
        if (input instanceof Date && !isNaN(input)) {
            const m = String(input.getMonth() + 1).padStart(2, '0');
            const d = String(input.getDate()).padStart(2, '0');
            const y = input.getFullYear();

            return `${m}/${d}/${y}`;
        }

        if (typeof input !== 'string') {
            return '';
        }

        // If it's ISO-ish (YYYY-MM-DD or a full datetime), just make a Date and return MM/DD/YYYY with zero padding
        if (this.isISODate(input, true)) {
            let dateObj;
            try {
                dateObj = uiUtils.isIOS() ? this.convertDateForIOS(input) : new Date(input);
            } catch (e) {
                dateObj = new Date(input);
            }

            if (!isNaN(dateObj)) {
                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                const d = String(dateObj.getDate()).padStart(2, '0');
                const y = dateObj.getFullYear();

                return `${m}/${d}/${y}`;
            }
        }

        // DD/MM/YYYY input from backend -> convert to Date(year, month-1, day)
        if (this.isDMYDate(input)) {
            const [dayStr, monthStr, yearStr] = input.split('/');
            const day = parseInt(dayStr, 10);
            const month = parseInt(monthStr, 10);
            const year = parseInt(yearStr, 10);

            const dateObj = new Date(year, month - 1, day);

            if (!isNaN(dateObj)) {
                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                const d = String(dateObj.getDate()).padStart(2, '0');
                const y = dateObj.getFullYear();

                return `${m}/${d}/${y}`;
            }
        }

        // As a last attempt we can just try generic Date parsing
        const parsed = new Date(input);

        if (!isNaN(parsed)) {
            const m = String(parsed.getMonth() + 1).padStart(2, '0');
            const d = String(parsed.getDate()).padStart(2, '0');
            const y = parsed.getFullYear();

            return `${m}/${d}/${y}`;
        }

        // If nothing parses, return original input
        return input;
    }
};
