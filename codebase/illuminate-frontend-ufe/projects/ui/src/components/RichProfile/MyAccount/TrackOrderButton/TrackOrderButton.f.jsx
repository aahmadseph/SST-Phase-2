/* eslint-disable max-len */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Button } from 'components/ui';
import OrderUtils from 'utils/Order';
import UrlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';

const TrackOrderButton = function ({ url, status }) {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TrackOrderButton/locales', 'TrackOrderButton');

    const isActive = OrderUtils.isActive(status);
    const isDisabled = OrderUtils.isDisabled(status);
    const isDelivered = OrderUtils.isDelivered(status);
    const isCanceled = OrderUtils.isCanceled(status);

    return (
        <div>
            <Button
                variant={isDelivered ? 'secondary' : 'primary'}
                block={true}
                data-at={Sephora.debug.dataAt('track_order')}
                onClick={() => UrlUtils.openLinkInNewTab(url)}
                disabled={isDisabled}
                children={getText(isDelivered ? 'viewTrackingInfo' : 'track')}
            />
            {isActive || isDelivered || (
                <Text
                    is='p'
                    fontSize='sm'
                    lineHeight='tight'
                    marginTop='.5em'
                    color='gray'
                    textAlign='center'
                    children={isCanceled ? getText('trackCanceled') : getText('trackUnavailable')}
                />
            )}
        </div>
    );
};

export default wrapFunctionalComponent(TrackOrderButton, 'TrackOrderButton');
