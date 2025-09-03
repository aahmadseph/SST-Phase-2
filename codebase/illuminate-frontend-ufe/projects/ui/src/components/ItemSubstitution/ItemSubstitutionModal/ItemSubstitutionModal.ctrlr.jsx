/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import Modal from 'components/Modal/Modal';
import {
    Box, Button, Text, Grid, Divider
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import FirstChoiceItem from 'components/ItemSubstitution/FirstChoiceItem';
import RecoProductsList from 'components/ItemSubstitution/RecoProductsList';
import Loader from 'components/Loader';
import ErrorMsg from 'components/ErrorMsg';

const getText = localeUtils.getLocaleResourceFile('components/ItemSubstitution/ItemSubstitutionModal/locales', 'ItemSubstitutionModal');

const MODAL_HEIGHT = 600;
const LOADER_HEIGHT = MODAL_HEIGHT - 250;

class ItemSubstitutionModal extends BaseClass {
    componentDidUpdate(prevProps) {
        const {
            selectedProductId, isLoadingProductRecs, pageLoadAnalytics, recoProducts, item, basket
        } = this.props;
        const loadingProductRecsFinished = prevProps.isLoadingProductRecs && !isLoadingProductRecs;

        if (selectedProductId && loadingProductRecsFinished) {
            const element = document.getElementById(selectedProductId);

            if (element) {
                element.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                });
            }
        }

        if (loadingProductRecsFinished && recoProducts) {
            const data = {
                firstChoiceItem: item,
                productRecs: recoProducts,
                basket
            };
            pageLoadAnalytics(data);
        }
    }

    handleSubstitution =
        ({ fulfillmentType, item, selectedSkuId }) =>
            () => {
                this.props.addOrRemoveSubstituteItem(item?.commerceId, selectedSkuId, fulfillmentType);

                const dataAnalytics = {
                    item,
                    selectedSkuId
                };

                this.props.confirmSubstituteItemsAnalytics(dataAnalytics);
            };

    onClose = () => {
        const { onDismiss, closeModalTracking, selectedSkuId } = this.props;
        closeModalTracking(selectedSkuId);
        onDismiss();
    };

    render() {
        const {
            isOpen, okBtnDisabled, okBtnText, isLoadingProductRecs, item, selectedSkuId, fulfillmentType, errorMessage, addItemErrorMessage
        } =
            this.props;

        const substitutionParams = {
            fulfillmentType,
            item,
            selectedSkuId
        };

        return (
            <Modal
                width={680}
                onDismiss={this.onClose}
                isOpen={isOpen}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title
                        children={getText('selectSubstitute')}
                        aria-label={getText('selectSubstitute')}
                        tabIndex={0}
                    />
                </Modal.Header>
                <Modal.Body css={{ padding: '0 !important' }}>
                    <Grid
                        gap={0}
                        columns={[1, '276px auto']}
                    >
                        <Box
                            borderColor='divider'
                            borderRightWidth={[null, 1]}
                            padding={[2, 5]}
                            paddingBottom={[0, 5]}
                        >
                            <Text
                                is='p'
                                fontWeight='bold'
                                paddingBottom={3}
                                aria-label={getText('selectSubstituteFor')}
                                tabIndex={0}
                            >
                                {getText('selectSubstituteFor')}
                            </Text>
                            <FirstChoiceItem item={this.props.item} />
                        </Box>
                        <Box
                            overflowY='auto'
                            height={[null, MODAL_HEIGHT]}
                            padding={[2, 5]}
                            paddingTop={0}
                        >
                            <Divider
                                marginY={3}
                                display={['block', 'none']}
                            />
                            <Text
                                is='p'
                                fontWeight='bold'
                                aria-label={getText('recommendedSubstitutions')}
                                tabIndex={0}
                            >
                                {getText('recommendedSubstitutions')}
                            </Text>
                            {isLoadingProductRecs ? (
                                <Loader
                                    hasBg={false}
                                    isInline={true}
                                    isShown={true}
                                    style={{
                                        height: LOADER_HEIGHT
                                    }}
                                />
                            ) : errorMessage ? (
                                <ErrorMsg children={errorMessage} />
                            ) : (
                                <RecoProductsList
                                    fulfillmentType={fulfillmentType}
                                    firstChoiceItem={this.props.item}
                                />
                            )}
                        </Box>
                    </Grid>
                </Modal.Body>
                <Modal.Footer hasBorder={true}>
                    {addItemErrorMessage && (
                        <Box
                            display='flex'
                            width={[null, '50%']}
                            justifyContent='center'
                            textAlign='center'
                            marginLeft='auto'
                            marginRight={[null, 2]}
                        >
                            <ErrorMsg children={addItemErrorMessage} />
                        </Box>
                    )}
                    <Box
                        gap={[2, 4]}
                        display={['grid', 'flex']}
                        gridTemplateColumns='1fr 1fr'
                        justifyContent={[null, 'flex-end']}
                    >
                        <Button
                            variant='secondary'
                            width={[null, '25%']}
                            onClick={this.onClose}
                            aria-label={getText('cancel')}
                            tabIndex={0}
                        >
                            {getText('cancel')}
                        </Button>
                        <Button
                            disabled={okBtnDisabled}
                            variant='special'
                            width={[null, '25%']}
                            onClick={this.handleSubstitution(substitutionParams)}
                            aria-label={okBtnText}
                            tabIndex={0}
                        >
                            {okBtnText}
                        </Button>
                    </Box>
                </Modal.Footer>
            </Modal>
        );
    }
}

ItemSubstitutionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    pageLoadAnalytics: PropTypes.func.isRequired
};

export default wrapComponent(ItemSubstitutionModal, 'ItemSubstitutionModal', true);
