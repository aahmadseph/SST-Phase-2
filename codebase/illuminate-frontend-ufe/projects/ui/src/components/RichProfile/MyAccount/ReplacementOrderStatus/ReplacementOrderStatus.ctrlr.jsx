import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Container, Divider, Flex, Grid, Link, Text
} from 'components/ui';
import mediaUtils from 'utils/Media';
import UrlUtils from 'utils/Url';
import SomethingWrongMessageScreen from 'components/GlobalModals/DeliveryIssueModal/screens/SomethingWrongMessageScreen';
import localeUtils from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import anaConsts from 'analytics/constants';
import replacementOrderBindings from 'analytics/bindingMethods/pages/replacementOrder/replacementOrderBindings';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import processEvent from 'analytics/processEvent';

const { Media } = mediaUtils;
const { getLocaleResourceFile } = localeUtils;
const { trackingEvent } = replacementOrderBindings;

const getText = getLocaleResourceFile('components/RichProfile/MyAccount/ReplacementOrderStatus/locales', 'ReplacementOrderStatus');

class ReplacementOrderStatus extends BaseClass {
    constructor(props) {
        super(props);
    }

    redirectToShopping = () => UrlUtils.redirectTo('/');

    redirectToOrderReplacement = () =>
        this.props.replacementOrderId && UrlUtils.redirectTo(`/profile/MyAccount/replacementOrder?orderId=${this.props.replacementOrderId}`);

    redirectToOrderDetails = () => this.props.replacementOrderId && UrlUtils.redirectTo(`/profile/orderdetail/${this.props.replacementOrderId}`);

    redirectToOrderHistory = () => UrlUtils.redirectTo(OrderUtils.getOrderHistoryUrl());

    successComponentBtns = () => (
        <>
            <Button
                margin={2}
                width={['100%', '14.5em']}
                variant='secondary'
                type='button'
                children={getText('viewOrderDetails')}
                onClick={this.redirectToOrderDetails}
            />
            <Button
                margin={2}
                width={['100%', '14.5em']}
                variant='primary'
                type='button'
                children={getText('continueShopping')}
                onClick={this.redirectToShopping}
            />
        </>
    );

    successComponent = () => (
        <>
            <Text
                is='h2'
                marginY={2}
            >
                {`${getText('yourOrderNumber')} `}
                <Link
                    color='blue'
                    onClick={this.redirectToOrderDetails}
                >
                    {this.props.replacementOrderId || ''}
                </Link>
                .
            </Text>
            <Text
                is='h2'
                marginY={2}
            >
                {`${getText('confirmationEmail')} ${this.props.user?.login || ''}.`}
            </Text>
            <Media greaterThan='xs'>
                <Flex>{this.successComponentBtns()}</Flex>
            </Media>
            <Media lessThan='sm'>
                <Flex flexDirection='column-reverse'>{this.successComponentBtns()}</Flex>
            </Media>
        </>
    );

    failureComponent = () => (
        <>
            <Text
                is='h2'
                marginY={2}
            >
                {Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER_ERROR_MESSAGE) || getText('failureMessageParagraph1')}
            </Text>
            <Button
                margin={2}
                width={['100%', '14.5em']}
                variant='primary'
                type='button'
                children={getText('continueShopping')}
                onClick={this.redirectToShopping}
            />
        </>
    );

    setPageName = pageName => {
        digitalData.page.pageInfo.pageName = pageName;
    };

    componentDidMount() {
        const { success, error, replacementOrderId: replacementOrderID, orderId: originalOrderID } = this.props;

        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.REPLACEMENT_ORDER;

        if (!digitalData.transaction) {
            digitalData.transaction = { replacementOrderID, originalOrderID };
        } else {
            digitalData.transaction.replacementOrderID = replacementOrderID;
            digitalData.transaction.originalOrderID = originalOrderID;
        }

        if (success === 'true') {
            //Page load analytics
            this.setPageName(anaConsts.REPLACEMENT_ORDER.SUCCESS_PAGE_ENTER);

            digitalData.page.attributes.productStrings = Storage.local.getItem(LOCAL_STORAGE.NCR_PRODUCTS_STRING);

            processEvent.process(anaConsts.PAGE_LOAD);
        } else {
            //Page load analytics
            this.setPageName(anaConsts.REPLACEMENT_ORDER.FAILURE_PAGE_ENTER);

            //Submit error analytics
            const errorMessage =
                Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER_ERROR_MESSAGE) ||
                (error === 'true' ? getText('somethingWrongMessage') : getText('failureMessageParagraph1'));

            trackingEvent({
                pageName: `${anaConsts.PAGE_TYPES.REPLACEMENT_ORDER}:${anaConsts.REPLACEMENT_ORDER.FAILURE_PAGE_ENTER}:n/a:*`,
                pageType: anaConsts.PAGE_TYPES.REPLACEMENT_ORDER,
                pageDetail: anaConsts.REPLACEMENT_ORDER.FAILURE_PAGE_ENTER,
                fieldErrors: [anaConsts.PAGE_TYPES.REPLACEMENT_ORDER],
                errorMessages: [errorMessage],
                replacementOrderID,
                originalOrderID
            });
        }
    }

    render() {
        const { success, error } = this.props;

        if (!success && !error) {
            return null;
        }

        return (
            <>
                <Container paddingX={[3, 4]}>
                    {error === 'true' ? (
                        <>
                            <Flex
                                justifyContent='space-between'
                                alignItems='baseline'
                                marginY={5}
                                lineHeight='tight'
                            >
                                <Text
                                    is='h1'
                                    fontSize={['xl', null, '2xl']}
                                    fontFamily='serif'
                                    children={getText('orderDetails')}
                                />
                                <Link
                                    onClick={this.redirectToOrderHistory}
                                    color='blue'
                                    padding={3}
                                    margin={-3}
                                    children={getText('orderHistory')}
                                />
                            </Flex>
                            <Divider
                                color='black'
                                height={2}
                                marginBottom={5}
                            />
                            <Grid
                                marginTop={[4, 5]}
                                justifyContent='space-around'
                            >
                                <SomethingWrongMessageScreen
                                    iconImage='eyeLashes'
                                    somethingWrong={getText('somethingWrong')}
                                    please={getText('somethingWrongMessage')}
                                    style={{ maxWidth: '340px' }}
                                    orTryLater={
                                        <>
                                            <br />
                                            <Button
                                                marginY={2}
                                                width={'100%'}
                                                variant='primary'
                                                type='button'
                                                children={getText('tryAgain')}
                                                onClick={this.redirectToOrderReplacement}
                                            />
                                        </>
                                    }
                                />
                            </Grid>
                        </>
                    ) : (
                        <Grid
                            gap={[3, null, 5]}
                            columns={[null, null, '1fr 46%']}
                            lineHeight='tight'
                            marginTop={[4, 5]}
                            scrollBehavior='smooth'
                        >
                            <Box>
                                <>
                                    <Text
                                        is='h1'
                                        fontWeight={700}
                                        fontSize={['lg', 'xl']}
                                        marginTop={4}
                                        marginBottom={4}
                                        children={success === 'true' ? getText('successMessage') : getText('failureMessage')}
                                    />
                                    {success === 'true' ? this.successComponent() : this.failureComponent()}
                                </>
                            </Box>
                        </Grid>
                    )}
                </Container>
            </>
        );
    }
}

ReplacementOrderStatus.propTypes = {
    success: PropTypes.string,
    error: PropTypes.string,
    replacementOrderId: PropTypes.string,
    orderId: PropTypes.string,
    orderDetails: PropTypes.object
};

export default wrapComponent(ReplacementOrderStatus, 'ReplacementOrderStatus', true);
