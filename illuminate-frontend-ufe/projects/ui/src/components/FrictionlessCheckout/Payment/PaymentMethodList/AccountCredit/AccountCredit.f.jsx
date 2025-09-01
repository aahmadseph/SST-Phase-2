import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Grid, Image, Text, Divider
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { PAYMENT_LOGO_SIZE } from 'constants/Checkout';
import dateUtils from 'utils/Date';

const AccountCredit = ({ locales, storeCredit, ...props }) => (
    <>
        <Box py={4}>
            <Checkbox
                paddingY={0}
                checked={true}
                disabled={true}
                alignItems='center'
            >
                <Grid
                    columns='auto 1fr'
                    gap={3}
                    alignItems='center'
                    lineHeight='tight'
                    {...props}
                >
                    <Image
                        display='block'
                        src='/img/ufe/payments/accountCredit.svg'
                        alt={locales.accountCreditAltText}
                        {...PAYMENT_LOGO_SIZE}
                    />
                    <div>
                        <Text
                            is='p'
                            fontWeight='bold'
                        >
                            + {storeCredit.amount} {locales.storeCreditApplied}
                        </Text>

                        {storeCredit.expirationDate ? (
                            <Text
                                data-at={Sephora.debug.dataAt('ac_expires_label')}
                                fontSize='sm'
                                children={`${locales.expires} ${dateUtils.getCreditCardExpiry(storeCredit.expirationDate)}`}
                            />
                        ) : null}
                    </div>
                </Grid>
            </Checkbox>
        </Box>
        <Divider />
    </>
);

export default wrapFunctionalComponent(AccountCredit, 'AccountCredit');
