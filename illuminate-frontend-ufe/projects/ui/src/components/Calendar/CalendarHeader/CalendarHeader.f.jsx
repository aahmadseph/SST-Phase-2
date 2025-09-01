import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex } from 'components/ui';
import CalendarWeekdays from 'components/Calendar/CalendarHeader/CalendarWeekdays/CalendarWeekdays';
import CalendarNavButton from 'components/Calendar/CalendarHeader/CalendarNavButton/CalendarNavButton';
import dateUtils from 'utils/Date';
import languageLocale from 'utils/LanguageLocale';

const CalendarHeader = props => {
    const renderHeader = (month, i) => {
        const {
            enableAllMonths,
            currentMonthGridIndex,
            onPrevMonthClick,
            onNextMonthClick,
            maxMonths,
            hasNavigation,
            selectedDay,
            isWeekView,
            monthsInView,
            gutter,
            isSmallView
        } = props;

        const getText = languageLocale.getLocaleResourceFile('components/Calendar/CalendarHeader/locales', 'CalendarHeader');

        const displaySelectedDay = selectedDay
            ? dateUtils.getShortenedWeekdaysArray()[selectedDay.getDay()] +
              ', ' +
              dateUtils.getShortenedMonthArray()[selectedDay.getMonth()] +
              ' ' +
              selectedDay.getDate()
            : getText('selectDay');

        return (
            <Box
                key={month.name}
                paddingX={gutter}
                width={`${hasNavigation ? 100 / monthsInView : 100}%`}
            >
                {isWeekView || (
                    <React.Fragment>
                        <Flex
                            role='heading'
                            marginY={4}
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            {(hasNavigation || enableAllMonths) && (
                                <CalendarNavButton
                                    direction='left'
                                    aria-label={getText('prev')}
                                    onClick={onPrevMonthClick}
                                    style={i !== 0 ? { visibility: 'hidden' } : null}
                                    disabled={enableAllMonths ? false : currentMonthGridIndex <= 0}
                                />
                            )}
                            <Box
                                minWidth={hasNavigation && '7em'}
                                fontWeight='bold'
                                css={{ textTransform: 'uppercase' }}
                                children={!enableAllMonths ? month.name : `${month.name} - ${month.date.getFullYear()}`}
                            />
                            {(hasNavigation || enableAllMonths) && (
                                <CalendarNavButton
                                    direction='right'
                                    aria-label={getText('next')}
                                    onClick={onNextMonthClick}
                                    style={i !== monthsInView - 1 ? { visibility: 'hidden' } : null}
                                    disabled={enableAllMonths ? false : currentMonthGridIndex >= maxMonths - monthsInView}
                                />
                            )}
                        </Flex>
                        {hasNavigation && monthsInView === 1 && (
                            <Box
                                role='heading'
                                marginBottom={4}
                                data-at={Sephora.debug.dataAt('selected_date')}
                                children={displaySelectedDay}
                            />
                        )}
                    </React.Fragment>
                )}

                {!isSmallView && (
                    <div role='rowgroup'>
                        <CalendarWeekdays isWeekView={isWeekView} />
                    </div>
                )}
            </Box>
        );
    };

    const renderNavigationHeader = () => {
        const { monthsInView, isWeekView, currentMonthGridIndex, months } = props;
        const monthsHeader = months && months.slice(currentMonthGridIndex, isWeekView ? 1 : currentMonthGridIndex + monthsInView);

        return monthsHeader.map((month, i) => {
            return renderHeader(month, i);
        });
    };

    const { hasNavigation, month } = props;

    return (
        <Flex
            role='presentation'
            textAlign='center'
            lineHeight='tight'
        >
            {hasNavigation ? renderNavigationHeader() : renderHeader(month)}
        </Flex>
    );
};

export default wrapFunctionalComponent(CalendarHeader, 'CalendarHeader');
