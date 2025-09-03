import React, { Fragment } from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import {
    Box, Button, Divider, Flex, Link, Text
} from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import CreditCard from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCard';

import localeUtils from 'utils/LanguageLocale';

import { colors } from 'style/config';

const { getLocaleResourceFile } = localeUtils;

class CreditCardList extends BaseClass {
    constructor(props) {
        super(props);

        const selectedCardId = props.userCreditCards.length
            ? (props.userCreditCards.find(card => card.isDefault) || props.userCreditCards[0]).creditCardId
            : null;

        this.state = { selectedCardId: selectedCardId };
    }

    handleSetSelectedCardId = selectedCardId => () => this.setState({ selectedCardId });

    render() {
        const { userCreditCards, removeSelectedCreditCard, setSelectedCreditCard, setCreditCardToEdit } = this.props;
        const { selectedCardId } = this.state;

        const userHasCreditCards = userCreditCards.length > 0;

        const getText = getLocaleResourceFile(
            'components/HappeningNonContent/ServiceBooking/ReviewAndPay/PaymentInfo/CreditCardList/locales',
            'CreditCardList'
        );

        return userHasCreditCards ? (
            <>
                <Text
                    is={'h4'}
                    fontSize={[null, null, 'md']}
                    fontWeight={'bold'}
                    lineHeight={'18px'}
                    children={getText('creditOrDebitCard')}
                />
                {userCreditCards.map((card, index) => {
                    const creditCardId = card.creditCardId;
                    const isExpired = card.isExpired;
                    const isChecked = !isExpired && selectedCardId === creditCardId;
                    const showDivider = index > 0 && index < userCreditCards.length;

                    return (
                        <Fragment key={creditCardId}>
                            {showDivider && <Divider />}
                            <Flex
                                flexDirection={'column'}
                                gap={2}
                            >
                                <Radio
                                    checked={isChecked}
                                    disabled={isExpired}
                                    alignItems={'center'}
                                    onChange={this.handleSetSelectedCardId(creditCardId)}
                                >
                                    <CreditCard
                                        isChangeMode
                                        {...card}
                                    />
                                </Radio>
                                <Flex
                                    gap={2}
                                    marginLeft={'94px'}
                                    alignItems={'center'}
                                >
                                    <Link
                                        color={'blue'}
                                        children={getText('edit')}
                                        onClick={setCreditCardToEdit(card)}
                                    />
                                    <Box
                                        height={'18px'}
                                        width={'1px'}
                                        borderLeft={`1px solid ${colors.gray}`}
                                    />
                                    <Link
                                        color={'blue'}
                                        children={getText('remove')}
                                        onClick={removeSelectedCreditCard(creditCardId)}
                                    />
                                </Flex>
                                {isExpired && (
                                    <Text
                                        is={'p'}
                                        color={'red'}
                                        children={getText('cardIsExpired')}
                                    />
                                )}
                                {isExpired ||
                                    (isChecked && (
                                        <Button
                                            marginTop={2}
                                            width={['100%', null, 194]}
                                            variant={'primary'}
                                            children={getText('useThisCard')}
                                            onClick={setSelectedCreditCard(card)}
                                        />
                                    ))}
                            </Flex>
                        </Fragment>
                    );
                })}
            </>
        ) : null;
    }
}

CreditCardList.defaultProps = {
    userCreditCards: []
};

export default wrapComponent(CreditCardList, 'CreditCardList', true);
