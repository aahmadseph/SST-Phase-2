import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Button, Flex
} from 'components/ui';
import auth from 'utils/Authentication';
import analyticsConstants from 'analytics/constants';
import anaUtils from 'analytics/utils';
import { HEADER_VALUE } from 'constants/authentication';

import localeUtils from 'utils/LanguageLocale';

function signInHandler(e, anaData) {
    e.stopPropagation();
    auth.requireAuthentication(null, null, anaData, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
}

function EmptyCart({ isSignedIn, showBasketGreyBackground, backgroundColor }) {
    const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/EmptyCart/locales', 'EmptyCart');

    return (
        <Flex
            flexDirection={'column'}
            alignItems={['start', 'center']}
            borderRadius={2}
            lineHeight='tight'
            boxShadow='light'
            padding={[4, 7]}
            {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
        >
            <Text
                is='p'
                fontWeight={'bold'}
                fontSize={['md', 'lg']}
                data-at={Sephora.debug.dataAt('empty_basket_message')}
            >
                {getText('emptyBasketMessage')}
            </Text>
            {!isSignedIn && (
                <Text
                    is='p'
                    marginTop={2}
                    fontSize={'base'}
                    data-at={Sephora.debug.dataAt('items_section_sign_in_message')}
                >
                    {getText('pleaseSignIn')}
                </Text>
            )}
            <Box
                marginTop={[4, 5]}
                width={'100%'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
            >
                {isSignedIn ? (
                    <Button
                        display={'flex'}
                        width={['100%', '30%']}
                        variant='primary'
                        href='/new-beauty-products'
                        hasMinWidth={true}
                        onClick={() => anaUtils.setNextPageData({ linkData: 'basket:shop-new-arrivals' })}
                    >
                        {getText('shopNewArrivals')}
                    </Button>
                ) : (
                    <Button
                        display={'flex'}
                        width={['100%', '30%']}
                        variant='primary'
                        css={{ textTransform: 'capitalize' }}
                        hasMinWidth={true}
                        data-at={Sephora.debug.dataAt('items_section_sign_in_button')}
                        onClick={e => signInHandler(e, { linkData: analyticsConstants.LinkData.EMPTY_BASKET_SIGN_IN })}
                    >
                        {getText('signInText')}
                    </Button>
                )}
            </Box>
        </Flex>
    );
}

export default wrapFunctionalComponent(EmptyCart, 'EmptyCart');
