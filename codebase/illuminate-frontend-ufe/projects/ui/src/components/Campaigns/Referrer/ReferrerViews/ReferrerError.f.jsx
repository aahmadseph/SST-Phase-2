import React from 'react';
import {
    Box, Image, Text, Button
} from 'components/ui';
import { ERROR } from 'components/Campaigns/Referrer/constants';
import languageLocaleUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';
import { wrapFunctionalComponent } from 'utils/framework';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/Campaigns/Referrer/locales', 'Referrer');

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case ERROR.ERR_CAMP_REF_CMP_NOT_STARTED:
            return [getText('errorCampaignHasntStarted')];
        case ERROR.ERR_CAMP_REF_CMP_EXPIRED:
            return [getText('errorCampaignExpired')];
        case ERROR.ERR_CAMP_REF_MAX_COUNT_RCHD:
            return [getText('errorMaxCount1'), getText('errorMaxCount2')];
        case ERROR.ERR_CAMP_REF_INVALID:
        case ERROR.ERR_CE_CMP_NOT_FOUND:
            return [getText('errorInvalidCampaign')];
        case ERROR.ERR_CAMP_REF_INVALID_COUNTRY:
            return [getText('errorInvalidCountry')];
        case ERROR.ERR_CAMP_REFEREE_ALREADY_REGISTERED:
            return [getText('errorRefereeAlreadyRegisteredLine1'), getText('errorRefereeAlreadyRegisteredLine2')];
        case ERROR.ERR_CAMP_REFEREE_MAX_COUNT_RCHD:
            return [getText('errorRefereeMaxCountReachedLine1'), getText('errorRefereeMaxCountReachedLine2')];
        case ERROR.ERR_CAMP_REFERRER_SELF_REGISTRATION_NOT_ALLOWED:
            return [getText('selfRegistrationNotAllowedLine1'), getText('selfRegistrationNotAllowedLine2')];
        case ERROR.CUSTOM_ALREADY_BI:
            return [getText('errorAlreadyBI')];
        case ERROR.CUSTOM_BI_DOWN:
            return [getText('errorBiDown'), getText('errorGenericDescription')];
        case ERROR.CUSTOM_ADVOCACY_DOWN:
        default:
            return [getText('errorAdvocacyDown'), getText('errorGenericDescription')];
    }
}

const ErrorMessage = ({ errors, handleShopNowClick }) => {
    const errorCode = errors?.errorCode || ERROR.CUSTOM_ADVOCACY_DOWN;
    digitalData.page.pageInfo.pageName = `${anaConsts.PAGE_NAMES.ADV_CAMPAIGNS}-error`;
    digitalData.page.category.pageType = anaConsts.PAGE_TYPES.ADV_REFERRER;
    const isDesktop = Sephora.isDesktop();

    return (
        <Box
            marginX='auto'
            textAlign='center'
            maxWidth={500}
        >
            <Image
                src='/img/ufe/store/list-loveless.svg'
                display='block'
                marginX='auto'
                width={128}
                height={128}
                marginY={6}
            />
            <React.Fragment>
                {getErrorMessage(errorCode).map((errorMessage, i) => (
                    <Text
                        key={i}
                        is='p'
                        data-at={Sephora.debug.dataAt(`promo_error_message_${i === 0 ? 'first' : 'second'}_line`)}
                        fontWeight={i === 0 && 'bold'}
                        children={errorMessage}
                    />
                ))}
            </React.Fragment>
            <Button
                marginTop={5}
                variant='primary'
                block={!isDesktop}
                data-at={Sephora.debug.dataAt('shop_now_btn')}
                hasMinWidth={isDesktop}
                onClick={handleShopNowClick}
                children={getText('shopNow')}
            />
        </Box>
    );
};

export default wrapFunctionalComponent(ErrorMessage, 'ErrorMessage');
