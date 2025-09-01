/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Divider, Button, Image, Text, Grid, Link, Container
} from 'components/ui';
import Loves from 'components/Loves';
import urlUtils from 'utils/Url';
import Banner from 'components/Content/Banner';
import {
    colors, mediaQueries, space, radii
} from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import Actions from 'Actions';
import { APPROVAL_STATUS } from 'constants/CreditCard';
import analyticsConstants from 'analytics/constants';
import CheckoutButton from 'components/CheckoutButton/CheckoutButton';
import creditCardPageBindings from 'analytics/bindingMethods/pages/creditCard/creditCardPageBindings';

const {
    ACTION_INFO: { CREDIT_CARD_CONTINUE_SHOPPING, CREDIT_CARD_CHECKOUT_NOW }
} = analyticsConstants;

const getText = (text, vars) =>
    localeUtils.getLocaleResourceFile('components/Content/CreditCards/CreditCardPostApplication/locales', 'CreditCardPostApplication')(text, vars);

const SuccessSection = props => {
    const { postAppContent, status } = props;
    const { creditLimit, title, description } = status;

    return (
        <Box>
            <Box
                maxWidth={624}
                marginBottom={6}
            >
                <>
                    <Image
                        display='block'
                        size={[72, 96]}
                        marginBottom={4}
                        src='/img/ufe/credit-card/credit-card.svg'
                    />
                    <Text
                        is='p'
                        fontWeight='bold'
                        fontSize={['lg', 'xl']}
                        lineHeight='tight'
                        marginBottom={2}
                        children={title}
                    />
                    {description &&
                        description.map((item, i) => (
                            <Text
                                key={`description_${i}`}
                                is='p'
                                lineHeight='tight'
                                marginBottom={4}
                                children={item}
                            />
                        ))}
                    <Text
                        is='p'
                        lineHeight='tight'
                        fontSize={['md', 'lg']}
                    >
                        <span>{getText('creditLimit')}</span>
                        <span>
                            <b>${creditLimit}</b>
                        </span>
                    </Text>
                </>
            </Box>
            {postAppContent && <Banner {...postAppContent} />}
            <WhatYouNeedToKnow {...status} />
        </Box>
    );
};

const PendingSection = props => {
    const { title, description } = props.status;

    return (
        <Box maxWidth={624}>
            <Image
                display='block'
                size={[72, 96]}
                marginBottom={4}
                src='/img/ufe/credit-card/credit-card.svg'
            />
            <Text
                is='p'
                fontWeight='bold'
                fontSize={['lg', 'xl']}
                lineHeight='tight'
                marginBottom={2}
                children={title}
            />
            {description &&
                description.map((item, i) => (
                    <Text
                        key={`description_${i}`}
                        is='p'
                        lineHeight='tight'
                        marginBottom={4}
                        children={item}
                    />
                ))}
        </Box>
    );
};

const WhatYouNeedToKnow = status => {
    const {
        tempCardMessage, defaultCardMessage, aprMessage, aprDetailsMessage, discountMessage
    } = status;

    const viewDetails = () => {
        const { bureauAddress, bureauCreditScore, bureauRejectReasons } = status;

        store.dispatch(
            Actions.showCreditReportDetailsModal(true, {
                bureauAddress,
                bureauCreditScore,
                bureauRejectReasons
            })
        );
    };

    return (
        <Box>
            <Text
                is='h2'
                fontWeight='bold'
                fontSize={['md', 'lg']}
                lineHeight='tight'
                marginBottom={4}
                marginTop={6}
                children={getText('whatYouNeedToKnow')}
            />
            <Grid
                columns={[null, 'repeat(3, 1fr)']}
                gap={[4, 5]}
            >
                <Box css={styles.gridBox}>
                    <Text
                        is='p'
                        display='inline-block'
                        lineHeight='tight'
                    >
                        <span>
                            <b>{defaultCardMessage} </b>
                        </span>
                        <span>{discountMessage}</span>
                    </Text>
                </Box>
                <Box css={styles.gridBox}>
                    <Text
                        is='p'
                        lineHeight='tight'
                        children={tempCardMessage}
                    />
                </Box>
                <Box css={styles.gridBox}>
                    <Text
                        is='p'
                        lineHeight='tight'
                    >
                        <span>
                            <b>{aprMessage} </b>
                        </span>
                        <span>{aprDetailsMessage} </span>
                        <Link
                            color='blue'
                            onClick={e => viewDetails(e)}
                        >
                            {getText('viewDetails')}
                        </Link>
                    </Text>
                </Box>
            </Grid>
        </Box>
    );
};

const ContinueShoppingButton = () => (
    <Button
        variant='primary'
        onClick={e => {
            e.preventDefault();
            creditCardPageBindings.triggerLinkTrackingEvent(CREDIT_CARD_CONTINUE_SHOPPING);
            urlUtils.redirectTo('/');
        }}
        children={getText('continueShopping')}
        minWidth={['100%', '224px']}
        marginRight={4}
    />
);

const CreditCardPostApplication = props => {
    const { name } = props.status;
    const isApplicationSuccessful = name === APPROVAL_STATUS.APPROVED;

    return (
        <Container paddingTop={[4, 5]}>
            {isApplicationSuccessful ? <SuccessSection {...props} /> : <PendingSection {...props} />}
            <Box marginTop={[5, 6]}>
                <ContinueShoppingButton />
                <CheckoutButton
                    variant='secondary'
                    isLinkWhenEmpty={true}
                    children={getText('checkoutNow')}
                    minWidth={['100%', '224px']}
                    marginTop={[4, 0]}
                    triggerLinkTrackingOnClick={() => creditCardPageBindings.triggerLinkTrackingEvent(CREDIT_CARD_CHECKOUT_NOW)}
                />
            </Box>
            <Divider marginY={[6, 7]} />
            <Loves compType={'ApplyCCLoves'} />
        </Container>
    );
};

const styles = {
    gridBox: {
        backgroundColor: colors.nearWhite,
        padding: space[4],
        borderRadius: radii[2],
        [mediaQueries.sm]: {
            padding: space[5]
        }
    }
};

export default wrapFunctionalComponent(CreditCardPostApplication, 'CreditCardPostApplication');
