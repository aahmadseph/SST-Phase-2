import React from 'react';
import { Image, Text, Container } from 'components/ui';
import { ERROR } from 'components/Campaigns/Referrer/constants';
import rwdAdvocacyPageBindings from 'analytics/bindingMethods/pages/rwdAdvocacy/rwdAdvocacyPageBindings';
import languageLocaleUtils from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacyError/locales', 'AdvocacyError');

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

const AdvocacyError = ({ error, pageType }) => {
    rwdAdvocacyPageBindings.setPageLoadAnaytics(pageType);

    const errorCode = error || ERROR.CUSTOM_ADVOCACY_DOWN;
    const headingProps = {
        is: 'h2',
        fontWeight: 'bold',
        fontSize: ['base', 'lg']
    };
    const bodyProps = {
        is: 'p',
        marginTop: 1
    };

    return (
        <Container
            marginY={7}
            paddingX={4}
        >
            <Image
                src='/img/ufe/store/list-loveless.svg'
                width={96}
                height={96}
                marginBottom={5}
            />
            <>
                {getErrorMessage(errorCode).map((errorMessage, i) => (
                    <Text
                        key={i}
                        children={errorMessage}
                        {...(i === 0 ? headingProps : bodyProps)}
                    />
                ))}
            </>
        </Container>
    );
};

export default wrapFunctionalComponent(AdvocacyError, 'AdvocacyError');
