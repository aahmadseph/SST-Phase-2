import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Divider, Flex, Icon, Image, Text
} from 'components/ui';

import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile, isUS } = localeUtils;

const ICON_PROPS = {
    disableLazyLoad: true,
    width: 38,
    height: 24
};

const cardLogos = [
    {
        src: '/img/ufe/payments/sephora.svg',
        alt: 'Sephora'
    },
    {
        src: '/img/ufe/payments/visa.svg',
        alt: 'VISA'
    },
    {
        src: '/img/ufe/payments/masterCard.svg',
        alt: 'MasterCard'
    },
    {
        src: '/img/ufe/payments/americanExpress.svg',
        alt: 'American Express'
    },
    {
        src: '/img/ufe/payments/discover.svg',
        alt: 'Discover',
        usOnly: true
    }
];

function AddCardHeader({ handleSetShowAddNewCardForm, hasDivider, isFormHeader, isEditCard }) {
    const getText = getLocaleResourceFile(
        'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/AddCardHeader/locales',
        'AddCardHeader'
    );

    return (
        <>
            {hasDivider && <Divider />}
            <Flex
                flexDirection={'column'}
                gap={3}
            >
                {isFormHeader ? (
                    <Text
                        is={'h3'}
                        fontSize={[null, null, 'md']}
                        fontWeight={'bold'}
                        lineHeight={['18px', null, '20px']}
                        children={getText(isEditCard ? 'editCreditOrDebitCard' : 'addNewCreditOrDebitCard')}
                    />
                ) : (
                    <Flex
                        gap={3}
                        alignItems={'center'}
                        onClick={handleSetShowAddNewCardForm(true)}
                    >
                        <Icon
                            name={'plus'}
                            size={20}
                            color={'gray'}
                            alignItems={'center'}
                        />
                        <Text
                            is={'h4'}
                            fontWeight={'bold'}
                            lineHeight={'18px'}
                            children={getText('addCreditOrDebitCard')}
                        />
                    </Flex>
                )}
                {isEditCard || (
                    <Flex
                        gap={1}
                        alignItems={'center'}
                        marginLeft={!isFormHeader && 6}
                    >
                        {cardLogos.map(({ src, alt, usOnly }) =>
                            usOnly && !isUS() ? null : (
                                <Image
                                    key={alt}
                                    src={src}
                                    alt={alt}
                                    {...ICON_PROPS}
                                />
                            )
                        )}
                    </Flex>
                )}
            </Flex>
        </>
    );
}

AddCardHeader.defaultProps = {
    handleSetShowAddNewCardForm: () => {},
    hasDivider: false,
    isFormHeader: false,
    isEditCard: false
};

export default wrapFunctionalComponent(AddCardHeader, 'AddCardHeader');
