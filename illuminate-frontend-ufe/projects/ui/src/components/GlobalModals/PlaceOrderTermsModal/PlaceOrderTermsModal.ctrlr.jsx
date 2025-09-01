import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Button, Text, Divider, Link
} from 'components/ui';
import {
    fontSizes, lineHeights, colors, fontWeights
} from 'style/config';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import CheckoutLegalOptIn from 'components/FrictionlessCheckout/AutoReplenish/CheckoutLegalOptIn';
import SameDayUnlimitedTermsAgreement from 'components/FrictionlessCheckout/SameDayUnlimitedTermsAgreement';
import PlaceOrderButton from 'components/FrictionlessCheckout/PlaceOrderButton';
import AutoReplenishSubscriptionModal from 'components/GlobalModals/PlaceOrderTermsModal/AutoReplenishSubscriptionModal';
import SDUScriptModal from 'components/GlobalModals/SDUAgreementModal/SDUScriptModal';
class PlaceOrderTermsModal extends BaseClass {
    state = {
        showAutoReplenishSubscriptionModal: false,
        sduAndArTerms: false,
        showSDUScriptModal: false
    };

    closeModal = () => {
        this.props.showPlaceOrderTermsModal(false);
    };

    renderAutoReplenishScriptModal = () => {
        const { showAutoReplenishSubscriptionModal } = this.state;

        const { localization, orderItems, orderTotal } = this.props;
        const { arSubscriptionHeader, arSubscriptionTitle, arSubscriptionScript } = localization;

        return (
            <AutoReplenishSubscriptionModal
                isOpen={showAutoReplenishSubscriptionModal}
                onClose={() => this.setState({ showAutoReplenishSubscriptionModal: false })}
                arTitle={arSubscriptionTitle}
                arHeader={arSubscriptionHeader}
                arSubscriptionScript={arSubscriptionScript}
                orderItems={orderItems}
                orderTotal={orderTotal}
            />
        );
    };

    renderSDUScriptModal = () => {
        const { showSDUScriptModal } = this.state;
        const { sduScriptTitle, sduScriptHeader, sduScript } = this.props;

        return (
            <SDUScriptModal
                isOpen={showSDUScriptModal}
                onClose={() => this.setState({ showSDUScriptModal: false })}
                sduScriptTitle={sduScriptTitle}
                sduScriptHeader={sduScriptHeader}
                sduScript={sduScript}
            />
        );
    };

    renderAutoReplenishSubscriptionModal = () => {
        const {
            isOpen, localization, acceptAutoReplenish, autoReplenishOnly, confirmVerbalConsent, acceptSDUTerms
        } = this.props;

        const handleDisableState = () => {
            const hasAllTermsAccepted = acceptSDUTerms && this.state.sduAndArTerms && acceptAutoReplenish;

            if (autoReplenishOnly) {
                if (Sephora.isAgent) {
                    return !(acceptAutoReplenish && confirmVerbalConsent);
                }

                return !acceptAutoReplenish;
            } else {
                if (Sephora.isAgent) {
                    return !hasAllTermsAccepted;
                }

                return !(acceptSDUTerms && acceptAutoReplenish);
            }
        };

        const onCheckboxToggle = () => {
            this.setState({ sduAndArTerms: !this.state.sduAndArTerms });
        };

        const showAutoReplenishSubscriptionModal = () => {
            this.setState({ showAutoReplenishSubscriptionModal: true });
        };

        const triggerSDUModal = () => {
            this.setState({ showSDUScriptModal: true });
        };

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeModal}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{autoReplenishOnly ? localization.arOnlyTitle : localization.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={4}
                    paddingBottom={4}
                >
                    <Text
                        is='p'
                        children={autoReplenishOnly ? localization.arOnlyText : localization.text}
                        paddingBottom={3}
                    />
                    <SameDayUnlimitedTermsAgreement />
                    <CheckoutLegalOptIn
                        toggleModal={showAutoReplenishSubscriptionModal}
                        autoReplenishOnly={autoReplenishOnly}
                    />
                    {Sephora.isAgent && !autoReplenishOnly && (
                        <>
                            <Divider marginY={4} />
                            <Checkbox
                                onClick={onCheckboxToggle}
                                checked={this.state.sduAndArTerms}
                                name='acceptSDUandARTerms'
                            >
                                <Text
                                    is='p'
                                    css={styles.checkboxText}
                                >
                                    {localization.arsduText}
                                    <Link
                                        css={styles.link}
                                        display='contents'
                                        onClick={triggerSDUModal}
                                    >
                                        <Text
                                            fontWeight='bold'
                                            css={styles.underline}
                                        >
                                            {localization.sduLink}
                                        </Text>
                                    </Link>
                                    {localization.and}
                                    <Link
                                        css={styles.link}
                                        display='contents'
                                        onClick={showAutoReplenishSubscriptionModal}
                                    >
                                        <Text
                                            fontWeight='bold'
                                            css={styles.underline}
                                        >
                                            {localization.arLink}
                                        </Text>
                                    </Link>
                                    {localization.arsduText2}
                                </Text>
                            </Checkbox>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer
                    paddingX={4}
                    paddingTop={4}
                    css={styles.footer}
                >
                    <PlaceOrderButton
                        disabled={handleDisableState()}
                        acceptAutoReplenish={acceptAutoReplenish}
                        children={localization.placeOrder}
                        width='100%'
                        marginBottom={4}
                        isBopis={false}
                    />

                    <Button
                        variant='secondary'
                        width='100%'
                        onClick={this.closeModal}
                        children={localization.cancel}
                        marginTop={4}
                    />
                </Modal.Footer>
            </Modal>
        );
    };

    render() {
        return (
            <>
                {this.renderAutoReplenishSubscriptionModal()}
                {this.renderAutoReplenishScriptModal()}
                {this.renderSDUScriptModal()}
            </>
        );
    }
}

const styles = {
    underline: {
        textDecoration: 'underline'
    },
    link: {
        color: `${colors.link}`,
        fontWeight: fontWeights.bold
    },
    checkboxText: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.tight}`
    },
    footer: {
        boxShadow: '0px 0px 6px 0px #00000033'
    }
};

export default wrapComponent(PlaceOrderTermsModal, 'PlaceOrderTermsModal', true);
