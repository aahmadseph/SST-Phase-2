import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Grid } from 'components/ui';
import Select from 'components/Inputs/Select/Select';
import FormValidator from 'utils/FormValidator';
import Date from 'utils/Date';
import ErrorMsg from 'components/ErrorMsg';
import localeUtils from 'utils/LanguageLocale';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import dateUtils from 'utils/Date';

class BiBirthdayForm extends BaseClass {
    constructor(props) {
        super(props);

        const biData = this.props.biData;
        this.state = {
            biFormError: null,
            biMonth: `${biData?.bMon || biData?.birthMonth || ''}`,
            biDay: `${biData?.bDay || biData?.birthDay || ''}`,
            biYear: (biData && biData.bYear) || (this.props.ageLimit ? '' : '1804'),
            monthInvalid: false,
            dayInvalid: false,
            yearInvalid: false,
            ageLimit: null
        };
    }

    handleMonthSelect = e => {
        this.setState({
            biMonth: parseInt(e.target.value) || undefined,
            monthInvalid: false,
            biFormError: null
        });
    };

    handleDaySelect = e => {
        this.setState({
            biDay: parseInt(e.target.value) || undefined,
            dayInvalid: false,
            biFormError: null
        });
    };

    handleYearSelect = e => {
        this.setState({
            biYear: parseInt(e.target.value) || undefined,
            yearInvalid: false,
            biFormError: null
        });
    };

    getMonth = () => {
        return this.state.biMonth;
    };

    getDay = () => {
        return this.state.biDay;
    };

    getYear = () => {
        return this.state.biYear;
    };

    getBIFormError = () => {
        return this.state.biFormError;
    };

    getBirthday = asString => {
        let birthday;

        const biDay = this.state.biDay;
        const biDayStr = biDay < 10 ? '0' + biDay : biDay;

        const biMonth = this.state.biMonth;
        const biMonthStr = biMonth < 10 ? '0' + biMonth : biMonth;

        if (asString) {
            birthday = `${this.state.biYear}/${biMonthStr}/${biDayStr}`;
        } else {
            birthday = {
                birthMonth: this.state.biMonth,
                birthDay: this.state.biDay,
                birthYear: this.state.biYear
            };
        }

        return birthday;
    };

    setBirthday = date => {
        this.setState({
            biMonth: date.birthMonth,
            biDay: date.birthDay,
            biYear: date.birthYear
        });
    };

    clearBirthday = () => {
        this.setState(
            {
                biMonth: '',
                biDay: '',
                biYear: ''
            },
            this.resetErrorState
        );
    };

    setErrorState = (message, checkBirthday, isJoinBIError, ageLimitNotMet) => {
        if (ageLimitNotMet) {
            this.setState({
                biFormError: message,
                monthInvalid: true,
                dayInvalid: true,
                yearInvalid: true
            });
        } else if (checkBirthday) {
            const biMonthValue = this.state.biMonth;
            const biDayValue = this.state.biDay;
            const biYearValue = this.state.biYear;
            this.setState({
                biFormError: message,
                monthInvalid: !biMonthValue,
                dayInvalid: !biDayValue,
                yearInvalid: !biYearValue
            });
        } else if (isJoinBIError) {
            this.setState({ biFormError: message });
        } else {
            this.setState({
                biFormError: message,
                monthInvalid: true,
                dayInvalid: true
            });
        }
    };

    resetErrorState = () => {
        this.setState({
            biFormError: null,
            monthInvalid: false,
            dayInvalid: false,
            yearInvalid: false
        });
    };

    validateErrorWithCode = () => {
        const { biMonth, biDay, biYear } = this.state;
        const ageLimit = this.props.ageLimit;

        if ((!biDay || !biMonth || (ageLimit && !biYear)) && this.props.isRequired) {
            return ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY;
        }

        const age = dateUtils.getAgeInYears(dateUtils.getDateFromMDY(biMonth, biDay, biYear));

        if (ageLimit && age < ageLimit) {
            return ErrorConstants.ERROR_CODES.AGE_LIMIT_18;
        }

        return null;
    };

    showError = (message, value, errorCode) => {
        switch (errorCode) {
            case ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY: {
                this.setErrorState(message, true, false, false);

                break;
            }
            case ErrorConstants.ERROR_CODES.AGE_LIMIT_18: {
                this.setErrorState(message, false, false, true);

                break;
            }
            default:
        }
    };

    validateForm = doNotClearErrors => {
        const fieldComps = this.props.ageLimit ? [this] : [];

        if (!this.props.ageLimit) {
            fieldComps.push(this.biDay, this.biMonth);
        }

        if (!doNotClearErrors) {
            this.resetErrorState();
        }

        ErrorsUtils.collectClientFieldErrors(fieldComps);

        return !ErrorsUtils.validate(fieldComps);
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/BiRegisterForm/BiBirthdayForm/locales', 'BiBirthdayForm');

        const {
            disabled, isRequired, hideAsterisk, hideFormError, ageLimit
        } = this.props;

        return (
            <>
                <Grid
                    gap={4}
                    columns={ageLimit ? 3 : 2}
                >
                    <Select
                        marginBottom={null}
                        name='biRegMonth'
                        disabled={disabled}
                        autoComplete='bday-month'
                        value={this.state.biMonth}
                        onChange={this.handleMonthSelect}
                        invalid={this.state.monthInvalid}
                        required={isRequired}
                        hideAsterisk={hideAsterisk}
                        ref={comp => (this.biMonth = comp)}
                        possibleErrorCodes={[ErrorConstants.ERROR_CODES.JOIN_BI_MONTH]}
                        validateError={biMonth => {
                            if (FormValidator.isEmpty(biMonth) || biMonth === '0') {
                                return ErrorConstants.ERROR_CODES.JOIN_BI_MONTH;
                            }

                            return null;
                        }}
                        label={getText('month')}
                    >
                        {[''].concat(Date.getMonthArray()).map((name, index) =>
                            Sephora.isDesktop() ? (
                                <option
                                    key={(index - 1).toString()}
                                    value={index}
                                >
                                    {name}
                                </option>
                            ) : (
                                name && (
                                    <option
                                        key={(index - 1).toString()}
                                        value={index}
                                    >
                                        {name}
                                    </option>
                                )
                            )
                        )}
                    </Select>
                    <Select
                        marginBottom={null}
                        name='biRegDay'
                        disabled={disabled}
                        autoComplete='bday-day'
                        value={this.state.biDay}
                        onChange={this.handleDaySelect}
                        invalid={this.state.dayInvalid}
                        required={isRequired}
                        hideAsterisk={hideAsterisk}
                        ref={comp => (this.biDay = comp)}
                        possibleErrorCodes={[ErrorConstants.ERROR_CODES.JOIN_BI_DATE]}
                        validateError={biDay => {
                            if (FormValidator.isEmpty(biDay)) {
                                return ErrorConstants.ERROR_CODES.JOIN_BI_DATE;
                            }

                            return null;
                        }}
                        label={getText('day')}
                    >
                        {[''].concat(Date.getDayArray()).map(day =>
                            Sephora.isDesktop() ? (
                                <option
                                    key={day}
                                    value={day}
                                >
                                    {day}
                                </option>
                            ) : (
                                day && (
                                    <option
                                        key={day}
                                        value={day}
                                    >
                                        {day}
                                    </option>
                                )
                            )
                        )}
                    </Select>
                    {ageLimit && (
                        <Select
                            marginBottom={null}
                            name='biRegYear'
                            disabled={disabled}
                            autoComplete='bday-year'
                            value={this.state.biYear}
                            onChange={this.handleYearSelect}
                            invalid={this.state.yearInvalid}
                            required={isRequired}
                            label={getText('year')}
                        >
                            {[''].concat(Date.getYearArray()).map(year => (
                                <option
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </option>
                            ))}
                        </Select>
                    )}
                </Grid>

                {this.state.biFormError !== null && !hideFormError && (
                    <ErrorMsg
                        marginTop={2}
                        marginBottom={null}
                        children={this.state.biFormError}
                    />
                )}
            </>
        );
    }
}

export default wrapComponent(BiBirthdayForm, 'BiBirthdayForm');
