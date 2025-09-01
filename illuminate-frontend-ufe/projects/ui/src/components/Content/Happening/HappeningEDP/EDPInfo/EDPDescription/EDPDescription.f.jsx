import React from 'react';
import framework from 'utils/framework';
import Location from 'utils/Location';
import {
    Button, Link, Flex, Text
} from 'components/ui';
import { colors, lineHeights, shadows } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import { ACTIVITY_TYPES } from 'components/Content/Happening/HappeningEDP/EDPInfo/constants';

const { wrapFunctionalComponent } = framework;
const { getLocaleResourceFile } = localeUtils;

function EDPDescription({ minHeight, edpInfo }) {
    const {
        displayName, description, price, duration, type, activityId
    } = edpInfo;

    const getText = getLocaleResourceFile('components/Content/Happening/HappeningEDP/EDPInfo/EDPDescription/locales', 'EDPDescription');

    const isServiceOnlyFeature = ACTIVITY_TYPES.SERVICE === type;
    const eventPrice = <strong>{price ? price : getText('free')}</strong>;
    const eventDuration = duration && isServiceOnlyFeature ? ` / ${duration}` : '';
    const bookAnAppointmentTargetUrl = `/happening/services/booking/${activityId}`;

    return (
        <Flex
            flexDirection={'column'}
            justifyContent={'center'}
            gap={4}
            paddingX={[null, null, 7]}
            minHeight={minHeight}
        >
            <Flex
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                gap={[2, 2, 4]}
            >
                <Text
                    is={'h1'}
                    fontSize={['lg', null, 'xl']}
                    fontWeight={'bold'}
                    lineHeight={['22px', null, '26px']}
                    children={displayName}
                />
                <Text
                    fontSize={'md'}
                    lineHeight={lineHeights.tight}
                    css={{ flexShrink: 0 }}
                >
                    {eventPrice}
                    {eventDuration}
                </Text>
            </Flex>
            <div>
                <Text
                    is={'p'}
                    color={'gray'}
                    fontSize={'sm'}
                    marginBottom={1}
                    lineHeight={lineHeights.tight}
                    children={getText('descriptionLabel')}
                />
                <Text
                    is={'p'}
                    fontSize={[null, null, 'md']}
                    lineHeight={[lineHeights.tight, null, lineHeights.base]}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
            {isServiceOnlyFeature && (
                <Flex
                    flexDirection={'column'}
                    alignItems={['center', null, 'normal']}
                    marginTop={[null, null, 2]}
                    paddingX={[4, null, 0]}
                    paddingY={[2, null, 0]}
                    gap={[2, null, 4]}
                    position={['fixed', null, 'relative']}
                    right={0}
                    bottom={['calc(var(--bottomNavHeight) - 1px)', null, 0]}
                    left={0}
                    backgroundColor={[colors.white, null, 'inherit']}
                    zIndex={['var(--layer-flyout)', null, 'auto']}
                    borderBottom={[`1px solid ${colors.lightGray}`, null, 'none']}
                    boxShadow={[shadows.light, null, 'none']}
                >
                    <Button
                        variant='primary'
                        width={['100%', null, 217]}
                        children={getText('bookAppointment')}
                        onClick={e => {
                            Location.navigateTo(e, bookAnAppointmentTargetUrl);
                        }}
                    />
                    <Link
                        color={'blue'}
                        lineHeight={lineHeights.tight}
                        href='/beauty/giftcards'
                        children={`🎁 ${getText('buyGiftCard')}`}
                    />
                </Flex>
            )}
        </Flex>
    );
}

export default wrapFunctionalComponent(EDPDescription, 'EDPDescription');
