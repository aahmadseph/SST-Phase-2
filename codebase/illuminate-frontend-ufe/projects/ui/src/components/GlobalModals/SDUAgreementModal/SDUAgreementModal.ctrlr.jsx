/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Modal from 'components/Modal/Modal';
import {
    Box, Text, Button, Flex, Link, Divider
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { globalModals, renderModal } from 'utils/globalModals';
import {
    colors, space, fontWeights, fontSizes
} from 'style/config';
import PlaceOrderButton from 'components/FrictionlessCheckout/PlaceOrderButton';
import SDUScriptModal from './SDUScriptModal';

const { TERMS_AND_CONDITIONS, TERMS_OF_SERVICE, PRIVACY_POLICY } = globalModals;

class SDUAgreementModal extends BaseClass {
    state = {
        acceptSduTerms: false,
        acceptAgentTerms: false,
        showSDUScriptModal: false
    };

    closeSduAgreementModal = () => {
        this.props.showSDUAgreementModal({
            isOpen: false
        });
    };

    toggleAcceptSduTerms = () => {
        this.setState(prevState => ({
            acceptSduTerms: !prevState.acceptSduTerms
        }));
    };

    toggleAcceptAgentTerms = () => {
        this.setState(prevState => ({
            acceptAgentTerms: !prevState.acceptAgentTerms
        }));
    };

    showSduTermsAndConditions = () => {
        const { globalModals: globalModalsData, showTermsAndConditionsModal } = this.props;
        renderModal(globalModalsData[TERMS_AND_CONDITIONS], showTermsAndConditionsModal);
    };

    showSduAgentScriptModal = () => {
        this.setState({ showSDUScriptModal: true });
    };

    showSduTermsOfService = () => {
        const { globalModals: globalModalsData, showTermsOfServiceModal } = this.props;
        renderModal(globalModalsData[TERMS_OF_SERVICE], showTermsOfServiceModal);
    };

    showSduPrivacyPolicy = () => {
        const { globalModals: globalModalsData, showPrivacyPolicyModal } = this.props;
        renderModal(globalModalsData[PRIVACY_POLICY], showPrivacyPolicyModal);
    };

    renderTermsLink = (text, url, clickHandler) => {
        if (Sephora.isAgent) {
            return (
                <Link
                    css={styles.link}
                    href={url}
                    target='_blank'
                >
                    {text}
                </Link>
            );
        }

        return (
            <Link
                css={styles.link}
                onClick={clickHandler}
            >
                {text}
            </Link>
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

    renderSDUAgreementModal = () => {
        const {
            isOpen,
            agree,
            toThe,
            sephoraSDU,
            agreementText,
            byClicking,
            termsOfService,
            conditionsOfUse,
            privacyPolicy,
            title,
            almostThere,
            placeOrder,
            agentConfirmPrefix,
            sameDayHyphenated,
            agentConfirmSuffix,
            cancelText
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeSduAgreementModal}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={4}
                    paddingBottom={0}
                >
                    <Text
                        is='p'
                        paddingBottom={4}
                        children={almostThere}
                    />
                    <Flex flexDirection='column'>
                        <Checkbox
                            onClick={this.toggleAcceptSduTerms}
                            checked={this.state.acceptSduTerms}
                        >
                            <Text
                                is='p'
                                fontSize='sm'
                            >
                                <Text is='span'>{agree}</Text> <Text is='span'>{toThe}</Text>{' '}
                                <Link
                                    css={styles.link}
                                    display='contents'
                                    onClick={this.showSduTermsAndConditions}
                                >
                                    <Text
                                        fontWeight='bold'
                                        css={{ textDecoration: 'underline' }}
                                    >
                                        {sephoraSDU}
                                    </Text>
                                </Link>
                                {` ${agreementText}`}
                            </Text>
                        </Checkbox>
                        <Text
                            is='p'
                            css={styles.bottomText}
                            fontSize='sm'
                        >
                            {byClicking} {this.renderTermsLink(termsOfService, '/beauty/terms-of-use', this.showSduTermsOfService)} {conditionsOfUse}{' '}
                            {this.renderTermsLink(privacyPolicy, '/beauty/privacy-policy', this.showSduPrivacyPolicy)}
                            {'.'}
                        </Text>
                    </Flex>

                    {Sephora.isAgent && (
                        <Box marginTop={4}>
                            <Divider marginY={3} />
                            <Checkbox
                                onClick={this.toggleAcceptAgentTerms}
                                checked={this.state.acceptAgentTerms}
                            >
                                <Text
                                    is='p'
                                    fontSize='sm'
                                >
                                    {agentConfirmPrefix}{' '}
                                    <Link
                                        css={styles.link}
                                        onClick={this.showSduAgentScriptModal}
                                    >
                                        {sameDayHyphenated}
                                    </Link>{' '}
                                    {agentConfirmSuffix}
                                </Text>
                            </Checkbox>
                        </Box>
                    )}
                </Modal.Body>
                <Modal.Footer
                    paddingX={0}
                    hasBorder={false}
                >
                    <Divider
                        marginTop={4}
                        css={styles.divider}
                        marginBottom={3}
                    />
                    <Box
                        maxWidth='343px'
                        marginX='auto'
                    >
                        <PlaceOrderButton
                            children={placeOrder}
                            isBopis={this.props.isBopis}
                            canCheckoutPaze={this.props.canCheckoutPaze}
                            isSDUItemInBasket={this.props.isSDUItemInBasket}
                            sduAcceptTerms={this.state.acceptSduTerms}
                            disabled={!this.state.acceptSduTerms || (Sephora.isAgent && !this.state.acceptAgentTerms)}
                            closeSDUModal={this.closeSduAgreementModal}
                        />
                        <Button
                            variant='secondary'
                            width='100%'
                            marginTop={3}
                            onClick={this.closeSduAgreementModal}
                        >
                            {cancelText}
                        </Button>
                    </Box>
                </Modal.Footer>
            </Modal>
        );
    };

    render() {
        return (
            <>
                {this.renderSDUAgreementModal()}
                {this.renderSDUScriptModal()}
            </>
        );
    }
}

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
        color: colors.blue,
        fontWeight: fontWeights.bold
    },
    divider: {
        boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)'
    }
};

export default wrapComponent(SDUAgreementModal, 'SDUAgreementModal', true);
