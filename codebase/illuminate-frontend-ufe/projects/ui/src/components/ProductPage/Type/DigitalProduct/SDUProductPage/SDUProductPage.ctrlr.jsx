import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ZipCodeLocator from 'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/ZipCodeLocator';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import FeesAndFAQ from 'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/FeesAndFAQ';
import anaConsts from 'analytics/constants';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import processEvent from 'analytics/processEvent';
import {
    space, fontSizes, colors, site, mediaQueries, lineHeights
} from 'style/config';
import mediaUtils from 'utils/Media';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import {
    Icon, Text, Grid, Box, Button, Link, Flex
} from 'components/ui';

const { Media } = mediaUtils;

class SDUProductPage extends BaseClass {
    state = {
        isHidden: true,
        isZipCodeEligible: false
    };

    updateZipCodeEligible = ({ sameDayAvailable, zipCode }) => {
        const { isSamedayUnlimitedEnabled } = this.props;

        this.setState(
            {
                isZipCodeEligible: sameDayAvailable && isSamedayUnlimitedEnabled
            },
            () => {
                if (!this.state.isZipCodeEligible) {
                    this.fireAnalytics({ sameDayAvailable, zipCode });
                }
            }
        );
    };

    fireAnalytics = ({ sameDayAvailable, zipCode }) => {
        const pageType = anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED;
        const pageDetail = anaConsts.PAGE_TYPES.ENTER_ZIP_CODE;

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                actionInfo: !sameDayAvailable ? `${pageType}:${anaConsts.PAGE_DETAIL.ZIP_CODE_UNAVAILABLE}` : null,
                customerZipCode: zipCode
            }
        });
    };

    componentDidMount() {
        const {
            loadBCCContent, mediaId, fireAnalytics, processSkuId, SDUDetails
        } = this.props;
        processSkuId(this);

        SDUDetails.skuId && fireAnalytics(SDUDetails.skuId);

        loadBCCContent(mediaId).then(() => {
            this.setState({
                isHidden: false
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.isUserSDUActive !== prevProps.isUserSDUActive) {
            if (this.props.isUserSDUActive) {
                this.props.redirectToSDUHub();
            }
        }
    }

    onClickEventHandler = () => {
        const {
            addSDUToBasket, basketType, onDismiss, skuTrialEligibility, skipConfirmationModal, SDUSku
        } = this.props;

        addSDUToBasket(this.props.SDUDetails, basketType, onDismiss, skuTrialEligibility, skipConfirmationModal, this.fireAnalytics, SDUSku);
    };

    render() {
        const {
            subscribeToSephora,
            subHeader,
            then,
            regionalAvailability,
            addTrialToBasket,
            addSubscriptionToBasket,
            sameDayUnlimited,
            free30DayTrial,
            joinForOnly,
            savingsText,
            isSDUAddedToBasket,
            alreadyAddedText,
            viewBasket,
            SM_IMG_SIZE,
            isCanada,
            isUserTrialEligible,
            bccComps,
            redirectToBasket,
            SDUDetails
        } = this.props;

        const { isZipCodeEligible, isHidden } = this.state;

        return (
            <Flex css={[styles.tabContainer, isHidden && styles.hidden]}>
                <div css={styles.leftColumn}>
                    <div css={styles.header}>
                        <ProductImage
                            id={SDUDetails.skuId}
                            size={SM_IMG_SIZE}
                            skuImages={SDUDetails.skuImages}
                            disableLazyLoad={true}
                            altText={sameDayUnlimited}
                        />
                        <Box
                            css={styles.headerContainer}
                            display='inline-block'
                        >
                            <Text
                                css={styles.subHeader}
                                children={subscribeToSephora}
                            />
                            <Text
                                css={styles.boldText}
                                children={subHeader}
                            />
                        </Box>
                    </div>
                    <Box css={styles.trialBox}>
                        {isUserTrialEligible ? (
                            <Text
                                css={styles.freeText}
                                is='span'
                                children={free30DayTrial}
                            />
                        ) : (
                            <Text
                                is='span'
                                children={joinForOnly}
                            />
                        )}
                        <Text
                            css={`
                                ${isUserTrialEligible ? { ...styles.savingsText } : { ...styles.savingsText, ...styles.colorRed }}
                            `}
                            is='span'
                        >
                            {isUserTrialEligible && then}
                            <strong children={` ${SDUDetails.listPrice} ${savingsText}`} />
                        </Text>
                    </Box>
                    <Box>
                        <Grid css={styles.infoSection}>
                            <BccComponentList
                                context='modal'
                                items={bccComps}
                            />
                        </Grid>
                        <Media greaterThan='sm'>
                            <Box css={styles.faq}>
                                <FeesAndFAQ
                                    alignLeft={true}
                                    openInModal={true}
                                />
                            </Box>
                        </Media>
                    </Box>
                </div>
                <div css={styles.rightColumn}>
                    <div>
                        <Box css={styles.availability}>
                            <Text children={regionalAvailability} />
                        </Box>
                        <ZipCodeLocator
                            updateZipCodeEligible={this.updateZipCodeEligible}
                            checkAnotherPostalCode
                            isCanada={isCanada}
                        />
                        <Media lessThan='md'>
                            <Box css={styles.faq}>
                                <FeesAndFAQ
                                    alignLeft={false}
                                    openInModal={true}
                                />
                            </Box>
                        </Media>
                        {isSDUAddedToBasket || (
                            <>
                                <Media greaterThan='sm'>
                                    <Button
                                        css={styles.addToBasket}
                                        variant='primary'
                                        disabled={!isZipCodeEligible}
                                        onClick={this.onClickEventHandler}
                                    >
                                        {isUserTrialEligible ? addTrialToBasket : addSubscriptionToBasket}
                                    </Button>
                                </Media>
                                <Media lessThan='md'>
                                    <StickyFooter>
                                        <Button
                                            css={{ ...styles.addToBasket, ...styles.noMargin }}
                                            variant='primary'
                                            disabled={!isZipCodeEligible}
                                            onClick={this.onClickEventHandler}
                                        >
                                            {isUserTrialEligible ? addTrialToBasket : addSubscriptionToBasket}
                                        </Button>
                                    </StickyFooter>
                                </Media>
                            </>
                        )}
                        {isSDUAddedToBasket && (
                            <>
                                <Media greaterThan='sm'>
                                    <Button
                                        css={styles.addedToBasket}
                                        variant='secondary'
                                        onClick={redirectToBasket}
                                    >
                                        <Icon
                                            name='checkmark'
                                            size='1em'
                                            css={styles.checkmark}
                                        />
                                        <Text
                                            is='p'
                                            children={alreadyAddedText}
                                        />
                                        <Link
                                            css={styles.blueLink}
                                            children={viewBasket}
                                        />
                                    </Button>
                                </Media>
                                <Media lessThan='md'>
                                    <StickyFooter>
                                        <Button
                                            css={styles.addedToBasket}
                                            variant='secondary'
                                            onClick={redirectToBasket}
                                        >
                                            <Icon
                                                name='checkmark'
                                                size='1em'
                                                css={styles.checkmark}
                                            />
                                            <Text
                                                is='p'
                                                children={alreadyAddedText}
                                            />
                                            <Link
                                                css={styles.blueLink}
                                                children={viewBasket}
                                            />
                                        </Button>
                                    </StickyFooter>
                                </Media>
                            </>
                        )}
                    </div>
                </div>
            </Flex>
        );
    }
}

const styles = {
    hidden: {
        display: 'none'
    },
    tabContainer: {
        padding: `${space[4]}px 0 0`,
        maxWidth: `${site.legacyWidth}px`,
        margin: '0 auto',
        alignItems: 'center',
        flexWrap: 'wrap',
        [mediaQueries.md]: {
            padding: `${space[7]}px 0 0`
        }
    },
    header: {
        display: 'flex',
        alignItems: 'start'
    },
    headerContainer: {
        verticalAlign: 'top'
    },
    subHeader: {
        fontSize: `${fontSizes.sm}px`,
        lineHeight: `${lineHeights.none}`
    },
    boldText: {
        fontWeight: 'bold',
        lineHeight: `${lineHeights.none}`,
        fontSize: `${fontSizes.xl}px`,
        display: 'block'
    },
    trialBox: {
        paddingTop: `${space[2]}`,
        paddingBottom: `${space[2]}`
    },
    freeText: {
        color: `${colors.white}`,
        fontWeight: 'bold',
        fontSize: `${fontSizes.base}px`,
        backgroundColor: colors.brightRed,
        padding: `${space[1]}px 6px`,
        alignItems: 'center',
        borderRadius: `${space[1]}`
    },
    savingsText: {
        fontSize: `${fontSizes.base}px`,
        display: 'inline-block',
        paddingLeft: `${space[2]}`
    },
    bagIcon: {
        marginLeft: `${space[3]}`
    },
    colorRed: {
        color: `${colors.red}`,
        paddingLeft: '0px'
    },
    icon: {
        marginLeft: `${space[4]}`
    },
    infoSection: {
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center'
    },
    infoSectionHeading: {
        fontWeight: 'bold',
        fontSize: `${fontSizes.base}px`
    },
    infoSectionMessage: {
        display: 'block',
        fontSize: `${fontSizes.base}px`,
        lineHeight: `${fontSizes.sm}px`
    },
    leftColumn: {
        padding: `0 ${space[3]}px`,
        minWidth: '50%',
        [mediaQueries.md]: {
            width: '50%'
        }
    },
    rightColumn: {
        padding: `0 ${space[3]}px`,
        flexGrow: '1',
        width: '50%',
        marginTop: '0',
        alignSelf: 'initial',
        [mediaQueries.md]: {
            alignSelf: 'self-start',
            marginTop: '100px'
        }
    },
    availability: {
        fontWeight: 'bold',
        fontSize: `${fontSizes.base}px`,
        paddingTop: `${space[3]}px`,
        paddingBottom: `${space[3]}px`
    },
    faq: {
        paddingTop: `${space[3]}px`
    },
    addToBasket: {
        backgroundColor: colors.red,
        width: '100%',
        marginTop: `${space[5]}px`
    },
    noMargin: {
        backgroundColor: colors.red,
        width: '100%',
        marginTop: '0'
    },
    addedToBasket: {
        width: '100%',
        marginTop: '0',
        flexWrap: 'wrap',
        [mediaQueries.md]: {
            marginTop: `${space[5]}px`
        }
    },
    checkmark: {
        marginRight: `${space[2]}`
    },
    blueLink: {
        color: `${colors.blue}`,
        display: 'block',
        fontSize: `${fontSizes.sm}`,
        flexBasis: '100%',
        fontWeight: 'normal'
    }
};

SDUProductPage.defaultProps = {};

SDUProductPage.propTypes = {
    title: PropTypes.string.isRequired,
    subscribeToSephora: PropTypes.string.isRequired,
    subHeader: PropTypes.string.isRequired,
    then: PropTypes.string.isRequired,
    regionalAvailability: PropTypes.string.isRequired,
    addTrialToBasket: PropTypes.string.isRequired,
    addSubscriptionToBasket: PropTypes.string.isRequired,
    sameDayUnlimited: PropTypes.string.isRequired,
    joinForOnly: PropTypes.string.isRequired,
    viewBasket: PropTypes.string.isRequired,
    isSDUAddedToBasket: PropTypes.bool,
    isUserSDUActive: PropTypes.bool,
    isCanada: PropTypes.bool.isRequired,
    mediaId: PropTypes.string.isRequired,
    savingsText: PropTypes.string.isRequired,
    free30DayTrial: PropTypes.string.isRequired,
    alreadyAddedText: PropTypes.string.isRequired,
    basketType: PropTypes.any,
    isUserTrialEligible: PropTypes.bool,
    bccComps: PropTypes.array.isRequired,
    isSamedayUnlimitedEnabled: PropTypes.bool.isRequired,
    redirectToBasket: PropTypes.func.isRequired,
    redirectToSDUHub: PropTypes.func.isRequired,
    loadBCCContent: PropTypes.func.isRequired,
    showShippingDeliveryLocationModal: PropTypes.func.isRequired,
    addSDUToBasket: PropTypes.func.isRequired,
    fireAnalytics: PropTypes.func.isRequired,
    processSkuId: PropTypes.func.isRequired,
    SDUDetails: PropTypes.object.isRequired
};

export default wrapComponent(SDUProductPage, 'SDUProductPage', true);
