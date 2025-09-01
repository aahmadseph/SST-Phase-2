import React from 'react';
import {
    Box, Text, Link, Flex
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import {
    colors, space, fontWeights, fontSizes
} from 'style/config';
import { globalModals, renderModal } from 'utils/globalModals';

const { TERMS_AND_CONDITIONS, TERMS_OF_SERVICE, PRIVACY_POLICY } = globalModals;

const SDUAgreement = ({
    agree,
    sephoraSDU,
    privacyPolicy,
    byClicking,
    updateSDUTerms,
    acceptSDUTerms,
    agreementText,
    conditionsOfUse,
    termsAndConditions,
    termsOfService,
    showTermsOfServiceModal,
    showTermsAndConditionsModal,
    showPrivacyPolicyModal,
    globalModals: globalModalsData
}) => {
    return (
        <Box css={styles.container}>
            <Flex>
                <Checkbox
                    onClick={() => {
                        updateSDUTerms({ acceptSDUTerms: !acceptSDUTerms });
                    }}
                    checked={acceptSDUTerms}
                >
                    <Text is='p'>
                        {`${agree} `}
                        <Text
                            is='span'
                            css={styles.bold}
                        >
                            {`${sephoraSDU} `}
                        </Text>
                        <Link
                            css={styles.link}
                            onClick={() => renderModal(globalModalsData[TERMS_AND_CONDITIONS], showTermsAndConditionsModal)}
                        >
                            {termsAndConditions}
                        </Link>
                        {`. ${agreementText}`}
                    </Text>
                </Checkbox>
            </Flex>
            <Text
                is='p'
                css={styles.bottomText}
            >
                {`${byClicking} `}
                <Link
                    css={styles.link}
                    onClick={() => renderModal(globalModalsData[TERMS_OF_SERVICE], showTermsOfServiceModal)}
                >
                    {termsOfService}
                </Link>
                {` ${conditionsOfUse} `}
                <Link
                    css={styles.link}
                    onClick={() => renderModal(globalModalsData[PRIVACY_POLICY], showPrivacyPolicyModal)}
                >
                    {privacyPolicy}
                </Link>
                .
            </Text>
        </Box>
    );
};

const styles = {
    container: {
        fontSize: fontSizes.sm
    },
    bold: {
        fontWeight: fontWeights.bold
    },
    bottomText: {
        marginTop: space[3]
    },
    link: {
        textDecoration: 'underline',
        color: colors.blue
    }
};

SDUAgreement.defaultProps = {};

SDUAgreement.propTypes = {
    agree: PropTypes.string.isRequired,
    sephoraSDU: PropTypes.string.isRequired,
    termsAndConditions: PropTypes.string.isRequired,
    agreementText: PropTypes.string.isRequired,
    byClicking: PropTypes.string.isRequired,
    termsOfService: PropTypes.string.isRequired,
    conditionsOfUse: PropTypes.string.isRequired,
    privacyPolicy: PropTypes.string.isRequired,
    updateSDUTerms: PropTypes.func.isRequired,
    acceptSDUTerms: PropTypes.bool.isRequired,
    showTermsOfServiceModal: PropTypes.func.isRequired,
    showTermsAndConditionsModal: PropTypes.func.isRequired,
    showPrivacyPolicyModal: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(SDUAgreement, 'SDUAgreement');
