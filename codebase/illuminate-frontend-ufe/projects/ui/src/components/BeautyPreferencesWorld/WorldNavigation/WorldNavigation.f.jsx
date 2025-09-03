import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import SimpleBreadCrumbs from 'components/SimpleBreadCrumbs/SimpleBreadCrumbs';
import Location from 'utils/Location';
import languageLocale from 'utils/LanguageLocale';

const getText = languageLocale.getLocaleResourceFile('components/BeautyPreferencesRedesigned/Header/locales', 'BeautyPreferencesHeader');

const navigateToBeautyPreferences = e => {
    const href = e?.currentTarget?.getAttribute('href');

    if (href) {
        Location.navigateTo(e, href);
    }
};

function WorldNavigation({ worldName }) {
    const navigationItems = [
        {
            displayName: getText('beautyPreferencesTitle'),
            href: '/profile/BeautyPreferences',
            onClick: navigateToBeautyPreferences
        },
        { displayName: worldName }
    ];

    return (
        <SimpleBreadCrumbs
            marginTop={[4, null, 5]}
            marginBottom={4}
            lastItemTagName='span'
            items={navigationItems}
            invertColor
        />
    );
}

export default wrapFunctionalComponent(WorldNavigation, 'WorldNavigation');
