import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';

import { wrapComponent } from 'utils/framework';
import {
    Text, Link, Box, Divider
} from 'components/ui';
import {
    colors, fontSizes, lineHeights, space
} from 'style/config';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import bccUtils from 'utils/BCC';
import { globalModals, renderModal } from 'utils/globalModals';
import UrlUtils from 'utils/Url';

const { TERMS_OF_SERVICE, PRIVACY_POLICY, AUTO_REPLENISH_TERMS_CONDITIONS } = globalModals;
const { TERMS_OF_SERVICE_MODAL, PRIVACY_POLICY_MODAL } = bccUtils.MEDIA_IDS;
const { getLink, openLinkInNewTab } = UrlUtils;
const AUTO_REPLENISH_TERMS = '/beauty/autoreplenish-terms';
class CheckoutLegalOptIn extends BaseClass {
    showModal = (mediaId, title) => {
        const { showMediaModal } = this.props;

        showMediaModal({
            title: title,
            isOpen: true,
            mediaId: mediaId,
            modalBodyDataAt: 'bopis_info_modal'
        });
    };

    showTermsOfService = e => {
        e.preventDefault();

        if (Sephora.isAgent) {
            window.open('/beauty/terms-of-use', '_blank');
        } else {
            renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
                this.showModal(TERMS_OF_SERVICE_MODAL, this.props.termsOfService);
            });
        }
    };

    showPrivacyPolicy = e => {
        e.preventDefault();

        if (Sephora.isAgent) {
            window.open('/beauty/privacy-policy', '_blank');
        } else {
            renderModal(this.props.globalModals[PRIVACY_POLICY], () => {
                this.showModal(PRIVACY_POLICY_MODAL, this.props.privacyPolicy);
            });
        }
    };

    showNoticeOfFinancialIncentive = e => {
        e.preventDefault();
        renderModal(this.props.globalModals[PRIVACY_POLICY], () => {
            this.showModal(PRIVACY_POLICY_MODAL, this.props.noticeOfFinancialIncentive);
        });
    };

    showTermsAndConditionsGlobalModal = e => {
        e.preventDefault();
        renderModal(this.props.globalModals[AUTO_REPLENISH_TERMS_CONDITIONS], () => {
            openLinkInNewTab(getLink(AUTO_REPLENISH_TERMS));
        });
    };

    showAutoReplenishSubscriptionModal = e => {
        e.preventDefault();
        this.props.toggleModal();
    };

    render() {
        const {
            termsOfUse,
            andText,
            privacyPolicy,
            iAgreeToAutoReplenish,
            termsAndConditions,
            forTheSubscription,
            acceptAutoReplenishTerms,
            confirmVerbalConsent,
            updateAutoReplenishTerms,
            updateVerbalConsent,
            byClickingPlaceOrder,
            andConditionsOfUseHaveRead,
            confirmText,
            autoReplenishSub,
            consentText,
            autoReplenishOnly
        } = this.props;

        return (
            <>
                <Box>
                    <Checkbox
                        checked={acceptAutoReplenishTerms}
                        onClick={() => {
                            updateAutoReplenishTerms({ acceptAutoReplenishTerms: !acceptAutoReplenishTerms });
                        }}
                        data-at={Sephora.debug.dataAt('save_card_label')}
                        name='acceptAutoReplenishTerms'
                    >
                        <Text
                            is='p'
                            css={styles.checkboxText}
                        >
                            {iAgreeToAutoReplenish}
                            <Link
                                css={styles.link}
                                display='contents'
                                onClick={this.showTermsAndConditionsGlobalModal}
                            >
                                <Text
                                    fontWeight='bold'
                                    css={{ textDecoration: 'underline' }}
                                >
                                    {termsAndConditions}
                                </Text>
                            </Link>
                            {forTheSubscription}
                        </Text>
                    </Checkbox>
                </Box>

                <Box css={styles.secondParagraphContainer}>
                    <Text
                        is='p'
                        css={styles.checkboxTextSecondParagraph}
                    >
                        {byClickingPlaceOrder}
                        <Link
                            css={styles.link}
                            onClick={this.showTermsOfService}
                            children={termsOfUse}
                            underline={true}
                        />
                        {andText}
                        {andConditionsOfUseHaveRead}
                        <Link
                            css={styles.link}
                            underline={true}
                            onClick={this.showPrivacyPolicy}
                            children={privacyPolicy}
                        />
                        .
                    </Text>
                </Box>

                {Sephora.isAgent && autoReplenishOnly && (
                    <>
                        <Divider marginY={space[4]} />

                        <Box marginTop='-.375em'>
                            <Checkbox
                                checked={confirmVerbalConsent}
                                onClick={() => {
                                    updateVerbalConsent({ confirmVerbalConsent: !confirmVerbalConsent });
                                }}
                                data-at={Sephora.debug.dataAt('confirm_label')}
                                name='confirmVerbalConsent'
                            >
                                <Text
                                    is='p'
                                    css={styles.checkboxText}
                                >
                                    {confirmText}
                                    <Link
                                        css={styles.link}
                                        children={autoReplenishSub}
                                        underline={true}
                                        onClick={this.showAutoReplenishSubscriptionModal}
                                    />
                                    {consentText}
                                </Text>
                            </Checkbox>
                        </Box>
                    </>
                )}
            </>
        );
    }
}

const styles = {
    link: {
        color: `${colors.blue}`,
        fontWeight: 700
    },
    inlineLink: {
        color: `${colors.blue}`,
        textDecoration: 'underline'
    },
    checkboxText: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`
    },
    checkboxTextSecondParagraph: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`,
        ...(Sephora.isAgent ? {} : { marginTop: '7px' })
    },
    secondParagraphContainer: {
        marginTop: Sephora.isAgent ? '2.8px' : space[4],
        paddingLeft: space[0]
    }
};

CheckoutLegalOptIn.defaultProps = {};

CheckoutLegalOptIn.propTypes = {
    iAgreeToSephora: PropTypes.string.isRequired,
    termsOfService: PropTypes.string.isRequired,
    andText: PropTypes.string.isRequired,
    andConditionsOfUse: PropTypes.string.isRequired,
    privacyPolicy: PropTypes.string.isRequired,
    noticeOfFinancialIncentive: PropTypes.string.isRequired,
    iAgreeToAutoReplenish: PropTypes.string.isRequired,
    termsAndConditions: PropTypes.string.isRequired,
    forTheSubscription: PropTypes.string.isRequired,
    acceptAutoReplenishTerms: PropTypes.bool.isRequired,
    confirmVerbalConsent: PropTypes.bool.isRequired,
    updateSephoraTerms: PropTypes.func.isRequired,
    updateAutoReplenishTerms: PropTypes.func.isRequired
};

export default wrapComponent(CheckoutLegalOptIn, 'CheckoutLegalOptIn');
