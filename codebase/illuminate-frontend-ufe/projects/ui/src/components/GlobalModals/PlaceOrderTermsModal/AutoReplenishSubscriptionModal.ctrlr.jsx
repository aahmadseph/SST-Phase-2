import React from 'react';
import _ from 'lodash';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Modal from 'components/Modal/Modal';
import {
    Text, Flex, Box, Divider
} from 'components/ui';
import { space, fontSizes, fontWeights } from 'style/config';
import ListItem from 'components/GlobalModals/PlaceOrderTermsModal/ListItem';
class AutoReplenishSubscriptionModal extends BaseClass {
    closeAutoReplenishSubscriptionModal = () => {
        const { onClose } = this.props;
        onClose();
    };

    render() {
        const {
            arTitle, arHeader, arSubscriptionScript, isOpen, orderItems, orderTotal
        } = this.props;

        const createMarkup = encodedHtml => ({
            __html: _.unescape(encodedHtml)
        });

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeAutoReplenishSubscriptionModal}
                isDrawer={true}
                width={4}
            >
                <Modal.Header>
                    <Modal.Title>{arTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Flex
                        flexDirection='row'
                        gap={`${space[6]}px`}
                        alignItems='start'
                    >
                        {/* Left side - Script content */}
                        <Box flex='1'>
                            <Text
                                is='p'
                                fontSize={fontSizes.base}
                                fontWeight={fontWeights.medium}
                                paddingBottom={space[5]}
                            >
                                {arHeader}
                            </Text>
                            <Text
                                is='p'
                                fontSize={fontSizes.base}
                                css={styles.scriptText}
                                lineHeight='base'
                            >
                                <div dangerouslySetInnerHTML={createMarkup(arSubscriptionScript)} />
                            </Text>
                        </Box>
                        {/* right side */}
                        <Box
                            flex='1'
                            css={{ borderLeft: '1px solid #EEEEEE' }}
                            paddingLeft={space[1]}
                        >
                            <Flex
                                justifyContent='space-between'
                                alignItems='center'
                                marginBottom={space[4]}
                                css={styles.orderTotalHeader}
                            >
                                <Text
                                    is='span'
                                    fontSize={fontSizes.base}
                                    fontWeight={fontWeights.bold}
                                >
                                    Estimated Order Total:
                                </Text>
                                <Text
                                    is='span'
                                    fontSize={fontSizes.base}
                                    fontWeight={fontWeights.bold}
                                >
                                    {orderTotal}
                                </Text>
                            </Flex>
                            <Divider marginY={2} />
                            <Text
                                is='p'
                                fontSize={fontSizes.base}
                                fontWeight={fontWeights.bold}
                                marginBottom={space[3]}
                            >
                                Items in order ({orderItems?.length || 0})
                            </Text>

                            <Box>
                                {orderItems?.map((item, index) => (
                                    <Box
                                        key={item.sku?.skuId || index}
                                        css={styles.itemContainer}
                                    >
                                        <ListItem item={item} />
                                        {index < orderItems.length - 1 && <Divider marginY={6} />}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Flex>
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    scriptText: {
        whiteSpace: 'pre-line'
    }
};

export default wrapComponent(AutoReplenishSubscriptionModal, 'AutoReplenishSubscriptionModal', true);
