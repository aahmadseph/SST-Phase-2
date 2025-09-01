import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { Text } from 'components/ui';

const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = (...args) => getLocaleResourceFile('components/GreetingText/locales', 'GreetingText')(...args);

function getTimeOfDayMessage(dateObj, name) {
    if (dateObj instanceof Date === false) {
        return '';
    }

    const [h, m] = [dateObj.getHours(), dateObj.getMinutes()];
    let message = `${getText('msgGoodEvening', [name])} 🌙`; // 5:01PM-11:59PM

    if (h < 12) {
        // 12AM-11:59AM
        message = `${getText('msgGoodMorning', [name])} ☀️`;
    } else if (h < 17 || (h === 17 && m === 0)) {
        // 12PM-5PM
        message = `${getText('msgGoodAfternoon', [name])} 👋`;
    }

    return message;
}

function getDayOfWeekMessages(dateObj, name) {
    if (dateObj instanceof Date === false) {
        return [];
    }

    const dayToMessages = [
        [`${getText('msgSunday', [name])} 🎉`], // Sun
        [`${getText('msgMonday', [name])} 🙌`],
        [],
        [],
        [],
        [`${getText('msgFriday', [name])} 🎉`, `${getText('msgFriday2', [name])} 🤩`],
        [`${getText('msgSaturday', [name])} 🙌`, `${getText('msgSaturday2', [name])} 💋`]
    ];

    return dayToMessages[dateObj.getDay()];
}

function getRegularGreetingMsg(name) {
    const now = new Date();
    const allGreetings = [getTimeOfDayMessage(now, name)].concat(getDayOfWeekMessages(now, name));

    return allGreetings && allGreetings.length ? allGreetings[Math.floor(Math.random() * allGreetings.length)] : '';
}

function GreetingText({ firstName, isBirthdayGiftEligible, ...props }) {
    const name = firstName || getText('beautiful');

    return (
        <Text
            fontWeight='bold'
            children={isBirthdayGiftEligible ? `${getText('happyBday', [name])} 🎁🎂🎉` : getRegularGreetingMsg(name)}
            {...props}
        />
    );
}

export default wrapFunctionalComponent(GreetingText, 'GreetingText');
