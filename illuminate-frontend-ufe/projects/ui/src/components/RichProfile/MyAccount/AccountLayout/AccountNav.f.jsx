import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { Box, Divider, Link } from 'components/ui';

function AccountNav({ page }) {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/AccountLayout/locales', 'AccountNav');

    const NavContent = [
        {
            href: '/profile/MyAccount',
            text: getText('accountInformation'),
            isActive: page === 'account info'
        },
        {
            href: '/profile/MyAccount/AutoReplenishment',
            text: getText('autoReplenish'),
            isActive: page === 'autoReplenishment'
        },
        {
            href: '/profile/MyAccount/SameDayUnlimited',
            text: getText('sameDayUnlimited'),
            isActive: page === 'sameDayUnlimited'
        },
        {
            href: '/profile/MyAccount/Orders',
            text: getText('recentOrders'),
            isActive: page === 'recent orders'
        },
        {
            href: '/happening/reservations',
            text: getText('reservations'),
            isActive: page === 'reservations'
        },
        {
            href: '/profile/MyAccount/Addresses',
            text: getText('savedAddresses'),
            isActive: page === 'saved addresses'
        },
        {
            href: '/profile/MyAccount/PaymentMethods',
            text: getText('paymentsCredits'),
            isActive: page === 'payments'
        },
        {
            href: '/profile/MyAccount/EmailPostal',
            text: getText('emailPreferences'),
            isActive: page === 'mail prefs'
        }
    ];

    return (
        <nav aria-label={getText('accountNavigation')}>
            <Box
                is='ul'
                lineHeight='tight'
            >
                {NavContent.map((NavItem, index) => (
                    <li key={`navItem_${NavItem.href}`}>
                        {index > 0 && <Divider display={[null, 'none']} />}
                        <Link
                            display='block'
                            href={NavItem.href}
                            paddingY={[3, 2]}
                            fontWeight={NavItem.isActive && 'bold'}
                        >
                            {NavItem.text}
                        </Link>
                    </li>
                ))}
            </Box>
        </nav>
    );
}

export default wrapFunctionalComponent(AccountNav, 'AccountNav');
