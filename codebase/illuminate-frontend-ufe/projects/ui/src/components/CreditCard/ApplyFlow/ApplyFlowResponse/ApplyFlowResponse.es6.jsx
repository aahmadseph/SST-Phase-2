/* eslint-disable max-len */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import {
    Box, Flex, Button, Divider, Image, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Loves from 'components/Loves';
import bccUtils from 'utils/BCC';
import CheckoutButton from 'components/CheckoutButton/CheckoutButton';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import { APPROVAL_STATUS } from 'constants/CreditCard';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'Actions';
import store from 'Store';

const { IMAGE_SIZES } = bccUtils;

class ApplyFlowResponse extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            carouselChildren: []
        };
    }

    viewDetails = function () {
        const { bureauAddress, bureauCreditScore, bureauRejectReasons } = this.props.status;

        store.dispatch(
            Actions.showCreditReportDetailsModal(true, {
                bureauAddress,
                bureauCreditScore,
                bureauRejectReasons
            })
        );
    };

    /**
     * approved response render method
     */
    applicationApprovedStatusRender = function (getText) {
        const { status, welcomeBCCData } = this.props;

        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();

        return (
            <div>
                <LegacyContainer data-at={Sephora.debug.dataAt('apply_status')}>
                    <Text
                        is='h1'
                        fontSize={isMobile ? 'xl' : '3xl'}
                        lineHeight='tight'
                        fontFamily='serif'
                        marginTop={isMobile ? 5 : 7}
                        marginBottom='.5em'
                        children={status.title}
                    />

                    {status.icon && (
                        <Image
                            display='block'
                            marginX='auto'
                            marginY={isMobile ? 6 : 7}
                            width={120}
                            height={75}
                            src={status.icon}
                        />
                    )}
                    {status.description &&
                        status.description.map((item, i) => (
                            <Text
                                is='p'
                                key={`description_${i}`}
                                fontSize={isDesktop && 'md'}
                                maxWidth='40em'
                                marginX='auto'
                                marginBottom='1em'
                                children={item}
                            />
                        ))}
                    <Divider
                        marginY={4}
                        marginX='auto'
                        width={isDesktop && '60%'}
                    />
                    <Text
                        is='p'
                        marginY={4}
                        fontSize={isMobile ? 'lg' : 'xl'}
                    >
                        {getText('creditLimit')}
                        <b>${status.creditLimit}</b>
                    </Text>
                </LegacyContainer>

                {welcomeBCCData && (
                    <BccComponentList
                        items={welcomeBCCData}
                        origin='creditcard'
                    />
                )}

                <LegacyContainer data-at={Sephora.debug.dataAt('cc_apply_info')}>
                    <Text
                        is='p'
                        fontWeight='bold'
                        lineHeight='tight'
                        marginBottom='1em'
                    >
                        {status.discountMessage}
                    </Text>
                    <Text
                        is='p'
                        fontSize='sm'
                        lineHeight='tight'
                    >
                        {status.defaultCardMessage}
                    </Text>
                    <LegacyGrid
                        marginTop={5}
                        fill={isDesktop}
                    >
                        <LegacyGrid.Cell
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                            border={1}
                            borderColor='midGray'
                            marginRight={isDesktop && 2}
                            paddingY={3}
                            paddingX={4}
                            borderRadius={2}
                        >
                            {status.tempCardMessage}
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                            border={1}
                            borderColor='midGray'
                            marginLeft={isDesktop && 2}
                            marginTop={isMobile && 2}
                            paddingY={3}
                            paddingX={4}
                            borderRadius={2}
                        >
                            <Text is='p'>
                                <b>{status.aprMessage}</b>
                                {status.aprDetailsMessage && ' ' + status.aprDetailsMessage}
                            </Text>
                            {status.aprDetailsMessage && (
                                <Flex justifyContent='flex-end'>
                                    <Link
                                        onClick={this.viewDetails}
                                        fontWeight='bold'
                                        children={getText('viewDetails')}
                                    />
                                </Flex>
                            )}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                </LegacyContainer>
            </div>
        );
    };

    /**
     * error, pending, delayed responses render method
     */
    applicationNonApprovedStatusRender = function () {
        const status = this.props.status;

        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();

        return (
            <React.Fragment>
                <LegacyContainer>
                    <Text
                        is='h1'
                        fontSize={isMobile ? 'lg' : 'xl'}
                        lineHeight='tight'
                        fontWeight='bold'
                        marginBottom='.5em'
                        children={status.title}
                    />
                    {status.icon && (
                        <Image
                            display='block'
                            marginX='auto'
                            marginY={isMobile ? 6 : 7}
                            width={120}
                            height={75}
                            src={status.icon}
                        />
                    )}

                    {status.description &&
                        status.description.map((item, i) => (
                            <Text
                                is='p'
                                key={`description_${i}`}
                                fontSize={isDesktop && 'md'}
                                maxWidth='52em'
                                marginX='auto'
                                marginBottom='1em'
                                children={item}
                            />
                        ))}
                </LegacyContainer>
            </React.Fragment>
        );
    };

    /**
     * main render method
     */
    render = function () {
        const getText = localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/ApplyFlowResponse/locales', 'ApplyFlowResponse');
        const status = this.props.status;

        const isMobile = Sephora.isMobile();

        return (
            <Box textAlign='center'>
                {status.name !== APPROVAL_STATUS.APPROVED && this.applicationNonApprovedStatusRender()}
                {status.name === APPROVAL_STATUS.APPROVED && this.applicationApprovedStatusRender(getText)}
                <LegacyContainer>
                    <Box
                        marginBottom={isMobile ? 6 : 7}
                        width='100%'
                        maxWidth='45em'
                        marginX='auto'
                    >
                        <Divider marginY={isMobile ? 5 : 6} />
                        <LegacyGrid
                            fill={true}
                            gutter={isMobile ? 3 : 5}
                        >
                            <LegacyGrid.Cell>
                                <CheckoutButton
                                    variant='secondary'
                                    isLinkWhenEmpty={true}
                                    block={true}
                                />
                            </LegacyGrid.Cell>
                            <LegacyGrid.Cell>
                                <Button
                                    variant='primary'
                                    block={true}
                                    href='/'
                                    data-at={Sephora.debug.dataAt('credit_card_response_continue_shopping')}
                                >
                                    {getText('continueShoppingButton')}
                                </Button>
                            </LegacyGrid.Cell>
                        </LegacyGrid>
                    </Box>

                    <SectionDivider />

                    <Loves
                        compType={'ApplyCCLoves'}
                        maxLoves={12}
                        compProps={{ imageSize: IMAGE_SIZES[162] }}
                    />
                </LegacyContainer>
            </Box>
        );
    };
}

export default wrapComponent(ApplyFlowResponse, 'ApplyFlowResponse');
