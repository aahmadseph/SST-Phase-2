import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';

import { wrapComponent } from 'utils/framework';
import { Text, Link, Box } from 'components/ui';
import { colors, fontSizes, lineHeights } from 'style/config';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import bccUtils from 'utils/BCC';
import { globalModals, renderModal } from 'utils/globalModals';
import UrlUtils from 'utils/Url';

const { TERMS_OF_SERVICE, PRIVACY_POLICY } = globalModals;
const { TERMS_OF_SERVICE_MODAL, PRIVACY_POLICY_MODAL } = bccUtils.MEDIA_IDS;
const { getLink } = UrlUtils;
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
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            this.showModal(TERMS_OF_SERVICE_MODAL, this.props.termsOfService);
        });
    };

    showPrivacyPolicy = e => {
        e.preventDefault();
        renderModal(this.props.globalModals[PRIVACY_POLICY], () => {
            this.showModal(PRIVACY_POLICY_MODAL, this.props.privacyPolicy);
        });
    };

    showNoticeOfFinancialIncentive = e => {
        e.preventDefault();
        renderModal(this.props.globalModals[PRIVACY_POLICY], () => {
            this.showModal(PRIVACY_POLICY_MODAL, this.props.noticeOfFinancialIncentive);
        });
    };

    render() {
        const {
            termsOfService,
            andText,
            privacyPolicy,
            iAgreeToAutoReplenish,
            termsAndConditions,
            forTheSubscription,
            acceptAutoReplenishTerms,
            updateAutoReplenishTerms,
            byClickingPlaceOrder,
            andConditionsOfUseHaveRead
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
                                href={getLink(AUTO_REPLENISH_TERMS)}
                                children={termsAndConditions}
                            />
                            {forTheSubscription}
                        </Text>

                        <Text
                            is='p'
                            css={styles.checkboxTextSecondParagraph}
                        >
                            {byClickingPlaceOrder}
                            <Link
                                css={styles.link}
                                onClick={this.showTermsOfService}
                                children={termsOfService}
                            />
                            {andText}
                            {andConditionsOfUseHaveRead}
                            <Link
                                css={styles.link}
                                onClick={this.showPrivacyPolicy}
                                children={privacyPolicy}
                            />
                        </Text>
                    </Checkbox>
                </Box>
            </>
        );
    }
}

const styles = {
    link: {
        color: `${colors.blue}`
    },
    inlineLink: {
        color: `${colors.blue}`,
        display: 'inline'
    },
    checkboxText: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`
    },
    checkboxTextSecondParagraph: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`,
        marginTop: '7px'
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
    updateSephoraTerms: PropTypes.func.isRequired,
    updateAutoReplenishTerms: PropTypes.func.isRequired
};

export default wrapComponent(CheckoutLegalOptIn, 'CheckoutLegalOptIn');
