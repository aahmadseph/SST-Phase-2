import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Button, Link, Box, Flex, Text
} from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import store from 'store/Store';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

const { dispatch } = store;
const { Media } = mediaUtils;
const { goToPickUpBasket, goToDCBasket, resetSwitchedItem } = RwdBasketActions;
const { getLocaleResourceFile } = localeUtils;

function ConfirmationBox({
    isAvailable,
    itemDescription,
    basketOrderVar,
    switchItemMessage,
    isLink,
    isLinkToBopisBasket,
    onUndoArgs,
    onUndoChangeMethod,
    itemDeliveryMethod
}) {
    if (!isAvailable) {
        return null;
    }

    const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/ConfirmationBox/locales', 'ConfirmationBox');
    const basketOrderName = getText(basketOrderVar);

    const renderGotItButton = size => (
        <Button
            variant='secondary'
            size={size}
            onClick={() => dispatch(resetSwitchedItem())}
            children={getText('gotIt')}
            data-at={Sephora.debug.dataAt('bsk_method_changed_got_it_button')}
        />
    );

    const sendUndoAnalytics = () => {
        const actionInfo = `change method:${anaConsts.Event.UNDO_DELIVERY_CHANGE}`;
        const skuId = onUndoArgs?.skuId;
        const products = [{ sku: { skuId } }];
        // Process event when delivery method is switched
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo, //Prop55
                linkName: actionInfo,
                previousDeliveryMethod: anaConsts.DELIVERY_OPTIONS_MAP[itemDeliveryMethod],
                productStrings: [anaUtils.buildProductStrings({ products })]
            }
        });
    };

    return (
        <Box
            borderBottom={`1px solid ${colors.lightGray}`}
            marginX={[3, 4]}
            paddingY={4}
        >
            <Flex
                backgroundColor={colors.nearWhite}
                borderRadius={2}
                flexDirection='column'
                gap={3}
                paddingX={[3, 4]}
                paddingY={3}
            >
                <Text
                    is='p'
                    fontSize={['sm', 'base']}
                    data-at={Sephora.debug.dataAt('bsk_method_changed_label')}
                >
                    <Text
                        fontWeight='bold'
                        children={itemDescription}
                    />
                    {` ${getText('movedToYour')} `}
                    {isLink ? (
                        <Link
                            color={colors.blue}
                            css={{ display: 'contents' }}
                            onClick={() => dispatch(isLinkToBopisBasket ? goToPickUpBasket() : goToDCBasket())}
                            children={basketOrderName}
                        />
                    ) : (
                        basketOrderName
                    )}
                    {switchItemMessage && ` ${getText('subItemRemoved')}`}
                </Text>
                <Flex
                    alignItems='center'
                    gap={3}
                >
                    <Media at='xs'>{renderGotItButton('xs')}</Media>
                    <Media greaterThan='xs'>{renderGotItButton('sm')}</Media>
                    {onUndoChangeMethod && !switchItemMessage && (
                        <Link
                            color={colors.blue}
                            fontSize={['sm', 'base']}
                            onClick={() => {
                                onUndoChangeMethod(onUndoArgs);
                                sendUndoAnalytics();
                            }}
                            children={getText('undo')}
                            data-at={Sephora.debug.dataAt('bsk_method_changed_undo_button')}
                        />
                    )}
                </Flex>
            </Flex>
        </Box>
    );
}

export default wrapFunctionalComponent(ConfirmationBox, 'ConfirmationBox');
