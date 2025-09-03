import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Link, Text, Divider
} from 'components/ui';
import CountCircle from 'components/CountCircle';
import localeUtils from 'utils/LanguageLocale';
import { fontSizes } from 'style/config';
import MyListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import Location from 'utils/Location';

const getText = text => localeUtils.getLocaleResourceFile('components/Header/InlineLoves/locales', 'InlineLoves')(text);

const handleViewAllClick = (e, callback) => {
    const href = e?.currentTarget?.getAttribute('href');
    e.preventDefault();
    MyListsBindings.setFlyoutNextPage();

    if (href) {
        Location.navigateTo(e, href);
    }

    if (callback && typeof callback === 'function') {
        callback();
    }
};

function InlineLoveListsHeader({
    showLink,
    linkURL,
    title,
    totalNotifications,
    shouldDisplayOAFLProducts = false,
    shouldDisplaySaleProducts = false,
    isAnonymousSharable = false,
    center = false,
    fontSize = fontSizes.base,
    showDivider = true,
    isModalOpen,
    callback,
    ...props
}) {
    return (
        <Box
            paddingX={4}
            paddingTop={4}
            {...props}
        >
            <Flex
                justifyContent={center ? 'center' : 'space-between'}
                alignItems='start'
            >
                <Flex flex='1'>
                    <Text
                        is='h2'
                        fontWeight='bold'
                        display={totalNotifications > 0 && 'flex'}
                        alignItems={totalNotifications > 0 && 'center'}
                        fontSize={fontSize}
                        textAlign={'justify'}
                    >
                        {title}
                    </Text>
                    {totalNotifications > 0 && (
                        <Box
                            paddingRight={30}
                            paddingLeft={1}
                        >
                            <CountCircle
                                top={0}
                                right={0}
                                position='static'
                                key={`inlineLovesCount${totalNotifications}`}
                                children={totalNotifications}
                            />
                        </Box>
                    )}
                </Flex>
                {showLink && (
                    <Link
                        href={linkURL}
                        color='blue'
                        padding={2}
                        margin={-2}
                        onClick={e => handleViewAllClick(e, isModalOpen ? callback : null)}
                        children={getText('viewAll')}
                        data-at={Sephora.debug.dataAt('view_all_btn')}
                    />
                )}
            </Flex>
            {!isAnonymousSharable && showDivider && (
                <Divider
                    marginTop={4}
                    marginBottom={shouldDisplayOAFLProducts || shouldDisplaySaleProducts ? 4 : 3}
                />
            )}
        </Box>
    );
}

export default wrapFunctionalComponent(InlineLoveListsHeader, 'InlineLoveListsHeader');
