import Actions from 'Actions';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal';
import { Box, Button } from 'components/ui';
import React from 'react';
import typography from 'style/typography';
import { wrapComponent } from 'utils/framework';

class CreditCardOfferModal extends BaseClass {
    requestClose = () => {
        store.dispatch(Actions.showCreditCardOfferModal({ isOpen: false }));
    };

    render() {
        const firstBuyIncentive = Sephora.configurationSettings.firstBuyIncentive;
        const { isBasketPageTest } = this.props;

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={2}
            >
                <Modal.Header>
                    <Modal.Title>The Sephora Credit Card Program</Modal.Title>
                </Modal.Header>
                <Modal.Body css={[typography, styles.copy]}>
                    <p>
                        <strong>The Best Way to Shop for Beauty</strong>
                    </p>
                    <ul>
                        <li>
                            Get {firstBuyIncentive}% off your first Sephora purchase when you open and use your Sephora Credit Card today.<sup>1</sup>
                        </li>
                        <li>
                            Earn 4% back in Credit Card Rewards. That’s ${isBasketPageTest ? 10 : 5} in rewards for every $
                            {isBasketPageTest ? 250 : 125} you spend when you use your Sephora credit card at Sephora.<sup>2</sup>
                        </li>
                        <li>
                            No annual fee.<sup>3</sup>
                        </li>
                        <li>
                            Earn 2x Beauty Insider Points {isBasketPageTest && 'or 4%'} per $1 spent at Sephora using your Sephora card.<sup>i</sup>
                            {isBasketPageTest && ' That’s $10 in Beauty Insider Cash for every 500 Beauty Insider Points redeemed!'}
                        </li>
                        <li>
                            Plus, with the Sephora Visa Credit Card you earn even more: Earn 1% back in rewards when you use your card outside of
                            Sephora.<sup>2</sup>
                        </li>
                    </ul>
                    <Button
                        marginY={4}
                        width={['100%', 'auto']}
                        hasMinWidth={true}
                        variant='primary'
                        onClick={this.requestClose}
                        children='Got It'
                    />
                    <Box
                        fontSize='sm'
                        lineHeight='tight'
                    >
                        <p>
                            1 Cannot be combined with other offers. Valid one time only. The entire transaction amount after discount must be placed
                            on the Sephora Visa® or Sephora Credit Card. Valid only on purchases made in U.S. Sephora exclusive stores and online at{' '}
                            <a
                                target='_blank'
                                href='https://www.sephora.com'
                            >
                                www.sephora.com
                            </a>{' '}
                            (offer not valid at Sephora departments inside of other retailer stores). Not valid on previous purchases, purchases of
                            gift cards or eGift cards,{!isBasketPageTest && 'PLAY! by Sephora,'} packaging, applicable taxes, or shipping & handling
                            charges. New accounts opened in-store: discount applied in-store at checkout. New accounts opened on{' '}
                            <a
                                target='_blank'
                                href='https://www.sephora.com'
                            >
                                www.sephora.com
                            </a>
                            : discount applied by cardholder online at checkout. Must use within thirty (30) days from Account open date. Discount
                            value will be equally spread across all eligible items in the transaction. Discount value will be equally spread across
                            all eligible items in the transaction.
                        </p>
                        <p>
                            2 Offer is exclusive to Sephora Visa® or Sephora credit card holders enrolled in the Sephora Credit Card Rewards program.
                            4% back in Sephora Credit Card Rewards{' '}
                            {!isBasketPageTest && 'does not apply to purchases made at Sephora departments inside of other retailer stores'}
                            {isBasketPageTest && 'valid only on purchases made in U.S. Sephora exclusive stores and online at '}
                            {isBasketPageTest && (
                                <a
                                    target='_blank'
                                    href='https://www.sephora.com'
                                >
                                    www.sephora.com
                                </a>
                            )}
                            {isBasketPageTest && ' (offer not valid at Sephora departments inside of other retailer stores)'}. This rewards program is
                            provided by Sephora and its terms may change at any time. For full Rewards Terms and Conditions, please see{' '}
                            <a
                                target='_blank'
                                href='https://d.comenity.net/ac/sephoravisa/public/home'
                            >
                                Comenity.net/SephoraVisa
                            </a>{' '}
                            or{' '}
                            <a
                                target='_blank'
                                href='https://d.comenity.net/ac/sephoracard/public/home'
                            >
                                Comenity.net/SephoraCard
                            </a>
                            . Sephora Credit Card Rewards are issued in $5 increments with your billing statement.
                        </p>
                        <p>
                            3{' '}
                            <a
                                target='_blank'
                                href='https://d.comenity.net/sephoravisa/common/Legal/termsandconditions.xhtml'
                            >
                                Click here
                            </a>{' '}
                            for Important Rate, Fee, and Other Cost Information.
                        </p>
                        <p>
                            i Offer is exclusive to Sephora Visa® or Sephora credit card holders enrolled in the Sephora Credit Card Rewards program.
                            Cardholders will earn 2 Beauty Insider points per $1 spent with the Sephora Credit Card. Valid only on purchases made in
                            U.S. Sephora exclusive stores and online at{' '}
                            <a
                                target='_blank'
                                href='https://www.sephora.com'
                            >
                                sephora.com
                            </a>{' '}
                            (offer not valid at Sephora departments inside of other retailer stores).
                            {!isBasketPageTest && ' Sephora Credit Card Rewards are issued in $5 increments with your billing statement.'}
                        </p>
                        {this.props.rewardsMessagingABTest && (
                            <p>
                                i Cardholders will earn 2 Beauty Insider points per $1 spent with the Sephora Credit Card. Valid only on purchases
                                made in U.S. Sephora exclusive stores and online at{' '}
                                <a
                                    target='_blank'
                                    href='https://www.sephora.com'
                                >
                                    sephora.com
                                </a>{' '}
                                (offer not valid at Sephora departments inside of other retailer stores). Offer is exclusive to Sephora Credit Card
                                holders enrolled in the Sephora Credit Card Rewards program. This rewards program is provided by Sephora and its terms
                                may change at any time. For full Rewards Terms and Conditions, please see{' '}
                                <a
                                    target='_blank'
                                    href='https://d.comenity.net/ac/sephoracard/public/home'
                                >
                                    comenity.net/SephoraCard.
                                </a>
                            </p>
                        )}
                        <p>Credit card offers are subject to credit approval.</p>
                        <p>Sephora Credit Card Accounts are issued by Comenity Capital Bank.</p>
                        <p>
                            Sephora Visa® Credit Card Accounts are issued by Comenity Capital Bank pursuant to a license from Visa U.S.A. Inc. Visa is
                            a registered trademark of Visa International Service Association and used under license.
                        </p>
                    </Box>
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    copy: {
        ul: {
            marginBottom: 0
        },
        'li + li': {
            marginTop: '1em'
        }
    }
};

export default wrapComponent(CreditCardOfferModal, 'CreditCardOfferModal');
