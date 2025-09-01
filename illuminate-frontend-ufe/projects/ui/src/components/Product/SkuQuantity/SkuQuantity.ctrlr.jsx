import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text, Image } from 'components/ui';
import { screenReaderOnlyStyle, colors } from 'style/config';
import Select from 'components/Inputs/Select/Select';
import Chevron from 'components/Chevron/Chevron';
import { lineItem } from 'utils/LineItem';
import languageLocale from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import { forms } from 'style/config';
import { keyframes } from '@emotion/react';
import constants from 'components/Product/SkuQuantity/constants';
import skuHelpers from 'utils/skuHelpers';

const { getLocaleResourceFile } = languageLocale;
const { MIN_WIDTH } = constants;

class SkuQuantity extends BaseClass {
    state = {
        isInReplenishBasket: false,
        showUpdateMessage: false
    };
    componentDidMount() {
        this.setState({
            isInReplenishBasket: skuHelpers.isInAutoReplenishmentBasket(this.props.currentSku.skuId)
        });
    }
    componentDidUpdate(prevProps) {
        if ((this.props.basket && prevProps.basket !== this.props.basket) || this.props.currentSku.skuId !== prevProps.currentSku.skuId) {
            this.setState({
                isInReplenishBasket: skuHelpers.isInAutoReplenishmentBasket(this.props.currentSku.skuId)
            });
        }
    }

    handleQuantityChange = event => {
        const { value } = event.target;
        this.props.handleSkuQuantity(value);

        if (value === '0') {
            this.props.playUpdateAnimation();
        }
    };

    render() {
        const getText = getLocaleResourceFile('components/Product/SkuQuantity/locales', 'SkuQuantity');
        const {
            currentSku, inputProps, customStyle, showQuantityPicker, displayShowQuantityPicker, showUpdateMessage
        } = this.props;
        const isOutOfStock = currentSku.isOutOfStock;
        const id = 'qty_' + currentSku.skuId;
        const quantities = skuUtils.purchasableQuantities(this.props.currentSku, this.props.startFromZero);

        return (
            <Box>
                <label
                    htmlFor={id}
                    children={getText('qty')}
                    css={screenReaderOnlyStyle}
                />
                <Select
                    id={id}
                    {...inputProps}
                    value={isOutOfStock ? lineItem.OOS_QTY : this.props.skuQuantity}
                    aria-labelledby={id}
                    disabled={this.props.disabled}
                    onChange={this.handleQuantityChange}
                    marginBottom={null}
                    isNotSelectable={this.props.isNotSelectable}
                    isInReplenishBasket={this.state.isInReplenishBasket}
                    customStyle={{
                        input: {
                            minWidth: inputProps?.size ? MIN_WIDTH.SM : MIN_WIDTH.BASE,
                            textAlign: 'center',
                            ...customStyle,
                            ...(showQuantityPicker && displayShowQuantityPicker && styles.transparent),
                            ...(showUpdateMessage && styles.redBackground)
                        }
                    }}
                    data-at={Sephora.debug.dataAt('sku_qty')}
                    {...(((showQuantityPicker && displayShowQuantityPicker) || showUpdateMessage) && { chevronColor: 'transparent' })}
                >
                    {quantities.concat(isOutOfStock ? [lineItem.OOS_QTY] : []).map((option, index) => (
                        <>
                            <option
                                css={[{ color: forms.COLOR }, this.props.startFromZero && { backgroundColor: 'white' }]}
                                key={index.toString()}
                                value={option}
                            >
                                {!showUpdateMessage && option}
                            </option>
                            {showQuantityPicker && displayShowQuantityPicker && this.props.skuQuantity === option && getText('inBasket')}
                        </>
                    ))}
                </Select>
                {showQuantityPicker && displayShowQuantityPicker && (
                    <Box style={styles.selectOverlay}>
                        <Box style={styles.topRow}>
                            <Text fontWeight='bold'>
                                {this.props.skuQuantity} {getText('inBasket')}
                            </Text>
                            <Chevron
                                color={'white'}
                                direction='down'
                                size={8}
                                css={styles.chevron}
                            />
                        </Box>
                    </Box>
                )}
                {showUpdateMessage && (
                    <Box style={styles.basketUpdated}>
                        <Text fontWeight='bold'>{getText('basketUpdated')}</Text>
                        <Image
                            src='/img/ufe/success-login.svg'
                            width={20}
                            height={20}
                            disableLazyLoad={true}
                            marginLeft={2}
                        />
                    </Box>
                )}
            </Box>
        );
    }
}

const ANIMATE_FADE_OUT = keyframes`
    0% { opacity: 0; }
    17% { opacity: 1; }
    92% { opacity: 1; }
    100% { opacity: 0; }
`;

const styles = {
    selectOverlay: {
        color: 'white',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    basketUpdated: {
        color: 'white',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    topRow: {
        display: 'flex',
        alignItems: 'center'
    },
    transparent: {
        color: 'transparent',
        backgroundColor: colors.green
    },
    chevron: {
        position: 'relative',
        marginLeft: 8
    },
    redBackground: {
        color: 'transparent',
        backgroundColor: colors.red,
        animationName: ANIMATE_FADE_OUT,
        animationDuration: '1.5s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationFillMode: 'forwards'
    }
};

SkuQuantity.prototype.shouldUpdatePropsOn = ['currentSku.skuId', 'skuQuantity', 'basket'];

export default wrapComponent(SkuQuantity, 'SkuQuantity', true);
