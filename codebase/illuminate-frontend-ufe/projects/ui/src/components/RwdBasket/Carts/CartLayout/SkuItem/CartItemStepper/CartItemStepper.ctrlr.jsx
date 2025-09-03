import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import { Icon, Flex, Box } from 'components/ui';
import { colors, space } from 'style/config';

class CartItemStepper extends Component {
    handleIncrement = () => {
        const { onChange, commerceId, sku, qty } = this.props;
        onChange({ commerceId, newQty: qty + 1, sku });
    };

    handleDecrement = () => {
        const {
            onChange, onDelete, commerceId, sku, productId, qty
        } = this.props;

        if (qty > 1) {
            onChange({ commerceId, newQty: qty - 1, sku });
        } else {
            onDelete({ sku, productId, qty });
        }
    };

    render() {
        const { qty, fetching, disabled, quantities } = this.props;
        const maxQty = Array.isArray(quantities) && quantities.length > 0 ? Math.max(...quantities) : null;
        const isMax = maxQty != null && qty >= maxQty;
        const btnDisabled = fetching || disabled;
        const plusDisabled = btnDisabled || isMax;
        const plusButtonStyle = plusDisabled ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : { cursor: 'pointer' };

        return (
            <Flex css={styles.container}>
                <Flex
                    css={styles.controlsWrapper}
                    width={disabled ? '57px' : '88px'}
                >
                    <Box css={styles.decrementWrapper}>
                        <Box
                            onClick={this.handleDecrement}
                            opacity={qty <= 1 ? 1 : 0}
                            css={styles.trashIcon}
                        >
                            <Icon
                                name='trash'
                                ccolor={colors.gray}
                                size={24}
                            />
                        </Box>
                        <Box
                            onClick={this.handleDecrement}
                            opacity={qty > 1 ? 1 : 0}
                            css={styles.minusIcon}
                        >
                            <Icon
                                name='minus'
                                size={10}
                            />
                        </Box>
                    </Box>
                    <Box
                        css={styles.qtyBox}
                        color={disabled ? colors.gray : colors.black}
                        paddingRight={disabled ? '11px' : space[0]}
                    >
                        {qty}
                    </Box>
                    {!disabled && (
                        <Box
                            onClick={this.handleIncrement}
                            css={[styles.plusWrapper, plusButtonStyle]}
                        >
                            <Icon
                                name='plus'
                                size={10}
                            />
                        </Box>
                    )}
                </Flex>
            </Flex>
        );
    }
}
const styles = {
    container: {
        alignItems: 'center',
        gap: '10px'
    },
    controlsWrapper: {
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '20px',
        overflow: 'hidden',
        height: '25px',
        justifyContent: 'space-between'
    },
    decrementWrapper: {
        position: 'relative',
        width: space[5],
        height: '100%'
    },
    trashIcon: {
        position: 'absolute',
        top: '5px',
        left: space[3],
        textAlign: 'center'
    },
    minusIcon: {
        position: 'absolute',
        top: '2px',
        left: space[3],
        width: 12,
        height: 12,
        textAlign: 'center'
    },
    qtyBox: {
        textAlign: 'center'
    },
    plusWrapper: {
        width: space[5],
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

CartItemStepper.propTypes = {
    qty: PropTypes.number,
    fetching: PropTypes.bool,
    disabled: PropTypes.bool,
    quantities: PropTypes.array
};

export default wrapComponent(CartItemStepper, 'CartItemStepper', true);
