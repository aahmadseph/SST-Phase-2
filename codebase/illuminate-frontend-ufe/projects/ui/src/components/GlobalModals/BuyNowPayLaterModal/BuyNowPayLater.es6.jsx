/* eslint-disable eqeqeq */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    modal, space, colors, mediaQueries, letterSpacings, borders, fontSizes
} from 'style/config';
import {
    Box, Button, Link, Image, Text, Flex
} from 'components/ui';
import Chiclet from 'components/Chiclet';
import Modal from 'components/Modal/Modal';
import BuyNowPayLaterContent from 'components/GlobalModals/BuyNowPayLaterModal/BuyNowPayLaterContent';
import { PAYMENT_METHODS, TERMS_AND_CONDITIONS_LINKS } from 'constants/PaymentMethods';
import localeUtils from 'utils/LanguageLocale';

const { KLARNA, AFTERPAY, PAYPAL } = PAYMENT_METHODS;

const styles = {
    termsText: {
        marginTop: letterSpacings[3],
        fontSize: fontSizes.sm + 'px'
    },
    termsLink: {
        marginLeft: letterSpacings[3],
        color: colors.blue,
        fontSize: fontSizes.sm + 'px',
        textDecoration: 'underline'
    },
    paymentTabsContainer: { padding: modal.paddingSm, gap: space[2], borderBottom: `${borders[1]} ${colors.lightGray}` },
    paymentTab: {
        minWidth: '25%',
        justifyContent: 'center',
        [mediaQueries.xsMax]: {
            minWidth: '33%'
        }
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        borderTop: `${borders[1]} ${colors.lightGray}`,
        padding: `${modal.paddingSm}px`
    },
    actionFooter: {
        marginBottom: '2',
        [mediaQueries.xsMax]: {
            display: 'flex',
            width: '100%'
        },
        [mediaQueries.sm]: {
            minWidth: '10em'
        }
    }
};

function setAfterpayImgValues(isLarge) {
    const isCanada = localeUtils.isCanada();
    const logoSrc = isCanada ? '/img/ufe/logo-afterpay.svg' : '/img/ufe/logo-afterpay-us.svg';
    const width = isCanada ? (isLarge ? 149 : 66) : isLarge ? 194 : 77;
    const height = isCanada ? (isLarge ? 44 : 12) : isLarge ? 47 : 18.65;

    return { logoSrc, width, height };
}

function PaymentLogo({ paymentMethod, isLarge }) {
    const { logoSrc, width, height } = setAfterpayImgValues(isLarge);
    const isCanada = localeUtils.isCanada();
    const paymentLogos = {
        [KLARNA]: (
            <Image
                disableLazyLoad={true}
                src='/img/ufe/logo-klarna.svg'
                alt='Klarna'
                width={isLarge ? 126 : 42}
                height={isLarge ? 44 : 10}
                css={{
                    padding: isLarge ? '12px 21px' : '0',
                    backgroundColor: isLarge ? colors.babyPink : '',
                    borderRadius: isLarge ? '40px' : '0'
                }}
            />
        ),
        [AFTERPAY]: (
            <Image
                disableLazyLoad={true}
                src={logoSrc}
                alt='afterpay'
                width={width}
                height={height}
                css={{
                    padding: isLarge && isCanada ? '12px 21px' : '0',
                    backgroundColor: isLarge && isCanada ? colors.paleTurquoise : '',
                    borderRadius: isLarge && isCanada ? '40px' : '0',
                    position: 'relative',
                    top: 3
                }}
            />
        ),
        [PAYPAL]: (
            <Image
                disableLazyLoad={true}
                src='/img/ufe/logo-paypal.svg'
                alt='paypal'
                width={isLarge ? 123 : 53}
                height={isLarge ? 44 : 15}
                css={{
                    padding: isLarge ? '12px 21px' : '0',
                    backgroundColor: isLarge ? colors.goldenYellow : '',
                    borderRadius: isLarge ? '40px' : '0',
                    position: 'relative',
                    top: 1
                }}
            />
        )
    };

    return paymentLogos[paymentMethod] || null;
}

class BuyNowPayLater extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedPaymentMethod: props.selectedPaymentMethod || PAYMENT_METHODS.KLARNA
        };
    }

    getPaymentTerms(paymentMethod) {
        const { getText } = this.props;
        const paymentTerms = {
            [KLARNA]: (
                <Text
                    is='p'
                    css={styles.termsText}
                >
                    {getText('klarnaTerms')}
                    <Link
                        href={TERMS_AND_CONDITIONS_LINKS[KLARNA]}
                        target='_blank'
                        css={styles.termsLink}
                        data-at={Sephora.debug.dataAt('klarna_terms')}
                        children={getText('klarnaTermsLink')}
                    />
                </Text>
            ),
            [AFTERPAY]: (
                <>
                    <Box>
                        <Text
                            is='p'
                            css={styles.termsText}
                        >
                            {getText('afterpayTerms')}
                        </Text>
                        <Text
                            is='p'
                            css={styles.termsText}
                        >
                            {getText('afterpayTerms2')}
                            <Link
                                href={TERMS_AND_CONDITIONS_LINKS[AFTERPAY]}
                                target='_blank'
                                css={styles.termsLink}
                                data-at={Sephora.debug.dataAt('afterpay_terms')}
                                children={getText('afterpayTermsLink')}
                            />
                            {' ' + getText('afterpayTerms3')}
                        </Text>
                        <Text
                            is='p'
                            css={styles.termsText}
                        >
                            {getText('afterpayTerms4')}
                        </Text>
                    </Box>
                    <Text
                        is='p'
                        css={styles.termsText}
                    >
                        {getText('afterpayTerms5')}
                    </Text>
                </>
            ),
            [PAYPAL]: (
                <Text
                    is='p'
                    css={styles.termsText}
                >
                    {getText('paypalTerms')}{' '}
                    <Link
                        href={TERMS_AND_CONDITIONS_LINKS[PAYPAL]}
                        target='_blank'
                        css={styles.termsLink}
                        data-at={Sephora.debug.dataAt('paypal_terms')}
                        children={getText('paypalTermsLink')}
                    />{' '}
                    {getText('paypalTerms2')}
                </Text>
            )
        };

        return paymentTerms[paymentMethod] || null;
    }

    gePaymentTabs() {
        const { showAfterpay, showKlarna, showPaypal } = this.props;
        const flags = {
            [KLARNA]: showKlarna,
            [AFTERPAY]: showAfterpay,
            [PAYPAL]: showPaypal
        };

        const paymentsTabs = Object.entries(flags).map(
            ([paymentMethod, display]) =>
                display && (
                    <Chiclet
                        key={paymentMethod}
                        onClick={() => this.setState({ selectedPaymentMethod: paymentMethod })}
                        isActive={this.state.selectedPaymentMethod === paymentMethod}
                        children={<PaymentLogo paymentMethod={paymentMethod} />}
                        css={styles.paymentTab}
                    />
                )
        );

        return paymentsTabs;
    }

    getPaymentsContent() {
        const { getText, installmentValue, totalAmount } = this.props;
        const paymentMethod = this.state.selectedPaymentMethod;
        const paymentMethods = [KLARNA, AFTERPAY, PAYPAL];
        const key = paymentMethods.find(method => method === paymentMethod) || KLARNA;
        const subtitle = key === PAYMENT_METHODS.PAYPAL ? getText(`${key}Subtitle`, [totalAmount, installmentValue]) : null;

        const instructionsKey = (() => {
            if (key === PAYMENT_METHODS.AFTERPAY) {
                const inst = localeUtils.isUS() ? 'afterpayUSInstructions' : 'afterpayInstructions';

                return inst;
            }

            return `${key}Instructions`;
        })();

        const specificContent = {
            title: getText(`${key}Title`),
            description: getText(`${key}Description`),
            subtitle,
            instructions: getText(instructionsKey)
                .split('|')
                .map(instruction => instruction?.trimStart()),
            logo: (
                <PaymentLogo
                    paymentMethod={paymentMethod}
                    isLarge={true}
                />
            ),
            terms: this.getPaymentTerms(paymentMethod)
        };

        return specificContent;
    }

    render() {
        const { isOpen, requestClose, getText } = this.props;
        const {
            title, description, subtitle, instructions, logo, terms
        } = this.getPaymentsContent();

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={requestClose}
                width={560}
            >
                <Modal.Header>
                    <Modal.Title>{getText('shopNow')}</Modal.Title>
                </Modal.Header>
                <Flex css={styles.paymentTabsContainer}>{this.gePaymentTabs()}</Flex>
                <BuyNowPayLaterContent
                    logo={logo}
                    title={title}
                    subtitle={subtitle}
                    description={description}
                    instructions={instructions}
                    terms={terms}
                />
                <Modal.Footer css={styles.modalFooter}>
                    <Button
                        variant='primary'
                        onClick={requestClose}
                        children={getText('gotIt')}
                        css={styles.actionFooter}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(BuyNowPayLater, 'BuyNowPayLater');
