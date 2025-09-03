import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { isUfeEnvProduction } from 'utils/Env';
import orderUtils from 'utils/Order';

const ReturnLink = function ({ orderId, shipGroups, onClickHandler, showStartAndTrackAReturn }) {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/ReturnLink/locales', 'ReturnLink');
    const locale = localeUtils.isCanada() ? (localeUtils.isFrench() ? 'FR_CA' : 'EN_CA') : 'en_US';
    const zipcode = orderUtils.getZipCode(shipGroups);
    const returnUrl = isUfeEnvProduction ? 'https://returns.narvar.com/sephora/returns' : 'https://returns-st01.narvar.qa/sephora/returns';
    let params = orderId ? '&order=' + orderId : '';
    params += zipcode !== '' ? '&dzip=' + zipcode : '';

    return (
        <Link
            color='blue'
            padding={2}
            margin={-2}
            target='_blank'
            href={`${returnUrl}?locale=${locale}${params}`}
            children={showStartAndTrackAReturn ? getText('startAndTrackAReturn') : getText('startAReturn')}
            onClick={onClickHandler}
        />
    );
};

export default wrapFunctionalComponent(ReturnLink, 'ReturnLink');
