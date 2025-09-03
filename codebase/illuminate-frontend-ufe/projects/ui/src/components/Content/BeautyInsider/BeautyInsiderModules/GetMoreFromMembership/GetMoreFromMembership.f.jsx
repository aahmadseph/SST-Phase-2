import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Flex, Grid, Image, Link
} from 'components/ui';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile(
    'components/Content/BeautyInsider/BeautyInsiderModules/GetMoreFromMembership/locales',
    'GetMoreFromMembership'
);

const perks = {
    community: {
        name: getText('community'),
        imageSrc: '/img/ufe/chip-community.svg',
        content1: getText('communityContent'),
        buttonDetails: {
            perkNotUsed: {
                text: getText('communityButton1'),
                link: '/community'
            },
            perkUsed: {
                text: getText('communityButton2'),
                link: '/profile/me'
            }
        }
    },
    app: {
        name: getText('app'),
        imageSrc: '/img/ufe/chip-app.svg',
        content1: getText('appContent')
    },
    creditCard: {
        name: getText('creditCard'),
        imageSrc: '/img/ufe/credit-card/credit-card.svg',
        content1: getText('creditCardContent'),
        buttonDetails: {
            perkNotUsed: {
                text: getText('creditButton1'),
                link: '/creditcard'
            },
            perkUsed: {
                text: getText('creditButton2'),
                link: '/creditcard'
            }
        }
    }
};

const renderItem = (perk, perkBeingUsed) => {
    const { name, content1, imageSrc, buttonDetails } = perks[perk];

    const usingContent = getText('usingContent');

    return (
        <Box
            boxShadow='light'
            padding={4}
            borderRadius={2}
        >
            <Flex
                alignItems='center'
                justifyContent='space-between'
            >
                <Flex
                    alignItems='center'
                    gap={3}
                >
                    <Image
                        display='block'
                        src={imageSrc}
                        size={32}
                    />
                    <Text
                        children={name}
                        fontWeight='bold'
                    />
                </Flex>
                {perkBeingUsed && (
                    <Image
                        src={'/img/ufe/checkin/green-check.svg'}
                        width={24}
                        height={24}
                    />
                )}
            </Flex>
            <Text
                is='p'
                marginTop={3}
                marginBottom={3}
                children={perkBeingUsed ? usingContent : content1}
            />
            {buttonDetails && (
                <Link
                    children={`${perkBeingUsed ? buttonDetails.perkUsed.text : buttonDetails.perkNotUsed.text} ▸`}
                    href={perkBeingUsed ? buttonDetails.perkUsed.link : buttonDetails.perkNotUsed.link}
                    fontWeight='bold'
                />
            )}
        </Box>
    );
};

const GetMoreFromMembership = ({ hasCreditCard }) => {
    return (
        <Box marginTop={[6, 7]}>
            <Text
                is='h2'
                fontWeight='bold'
                fontSize='lg'
                children={getText('getMoreFromMembership')}
            />
            <Grid
                columns={[0, 3]}
                gap={[2, 3]}
                marginTop={4}
            >
                {renderItem('community', userUtils.isSocial())}
                {renderItem('app')}
                {!localeUtils.isCanada() && renderItem('creditCard', hasCreditCard)}
            </Grid>
        </Box>
    );
};

export default wrapFunctionalComponent(GetMoreFromMembership, 'GetMoreFromMembership');
