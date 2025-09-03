import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { wrapComponent } from 'utils/framework';
import { getImageAltText } from 'utils/Accessibility';
import { space, colors, fontSizes } from 'style/config';
import {
    Grid, Box, Text, Divider, Image, Link, Flex
} from 'components/ui';
import Chevron from 'components/Chevron';
import StringUtils from 'utils/String';
import ProductImage from 'components/Product/ProductImage/ProductImage';

const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

class ManageSubscriptionModal extends BaseClass {
    state = { isHidden: true };

    async componentDidMount() {
        await this.props.loadShippingAndPaymentInfo();
        this.setState({ isHidden: false });
    }

    render() {
        const {
            address,
            creditCard,
            creditCardLogo,
            displayItemVariation,
            enableReplenishmentAddressModifiable,
            enableReplenishmentFrequencyModifiable,
            enableReplenishmentOperations,
            enableReplenishmentPaymentModifiable,
            fullAddress,
            fullName,
            isOpen,
            item,
            itemQuantityText,
            itemText,
            manageSubscription,
            onModalClose,
            openUpdatePaymentModal,
            pause,
            paymentMethodText,
            phoneNumber,
            shippingAddressText,
            skip,
            tabHeadingText,
            toggleChangeDeliveryFrequencyModal,
            togglePauseAutoReplenModal,
            toggleSkipAutoReplenModal,
            askToUpdateDelivery,
            showUpdateDeliveryMessage
        } = this.props;
        const { isHidden } = this.state;

        return (
            <Modal
                width={0}
                onDismiss={onModalClose}
                isOpen={isOpen}
                isHidden={isHidden}
                isDrawer={true}
            >
                <Modal.Header>
                    <Modal.Title children={manageSubscription} />
                </Modal.Header>
                <Modal.Body>
                    {item && (
                        <>
                            <Grid
                                gap={[`${SM_IMG_GAP}px`, 4]}
                                css={styles.productContainer}
                            >
                                <Box>
                                    <ProductImage
                                        id={item.skuId}
                                        size={[SM_IMG_SIZE, 87]}
                                        skuImages={item.skuImages}
                                        disableLazyLoad={true}
                                        altText={getImageAltText(item)}
                                    />
                                </Box>
                                <div>
                                    <Grid
                                        css={styles.productDetails}
                                        minHeight={[SM_IMG_SIZE, 0]}
                                    >
                                        <Box>
                                            <Text
                                                is='p'
                                                css={styles.title}
                                                children={item.brandName}
                                                data-at={Sephora.debug.dataAt('sku_brand')}
                                            />
                                            <Text
                                                is='p'
                                                css={styles.subtitle}
                                                children={item.productName}
                                                data-at={Sephora.debug.dataAt('sku_name')}
                                            />
                                            {displayItemVariation && (
                                                <Text
                                                    is='p'
                                                    css={styles.detailsContainer}
                                                    data-at={Sephora.debug.dataAt('sku_size')}
                                                >
                                                    {`${item.variationType}: ${item.variationValue}`}
                                                    <span css={styles.detailsSeparator}>•</span>
                                                    {StringUtils.format(itemText, item.skuId)}
                                                </Text>
                                            )}
                                            <Text
                                                is='p'
                                                css={styles.productQty}
                                                data-at={Sephora.debug.dataAt('sku_qty')}
                                            >
                                                {itemQuantityText}
                                            </Text>
                                            {enableReplenishmentOperations && (
                                                <Box css={styles.linksContainer}>
                                                    <Link
                                                        css={styles.blueLink}
                                                        onClick={toggleSkipAutoReplenModal}
                                                    >
                                                        {skip}
                                                    </Link>
                                                    <span css={styles.spacer}>|</span>
                                                    <Link
                                                        css={styles.blueLink}
                                                        onClick={togglePauseAutoReplenModal}
                                                    >
                                                        {pause}
                                                    </Link>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                </div>
                            </Grid>
                            <Divider />
                            <Grid
                                css={styles.tabContainer}
                                onClick={enableReplenishmentFrequencyModifiable && toggleChangeDeliveryFrequencyModal}
                            >
                                <Flex flexDirection='column'>
                                    <Text
                                        is='h3'
                                        css={styles.tabHeading}
                                    >
                                        {tabHeadingText}
                                    </Text>
                                    {showUpdateDeliveryMessage && <Text css={styles.detailsContainer}>{askToUpdateDelivery}</Text>}
                                </Flex>
                                {enableReplenishmentFrequencyModifiable && (
                                    <Chevron
                                        isThicker={true}
                                        css={styles.chevron}
                                        direction='right'
                                    />
                                )}
                            </Grid>
                            <Divider />
                            <Grid css={styles.tabContainer}>
                                <Text
                                    is='h3'
                                    css={styles.tabHeading}
                                >
                                    {shippingAddressText}
                                </Text>
                                <Box css={styles.address}>
                                    <Text is='p'>{fullName}</Text>
                                    <Text is='p'>
                                        {address}
                                        <Text
                                            is='span'
                                            css={styles.block}
                                        >
                                            {fullAddress}
                                        </Text>
                                        <Text
                                            is='span'
                                            css={styles.block}
                                        >
                                            {phoneNumber}
                                        </Text>
                                    </Text>
                                    {enableReplenishmentAddressModifiable && (
                                        <Chevron
                                            isThicker={true}
                                            css={styles.chevron}
                                            direction='right'
                                        />
                                    )}
                                </Box>
                            </Grid>
                            <Divider />
                            <Grid
                                css={styles.lastTab}
                                onClick={enableReplenishmentPaymentModifiable && openUpdatePaymentModal}
                            >
                                <Text
                                    is='h3'
                                    css={{
                                        ...styles.tabHeading,
                                        ...styles.lastTabHeading
                                    }}
                                >
                                    {paymentMethodText}
                                </Text>
                                <Box>
                                    <Image
                                        css={styles.creditCardIcon}
                                        height={32}
                                        width={50}
                                        src={creditCardLogo}
                                    />
                                    <Text
                                        is='p'
                                        css={styles.inlineBlock}
                                    >
                                        {creditCard}
                                    </Text>
                                    {enableReplenishmentPaymentModifiable && (
                                        <Chevron
                                            isThicker={true}
                                            css={styles.chevron}
                                            direction='right'
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    productContainer: {
        gridTemplateColumns: 'auto 1fr',
        lineHeight: 'tight',
        marginTop: `${space[2]}px`,
        marginBottom: `${space[5]}px`,
        alignItems: 'start'
    },
    productDetails: {
        gap: `${space[2]}px`,
        gridTemplateColumns: 'auto 1fr'
    },
    tabContainer: {
        padding: `${space[3]}px ${space[5]}px ${space[3]}px 0`,
        gridTemplateColumns: 'auto 1fr',
        position: 'relative'
    },
    detailsContainer: {
        fontSize: `${fontSizes.sm}px`,
        color: `${colors.gray}`
    },
    productQty: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${fontSizes.xs}px`,
        marginTop: `${space[3]}px`
    },
    tabHeading: {
        fontSize: `${fontSizes.base}px`,
        fontWeight: 'bold'
    },
    address: {
        lineHeight: `${fontSizes.md}px`
    },
    lastTab: {
        marginTop: `${space[3]}px`,
        gridTemplateColumns: 'auto 1fr',
        position: 'relative'
    },
    lastTabHeading: {
        paddingTop: `${space[1]}px`
    },
    title: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${fontSizes.sm}px`,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: `${fontSizes.sm}px`,
        marginBottom: `${space[1]}px`,
        lineHeight: `${space[4]}px`
    },
    detailsText: {
        display: 'inline-block',
        lineHeight: `${space[4]}px`
    },
    detailsSeparator: {
        margin: '0 .5em'
    },
    block: {
        display: 'block'
    },
    chevron: {
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translate(0, -50%)',
        pointerEvents: 'none'
    },
    inlineBlock: {
        display: 'inline-block'
    },
    creditCardIcon: {
        height: `${space[32]}px`,
        width: `${space[50]}px`,
        marginRight: `${space[3]}px`,
        verticalAlign: 'middle'
    },
    blueLink: {
        color: `${colors.blue}`,
        fontSize: `${fontSizes.sm}px`
    },
    linksContainer: {
        marginTop: `${space[3]}px`
    },
    spacer: {
        marginTop: `${space[3]}px`,
        color: `${colors.midGray}`,
        margin: `0 ${space[2]}px`
    }
};

ManageSubscriptionModal.defaultProps = {};

ManageSubscriptionModal.propTypes = {
    address: PropTypes.string,
    cardTokenNumber: PropTypes.string,
    cardType: PropTypes.string,
    creditCard: PropTypes.string.isRequired,
    creditCardLogo: PropTypes.string.isRequired,
    currentSubscriptionPaymentInfo: PropTypes.object.isRequired,
    displayItemVariation: PropTypes.string.isRequired,
    enableReplenishmentAddressModifiable: PropTypes.bool.isRequired,
    enableReplenishmentFrequencyModifiable: PropTypes.bool.isRequired,
    enableReplenishmentOperations: PropTypes.bool.isRequired,
    enableReplenishmentPaymentModifiable: PropTypes.bool.isRequired,
    fullAddress: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    getItSooner: PropTypes.string.isRequired,
    handleManageSubscription: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    item: PropTypes.shape({}).isRequired,
    itemQuantityText: PropTypes.string.isRequired,
    itemText: PropTypes.string.isRequired,
    manageSubscription: PropTypes.string.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onModalClose: PropTypes.func.isRequired,
    pause: PropTypes.string.isRequired,
    paymentMethodText: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string,
    shippingAddressText: PropTypes.string.isRequired,
    skip: PropTypes.string.isRequired,
    subscription: PropTypes.object.isRequired,
    tabHeadingText: PropTypes.string.isRequired,
    toggleGetItSoonerAutoReplenModal: PropTypes.func.isRequired,
    togglePauseAutoReplenModal: PropTypes.func.isRequired,
    toggleSkipAutoReplenModal: PropTypes.func.isRequired
};

export default wrapComponent(ManageSubscriptionModal, 'ManageSubscriptionModal');
