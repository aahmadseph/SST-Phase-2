import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Icon, Box } from 'components/ui';
import UserUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import analyticsUtils from 'analytics/utils';
import Location from 'utils/Location';
import NotificationDot from 'components/NotificationDot';
import Badge from 'components/Badge';
import SummaryLayoutWrapper from 'components/Content/BeautyInsider/BeautyInsiderSummary/SummaryLayoutWrapper';
import { colors } from 'style/config';

const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/MyOffers/MyOffersLink/locales', 'MyOffersLink')(text, vars);
const BEAUTY_OFFERS_LINK = '/beauty/beauty-offers?icid2=beauty%20offers%20banner%201201';

function MyOffersLink({
    offersForYou, isBlock, onDismiss, variant, ...props
}) {
    const showLink = !UserUtils.isAnonymous() && offersForYou > 0;
    const linkTextKey = offersForYou === 1 ? 'viewExclusiveOffer' : 'viewExclusiveOffers';

    return showLink ? (
        <SummaryLayoutWrapper
            variant={variant}
            isMyOffersLink={true}
            isBlock={isBlock}
            href={BEAUTY_OFFERS_LINK}
            onClick={e => {
                const nextPageData = isBlock
                    ? { linkData: 'beauty insider:view offers for you' }
                    : { navigationInfo: analyticsUtils.buildNavPath(['top nav', 'account', 'offers for you']) };
                analyticsUtils.setNextPageData(nextPageData);
                Location.navigateTo(e, BEAUTY_OFFERS_LINK);
                onDismiss && onDismiss();
            }}
            {...props}
        >
            {isBlock ? (
                <Box
                    is='span'
                    display='flex'
                    alignItems={variant === 'Card' ? ['center', null, 'flex-start'] : 'center'}
                    flexDirection={variant === 'Card' ? ['row', null, 'column'] : 'row'}
                    width='100%'
                    height='100%'
                >
                    <Icon
                        name='offers'
                        size={variant === 'Card' ? [24, null, 32] : '24'}
                        marginBottom={variant === 'Card' ? [0, null, 3] : 0}
                        marginRight={variant === 'Card' ? [2, null, 0] : 4}
                        css={{ flexShrink: 0 }}
                    />
                    {getText(linkTextKey, [offersForYou])}
                    <Box
                        display='inline'
                        marginLeft={2}
                        position={['relative', null, 'absolute']}
                        top={[null, null, 4]}
                        right={[null, null, 4]}
                        is='span'
                    >
                        <Badge
                            badge={getText('forYou')}
                            color={colors.black}
                        />
                    </Box>
                </Box>
            ) : (
                <span>{getText(linkTextKey, [offersForYou])}</span>
            )}

            {isBlock ||
                (Sephora?.configurationSettings?.isMyOffersModuleEnabled && (
                    <NotificationDot
                        top='-2px'
                        right='-2px'
                    />
                ))}
        </SummaryLayoutWrapper>
    ) : null;
}

export default wrapFunctionalComponent(MyOffersLink, 'MyOffersLink');
