import dateUtils from 'utils/Date';
import TIMEZONES from 'utils/TimeZones';

/**
 * Use DateTZ as you would use javascript Date object
 * You can add any other Date method not yet implemented here
 *
 * If no time zone is provided, or timezone doesn't exist,
 * it defaults to local user time zone
 */

class DateTZ {
    constructor(date, timeZone) {
        this._localUserTime = new Date(date);
        this._timeZoneTime = new Date(date);
        this._timeZone = timeZone;
        this._localOffset = 0;
        this._utcOffset = 0;
        this.updateOffset();
    }

    /**
     * This method analyzes if we are in Daylight Saving Time period of the year
     * for US and CANADA only and updates the offset and time accordingly.
     *
     * Since 2007 in Canada and US, daylight saving time begins on the second Sunday of March
     * and ends on the first Sunday of November, at 2:00am on local time.
     *
     * In the future, if this rule changes we must update this method to reflect the new rule.
     */
    updateOffset() {
        const MARCH = 2;
        const NOVEMBER = 10;
        const SUNDAY = 0;

        //Assume it's standard time
        const timeZoneOffsets = (this._timeZone && TIMEZONES[this._timeZone]) || [this.getLocalTimeZoneOffset()];
        const utcLocalOffset = -this._localUserTime.getTimezoneOffset();
        let tzOffset = timeZoneOffsets[0] * 60 - utcLocalOffset;
        this._utcOffset = timeZoneOffsets[0] * 60;
        this._localOffset = tzOffset;
        this._timeZoneTime.setMinutes(this._timeZoneTime.getMinutes() + tzOffset);

        // If there's no DST in the given timezone, there's no need to adjust hours
        if (timeZoneOffsets.length < 2 || timeZoneOffsets[0] === timeZoneOffsets[1]) {
            return;
        }

        // Start of DST is 2nd Sunday of March
        const year = this._timeZoneTime.getFullYear();
        const secondSundayOfMarch = dateUtils.getNthDayOfMonth(2, SUNDAY, MARCH, year);
        const startDST = new Date(year, MARCH, secondSundayOfMarch, 2, 0, 0);

        // End of DST is first Sunday of November
        const firstSundayOfNovember = dateUtils.getNthDayOfMonth(1, SUNDAY, NOVEMBER, year);
        const endDST = new Date(year, NOVEMBER, firstSundayOfNovember, 2, 0, 0);

        // If DST is observed adjust the hour
        if (
            (dateUtils.isSameDay(this._timeZoneTime, startDST) && this._timeZoneTime.getHours() > 2) ||
            dateUtils.isDayBetween(this._timeZoneTime, startDST, endDST)
        ) {
            tzOffset = (timeZoneOffsets[1] - timeZoneOffsets[0]) * 60;
            this._timeZoneTime.setMinutes(this._timeZoneTime.getMinutes() + tzOffset);
            this._utcOffset = timeZoneOffsets[1] * 60;
            this._localOffset += tzOffset;
        }
    }

    getLocalTimeZoneOffset() {
        return -(this._localUserTime.getTimezoneOffset() / 60);
    }

    setDateTime(date) {
        this._timeZoneTime = dateUtils.clone(date);
    }

    getTime() {
        return this._timeZoneTime.getTime();
    }

    getFullYear() {
        return this._timeZoneTime.getFullYear();
    }

    getMonth() {
        return this._timeZoneTime.getMonth();
    }

    getDate() {
        return this._timeZoneTime.getDate();
    }

    getDay() {
        return this._timeZoneTime.getDay();
    }

    getHours() {
        return this._timeZoneTime.getHours();
    }

    getMinutes() {
        return this._timeZoneTime.getMinutes();
    }

    getSeconds() {
        return this._timeZoneTime.getSeconds();
    }

    getMilliseconds() {
        return this._timeZoneTime.getMilliseconds();
    }

    setTime() {
        return this._timeZoneTime.setTime();
    }

    setDate(...args) {
        return this._timeZoneTime.setDate(...args);
    }

    setMonth(...args) {
        return this._timeZoneTime.setMonth(...args);
    }

    setFullYear(...args) {
        return this._timeZoneTime.setFullYear(...args);
    }

    setHours(...args) {
        return this._timeZoneTime.setHours(...args);
    }

    setMinutes(...args) {
        return this._timeZoneTime.setMinutes(...args);
    }

    setSeconds(...args) {
        return this._timeZoneTime.setSeconds(...args);
    }

    toLocaleTimeString(...args) {
        return this._timeZoneTime.toLocaleTimeString(...args);
    }

    toLocaleString(...args) {
        return this._timeZoneTime.toLocaleString(...args);
    }

    toDateString() {
        return (
            `${dateUtils.getShortenedWeekdaysArray()[this.getDay()]} ` +
            `${dateUtils.getShortenedMonthArray()[this.getMonth()]} ` +
            `${('0' + this.getDate()).slice(-2)} ` +
            `${this.getFullYear()}`
        );
    }

    toISOString() {
        const isoDateTime = dateUtils.clone(this._timeZoneTime);
        isoDateTime.setMinutes(isoDateTime.getMinutes() - this._utcOffset);
        const isoString =
            `${isoDateTime.getFullYear()}-` +
            `${('0' + (isoDateTime.getMonth() + 1)).slice(-2)}-` +
            `${('0' + isoDateTime.getDate()).slice(-2)}T` +
            `${('0' + isoDateTime.getHours()).slice(-2)}:` +
            `${('0' + isoDateTime.getMinutes()).slice(-2)}:` +
            `${('0' + isoDateTime.getSeconds()).slice(-2)}.` +
            `${('00' + isoDateTime.getMilliseconds()).slice(-3)}Z`;

        return isoString;
    }

    toString() {
        const offset = `${('0' + Math.abs(this._utcOffset / 60)).slice(-2)}00`;
        const string =
            `${this.toDateString()} ` +
            `${('0' + this.getHours()).slice(-2)}:` +
            `${('0' + this.getMinutes()).slice(-2)}:` +
            `${('0' + this.getSeconds()).slice(-2)} ` +
            `GMT${this._utcOffset >= 0 ? '+' : '-'}${offset}`;

        return string;
    }
}

export default DateTZ;
