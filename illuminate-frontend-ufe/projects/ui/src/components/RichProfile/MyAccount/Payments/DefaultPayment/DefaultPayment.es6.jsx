/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import { Text, Link } from 'components/ui';
import StringUtils from 'utils/String';

class DefaultPayment extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { isEditMode: false };
    }

    deletePayment = () => {
        const { onDeleteClick, defaultPaymentName } = this.props;

        if (onDeleteClick) {
            onDeleteClick(defaultPaymentName);
        }
    };

    render() {
        const { isEditMode } = this.state;
        const {
            defaultPaymentName, deletePaymentOptionText, defaultPaymentText, cancelText, editText, paymentNameAccount
        } = this.props;
        const freePaymentName = defaultPaymentName === 'klarna' ? 'Klarna' : 'Afterpay';

        return (
            <div>
                <LegacyGrid>
                    <LegacyGrid.Cell width='fill'>
                        <Text
                            is='p'
                            marginBottom={2}
                            lineHeight='tight'
                        >
                            {StringUtils.format(paymentNameAccount, freePaymentName)}
                        </Text>
                        {isEditMode ? (
                            <Link
                                color='blue'
                                lineHeight='tight'
                                paddingY={2}
                                marginY={-2}
                                onClick={this.deletePayment}
                            >
                                {deletePaymentOptionText}
                            </Link>
                        ) : (
                            <Text
                                is='p'
                                color='gray'
                            >
                                {defaultPaymentText}
                            </Text>
                        )}
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell
                        width='4em'
                        textAlign='right'
                    >
                        <Link
                            color='blue'
                            lineHeight='tight'
                            paddingY={2}
                            marginY={-2}
                            onClick={() => this.setState({ isEditMode: !isEditMode })}
                        >
                            {isEditMode ? cancelText : editText}
                        </Link>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            </div>
        );
    }
}

DefaultPayment.propTypes = {
    defaultPaymentName: PropTypes.string.isRequired
};

export default wrapComponent(DefaultPayment, 'DefaultPayment');
