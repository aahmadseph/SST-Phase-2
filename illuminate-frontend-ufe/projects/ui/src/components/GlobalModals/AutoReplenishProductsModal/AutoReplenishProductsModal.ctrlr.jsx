import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Button, Text, Divider, Grid, Box, Flex
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import { getImageAltText } from 'utils/Accessibility';
import { shadows } from 'style/config';

const SM_IMG_SIZE = 64;

class AutoReplenishProductsModal extends BaseClass {
    closeModal = () => {
        this.props.showAutoReplenishProductsModal({
            isOpen: false
        });
    };

    renderItem = ({
        sku, replenishmentFrequency, qty, listPriceSubtotal, replenishmentItemPrice
    }, isLastItem) => {
        let replenishmentType = '',
            replenishmentNum = '';

        [replenishmentType = '', replenishmentNum = ''] = replenishmentFrequency.split(':');

        return (
            <>
                <Grid
                    gridTemplateColumns='auto 1fr'
                    gap={4}
                >
                    <ProductImage
                        id={sku.skuId}
                        size={[SM_IMG_SIZE, 87]}
                        skuImages={sku.skuImages}
                        disableLazyLoad={true}
                        altText={getImageAltText(sku)}
                    />
                    <Box paddingLeft={1}>
                        <Text
                            is='p'
                            children={sku.brandName}
                            fontSize='sm'
                            fontWeight='bold'
                        />
                        <Text
                            is='p'
                            fontSize='sm'
                            children={sku.productName}
                        />
                        {sku.variationType && sku.variationType !== 'None' && (
                            <Text
                                is='p'
                                fontSize='sm'
                                children={`${sku.variationTypeDisplayName}: ${sku.variationValue}`}
                            />
                        )}
                        <Text
                            is='p'
                            fontSize='sm'
                            marginTop={2}
                            marginLeft={-1}
                        >
                            {`${this.props.locales.deliverEvery}: `}
                            <Text
                                is='span'
                                fontWeight='bold'
                                children={`${replenishmentNum} ${replenishmentType}`}
                            />
                        </Text>
                        <Flex
                            marginTop={2}
                            justifyContent='space-between'
                        >
                            <Text
                                children={`${this.props.locales.qty}: ${qty}`}
                                fontSize='sm'
                                fontWeight='bold'
                            />
                            <Flex gap={1}>
                                <Text
                                    children={listPriceSubtotal}
                                    css={styles.subTotalText}
                                    is='p'
                                    fontSize='sm'
                                />
                                <Text
                                    children={replenishmentItemPrice || sku.replenishmentAdjusterPrice}
                                    is='p'
                                    fontSize='sm'
                                    color='red'
                                    fontWeight='bold'
                                />
                            </Flex>
                        </Flex>
                    </Box>
                </Grid>
                {!isLastItem && (
                    <Divider
                        marginTop={4}
                        marginBottom={4}
                    />
                )}
            </>
        );
    };

    render() {
        const {
            isOpen,
            locales: { deliveryFrequency, itemsInOrder, done }
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeModal}
                hasBodyScroll={true}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{deliveryFrequency}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={4}
                    paddingBottom={4}
                >
                    <Text
                        children={`${itemsInOrder} (${this.props.autoReplenishItems?.length})`}
                        fontWeight='bold'
                    />
                    <Divider
                        marginTop={4}
                        marginBottom={4}
                    />
                    {this.props.autoReplenishItems.map((item, index) => {
                        return this.renderItem(item, index + 1 === this.props.autoReplenishItems?.length);
                    })}
                </Modal.Body>
                <Modal.Footer css={styles.footerBoxShadow}>
                    <Button
                        variant='primary'
                        block={true}
                        onClick={this.closeModal}
                        children={done}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    footerBoxShadow: {
        boxShadow: shadows.light
    },
    subTotalText: {
        textDecoration: 'line-through'
    }
};

export default wrapComponent(AutoReplenishProductsModal, 'AutoReplenishProductsModal', true);
