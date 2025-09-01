import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import {
    Box, Flex, Icon, Text, Link, Grid
} from 'components/ui';
import Chevron from 'components/Chevron';
import {
    colors, radii, space, mediaQueries
} from 'style/config';
import BasketConstants from 'constants/Basket';

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { wrapFunctionalComponent } = FrameworkUtils;
const { GIFT_MESSAGE_STATUS } = BasketConstants;

function fireAnalytics(analyticsLinkName) {
    return processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: analyticsLinkName,
            actionInfo: analyticsLinkName
        }
    });
}

function handleGiftMessageClick({ openAddGiftMessageModal, getGiftMessageThemes, orderId }) {
    const { country, channel, language } = Sephora.renderQueryParams;

    getGiftMessageThemes({
        country,
        channel,
        language,
        sid: 'giftMessages'
    }).then(response => {
        // TODO: handle filtering here, assign data and select default content
        fireAnalytics(anaConsts.ACTION_INFO.ADD_GIFT_MESSAGE);
        openAddGiftMessageModal(response?.data?.languages, orderId);
    });
}

function handleRemoveGiftMessage({ orderId, openRemoveGiftMessageModal }) {
    openRemoveGiftMessageModal(orderId);
    fireAnalytics(anaConsts.ACTION_INFO.REMOVE_GIFT_MESSAGE);
}

function handleEditGiftMessage({ openEditGiftMessageModal, getGiftMessageThemes, orderId }) {
    const { country, channel, language } = Sephora.renderQueryParams;

    getGiftMessageThemes({
        country,
        channel,
        language,
        sid: 'giftMessages'
    }).then(response => {
        // TODO: handle filtering here, assign data and select default content
        fireAnalytics(anaConsts.ACTION_INFO.EDIT_GIFT_MESSAGE);
        openEditGiftMessageModal(response?.data?.languages, orderId);
    });
}

function AddGiftMessage(props) {
    const {
        isCheckout,
        localization,
        openAddGiftMessageModal,
        getGiftMessageThemes,
        giftMessagingStatus,
        openRemoveGiftMessageModal,
        orderId,
        openEditGiftMessageModal,
        // RWD overrides
        chevronColor,
        chevronIsThicker,
        chevronMarginRight,
        marginTop,
        marginBottom,
        padding
    } = props;

    return (
        <Box
            backgroundColor='white'
            marginBottom={marginBottom || (isCheckout ? null : [-4, null])}
            marginTop={marginTop || (isCheckout ? 1 : [2, 3])}
            padding={padding || (isCheckout ? 0 : 4)}
            css={isCheckout && styles.box}
            borderRadius={2}
        >
            {giftMessagingStatus === GIFT_MESSAGE_STATUS.AVAILABLE && (
                <Flex
                    alignItems='center'
                    gap={[null, '6px', 3]}
                    lineHeight='tight'
                    width={'100%'}
                    justifyContent={['space-between', 'left']}
                    onClick={() => handleGiftMessageClick({ openAddGiftMessageModal, getGiftMessageThemes, orderId })}
                >
                    <Flex
                        alignItems='center'
                        gap={[2, 3]}
                    >
                        <Icon
                            name='giftBox'
                            size={[18, 24]}
                        />
                        <Text
                            fontWeight='bold'
                            children={localization.addGiftMessage}
                        />
                    </Flex>
                    <Chevron
                        direction='right'
                        isThicker={chevronIsThicker}
                        marginRight={chevronMarginRight || [1, null]}
                        color={chevronColor}
                    />
                </Flex>
            )}
            {giftMessagingStatus === GIFT_MESSAGE_STATUS.ADDED && (
                <Grid
                    columns={['auto', '1fr auto']}
                    gap={1}
                    lineHeight='tight'
                    alignItems='center'
                    justifyContent={'space-between'}
                >
                    <Flex
                        gap={[2, 3]}
                        alignItems='center'
                    >
                        <Icon
                            name='giftBox'
                            size={[18, 24]}
                        />
                        <Text
                            fontWeight='bold'
                            children={localization.giftMessageAdded}
                        />
                    </Flex>
                    <div>
                        <Link
                            color='blue'
                            padding={1}
                            onClick={() =>
                                handleRemoveGiftMessage({
                                    orderId,
                                    openRemoveGiftMessageModal
                                })
                            }
                            children={localization.remove}
                        />
                        <Text
                            color='midGray'
                            marginX='.5em'
                            children='|'
                        />
                        <Link
                            color='blue'
                            padding={1}
                            onClick={() => handleEditGiftMessage({ openEditGiftMessageModal, getGiftMessageThemes, orderId })}
                            children={localization.edit}
                        />
                    </div>
                </Grid>
            )}
        </Box>
    );
}

const styles = {
    box: {
        [mediaQueries.sm]: {
            borderRadius: radii[2],
            borderWidth: 1,
            borderColor: colors.midGray,
            padding: space[4]
        }
    }
};

AddGiftMessage.propTypes = {
    localization: PropTypes.shape({
        addGiftMessage: PropTypes.string.isRequired
    }).isRequired
};

export default wrapFunctionalComponent(AddGiftMessage, 'AddGiftMessage');
