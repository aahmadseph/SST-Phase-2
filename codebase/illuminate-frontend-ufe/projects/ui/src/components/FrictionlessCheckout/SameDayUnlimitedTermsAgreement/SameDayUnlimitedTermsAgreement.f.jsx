import React from 'react';
import {
    Box, Text, Link, Flex
} from 'components/ui';
import * as legalConstants from 'constants/legal';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import {
    colors, space, fontWeights, fontSizes, lineHeights
} from 'style/config';
import { globalModals, renderModal } from 'utils/globalModals';
const { TERMS_AND_CONDITIONS, TERMS_OF_SERVICE, PRIVACY_POLICY } = globalModals;

const SameDayUnlimitedTermsAgreement = ({
    privacyPolicy,
    byClicking,
    updateSDUTerms,
    acceptSDUTerms,
    conditionsOfUse,
    termsOfService,
    sduTermsLink,
    agreementIntro,
    agreementDetails,
    showTermsOfServiceModal,
    showTermsAndConditionsModal,
    showPrivacyPolicyModal,
    globalModals: globalModalsData,
    isSDUProductInBasket
}) => {
    if (!isSDUProductInBasket) {
        return null;
    }

    const showTermsOfService = e => {
        e.preventDefault();

        if (Sephora.isAgent) {
            window.open(legalConstants.TEXT_TERM_LINK, '_blank');
        } else {
            renderModal(globalModalsData[TERMS_OF_SERVICE], showTermsOfServiceModal);
        }
    };

    const showPrivacyPolicy = e => {
        e.preventDefault();

        if (Sephora.isAgent) {
            window.open(legalConstants.PRIVACY_POLICY_LINK, '_blank');
        } else {
            renderModal(globalModalsData[PRIVACY_POLICY], showPrivacyPolicyModal);
        }
    };

    return (
        <Box css={styles.container}>
            <Flex>
                <Checkbox
                    onClick={() => {
                        updateSDUTerms({ acceptSDUTerms: !acceptSDUTerms });
                    }}
                    checked={acceptSDUTerms}
                    name='acceptSDUTerms'
                >
                    <Text
                        is='p'
                        css={styles.checkboxText}
                    >
                        {agreementIntro}
                        <Link
                            css={styles.link}
                            display='contents'
                            onClick={() => renderModal(globalModalsData[TERMS_AND_CONDITIONS], showTermsAndConditionsModal)}
                        >
                            <Text
                                fontWeight='bold'
                                css={{ textDecoration: 'underline' }}
                            >
                                {sduTermsLink}
                            </Text>
                        </Link>
                        {`. ${agreementDetails}`}
                    </Text>
                </Checkbox>
            </Flex>
            <Box css={styles.secondParagraphContainer}>
                <Text
                    is='p'
                    css={styles.checkboxTextSecondParagraph}
                >
                    {`${byClicking} `}
                    <Link
                        css={styles.link}
                        underline={true}
                        onClick={showTermsOfService}
                    >
                        {termsOfService}
                    </Link>
                    {` ${conditionsOfUse} `}
                    <Link
                        css={styles.link}
                        underline={true}
                        onClick={showPrivacyPolicy}
                    >
                        {privacyPolicy}
                    </Link>
                    .
                </Text>
            </Box>
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
    link: {
        color: `${colors.blue}`,
        fontWeight: 700
    },
    checkboxText: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`
    },
    checkboxTextSecondParagraph: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`,
        marginTop: space[2]
    },
    secondParagraphContainer: {
        marginTop: space[4],
        marginBottom: space[4],
        paddingLeft: space[0]
    }
};

SameDayUnlimitedTermsAgreement.defaultProps = {};

SameDayUnlimitedTermsAgreement.propTypes = {
    agreementIntro: PropTypes.string.isRequired,
    agreementDetails: PropTypes.string.isRequired,
    sduTermsLink: PropTypes.string.isRequired,
    byClicking: PropTypes.string.isRequired,
    termsOfService: PropTypes.string.isRequired,
    conditionsOfUse: PropTypes.string.isRequired,
    privacyPolicy: PropTypes.string.isRequired,
    updateSDUTerms: PropTypes.func.isRequired,
    acceptSDUTerms: PropTypes.bool.isRequired,
    showTermsOfServiceModal: PropTypes.func.isRequired,
    showTermsAndConditionsModal: PropTypes.func.isRequired,
    showPrivacyPolicyModal: PropTypes.func.isRequired,
    isSDUProductInBasket: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(SameDayUnlimitedTermsAgreement, 'SameDayUnlimitedTermsAgreement');
