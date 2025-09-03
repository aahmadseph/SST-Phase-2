import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import ZipCodeLocator from 'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/ZipCodeLocator';
import FeesAndFAQ from 'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/FeesAndFAQ';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import anaConsts from 'analytics/constants';
import utils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import { space, fontSizes, colors } from 'style/config';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import {
    Icon, Text, Grid, Box, Button, Link, Flex
} from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import ContentConstants from 'constants/content';
import { globalModals } from 'utils/globalModals';

const { SDU_SERVICE_INFO } = globalModals;
const { CONTEXTS } = ContentConstants;

class SDULandingPageModal extends BaseClass {
    state = {
        isHidden: true,
        isZipCodeEligible: false,
        SDUDetails: {},
        cmsContent: null
    };

    componentDidMount() {
        const {
            loadBCCContent, loadContentfulContent, mediaId, getUserSpecificProductDetails, SDUSku
        } = this.props;
        const getSDUDetailsPromise = getUserSpecificProductDetails(SDUSku);
        const sduGlobalModalSid = this.props.globalModals[SDU_SERVICE_INFO]?.sid;

        // sduModalData will only exist if this is called from /basket page
        // sduGlobalModalSid will exist when contentful global modals has data configured.
        if ((Sephora.configurationSettings.isContentfulBasketEnabled && this.props.sduModalData?.sid) || sduGlobalModalSid) {
            Promise.all([getSDUDetailsPromise, loadContentfulContent(this.props.sduModalData?.sid || sduGlobalModalSid)]).then(values => {
                this.setState({
                    isHidden: false,
                    SDUDetails: values[0].currentSku,
                    cmsContent: values[1].data.items
                });
            });
        } else {
            Promise.all([getSDUDetailsPromise, loadBCCContent(mediaId)]).then(values => {
                this.setState({
                    isHidden: false,
                    SDUDetails: values[0].currentSku
                });
            });
        }
    }

    updateZipCodeEligible = ({ sameDayAvailable, zipCode }) => {
        this.setState(
            {
                isZipCodeEligible: sameDayAvailable
            },
            () => {
                if (!this.state.isZipCodeEligible) {
                    this.fireAnalytics({ isSDUAddedToBasket: this.state.isZipCodeEligible, zipCode });
                }
            }
        );
    };

    onClickEventHandler = () => {
        const {
            addSDUToBasket, basketType, onDismiss, isUserSDUTrialEligible, skipConfirmationModal, SDUSku
        } = this.props;
        addSDUToBasket(this.state.SDUDetails, basketType, onDismiss, isUserSDUTrialEligible, skipConfirmationModal, this.fireAnalytics, SDUSku);
    };

    fireAnalytics = ({ isSDUAddedToBasket, zipCode }) => {
        const pageType = anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED;
        let pageDetail;

        if (this.props.isUserSDUTrialAllowed && isSDUAddedToBasket) {
            pageDetail = anaConsts.PAGE_TYPES.TRIAL_ADDED_TO_BASKET_CONFIRMATION;
        } else if (!this.props.isUserSDUTrialAllowed && isSDUAddedToBasket) {
            pageDetail = anaConsts.PAGE_TYPES.SUBSCRIPTION_ADDED_TO_BASKET_CONFIRMATION;
        } else {
            pageDetail = anaConsts.PAGE_TYPES.ENTER_ZIP_CODE;
        }

        processEvent.process(isSDUAddedToBasket ? anaConsts.ASYNC_PAGE_LOAD : anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                actionInfo: !isSDUAddedToBasket && `${pageType}:${anaConsts.PAGE_DETAIL.ZIP_CODE_UNAVAILABLE}`,
                productStrings: utils.buildSingleProductString({
                    sku: this.state.SDUDetails,
                    isQuickLook: false,
                    newProductQty: 1,
                    displayQuantityPickerInATB: true
                }),
                zipCode
            }
        });
    };

    render() {
        const { isHidden, isZipCodeEligible } = this.state;
        const {
            title,
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
            SM_IMG_SIZE,
            isUserSDUTrialEligible,
            isSDUAddedToBasket,
            alreadyAddedText,
            viewBasket,
            isCanada,
            bccComps,
            redirectToBasket,
            onDismiss,
            zipCode
        } = this.props;

        const { SDUDetails } = this.state;

        return (
            <Modal
                onDismiss={onDismiss}
                isOpen={this.props.isOpen}
                isHidden={isHidden}
                isDrawer={true}
                hasBodyScroll={true}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title children={title} />
                </Modal.Header>
                <Modal.Body>
                    <Flex css={styles.tabContainer}>
                        <ProductImage
                            id={SDUDetails.skuId}
                            size={SM_IMG_SIZE}
                            skuImages={SDUDetails.skuImages}
                            disableLazyLoad={true}
                            altText={sameDayUnlimited}
                        />
                        <Box css={styles.headerContainer}>
                            <Text
                                css={styles.subHeader}
                                children={subscribeToSephora}
                            />
                            <Text
                                css={styles.boldText}
                                children={subHeader}
                            />
                        </Box>
                    </Flex>
                    <Box css={styles.trialBox}>
                        {isUserSDUTrialEligible ? (
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
                                ${isUserSDUTrialEligible ? { ...styles.savingsText } : { ...styles.savingsText, ...styles.colorRed }}
                            `}
                            is='span'
                        >
                            {isUserSDUTrialEligible && then}
                            <strong children={` ${SDUDetails.listPrice} ${savingsText}`} />
                        </Text>
                    </Box>
                    <Box>
                        {this.state.cmsContent ? (
                            <ComponentList
                                items={this.state.cmsContent}
                                context={CONTEXTS.MODAL}
                                page='basket'
                            />
                        ) : (
                            <Grid css={styles.infoSection}>
                                <BccComponentList
                                    context='modal'
                                    items={bccComps}
                                />
                            </Grid>
                        )}
                    </Box>
                    <Box css={styles.availability}>
                        <Text children={regionalAvailability} />
                    </Box>
                    <ZipCodeLocator
                        updateZipCodeEligible={this.updateZipCodeEligible}
                        isCanada={isCanada}
                        zipCode={zipCode}
                        fromChooseOptionsModal={this.props.fromChooseOptionsModal}
                    />
                    <Box css={styles.faq}>
                        <FeesAndFAQ />
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    {isSDUAddedToBasket || (
                        <Button
                            css={styles.addToBasket}
                            variant='primary'
                            disabled={!isZipCodeEligible}
                            onClick={this.onClickEventHandler}
                        >
                            {isUserSDUTrialEligible ? addTrialToBasket : addSubscriptionToBasket}
                        </Button>
                    )}
                    {isSDUAddedToBasket && (
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
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    tabContainer: {
        paddingBottom: `${space[3]}`,
        marginLeft: -space[1],
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'start',
        gap: '0'
    },
    headerContainer: {
        verticalAlign: 'top',
        marginTop: '2px'
    },
    subHeader: {
        fontSize: `${fontSizes.sm}px`
    },
    boldText: {
        fontWeight: 'bold',
        lineHeight: `${fontSizes.md}px`,
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
        padding: `${space[1]}px  6px`,
        alignItems: 'center',
        borderRadius: `${space[1]}`
    },
    savingsText: {
        fontSize: `${fontSizes.base}px`,
        display: 'inline-block',
        paddingLeft: `${space[2]}px`
    },
    bagIcon: {
        marginLeft: `${space[3]}px`
    },
    colorRed: {
        color: `${colors.red}`,
        paddingLeft: '0px'
    },
    icon: {
        marginLeft: `${space[4]}px`
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
    availability: {
        fontWeight: 'bold',
        fontSize: `${fontSizes.base}px`,
        paddingTop: `${space[3]}`,
        paddingBottom: `${space[3]}`
    },
    faq: {
        paddingTop: `${space[3]}px`,
        marginBottom: `-${space[4]}px`
    },
    addToBasket: {
        backgroundColor: colors.red,
        width: '100%'
    },
    addedToBasket: {
        width: '100%',
        flexWrap: 'wrap'
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

SDULandingPageModal.defaultProps = {};

SDULandingPageModal.propTypes = {
    loadBCCContent: PropTypes.func.isRequired,
    isUserSDUTrialEligible: PropTypes.bool.isRequired,
    isSDUAddedToBasket: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    savingsText: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    SM_IMG_SIZE: PropTypes.number.isRequired,
    alreadyAddedText: PropTypes.string.isRequired,
    getUserSpecificProductDetails: PropTypes.func.isRequired,
    SDUSku: PropTypes.string.isRequired,
    basketType: PropTypes.string.isRequired,
    addToBasketAction: PropTypes.func.isRequired,
    openSDUConfirmationModal: PropTypes.func.isRequired,
    bccComps: PropTypes.array.isRequired,
    redirectToBasket: PropTypes.func.isRequired,
    isUserSDUTrialAllowed: PropTypes.bool.isRequired,
    fromChooseOptionsModal: PropTypes.bool
};

export default wrapComponent(SDULandingPageModal, 'SDULandingPageModal', true);
