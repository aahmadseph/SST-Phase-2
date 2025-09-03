import React from 'react';
import { Text } from 'components/ui';
import FramworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

const { wrapFunctionalComponent } = FramworkUtils;

function StoreHours({ storeHoursDisplay, todayClosingTime, hasBoldedDay, displayTodayClosingTime = true }) {
    const getText = localeUtils.getLocaleResourceFile('components/Stores/StoreDetails/locales', 'StoreHours');
    const tag = hasBoldedDay ? 'b' : 'span';

    return (
        <div data-at={Sephora.debug.dataAt('store_hours')}>
            {todayClosingTime && displayTodayClosingTime && (
                <div css={{ marginBottom: '.5em' }}>
                    <b>{getText('hours')} -</b> {getText('openTodayUntil')}
                    {' ' + todayClosingTime}
                </div>
            )}
            {storeHoursDisplay &&
                storeHoursDisplay.length &&
                storeHoursDisplay.map(storeDisplay => (
                    <div
                        key={storeDisplay.dayRange}
                        data-at={Sephora.debug.dataAt('store_hours_label')}
                    >
                        <Text
                            is={tag}
                            width={65}
                        >
                            {storeDisplay.dayRange}
                        </Text>
                        : {storeDisplay.hours}
                    </div>
                ))}
        </div>
    );
}

StoreHours.defaultProps = {
    hasBoldedDay: true
};

export default wrapFunctionalComponent(StoreHours, 'StoreHours');
