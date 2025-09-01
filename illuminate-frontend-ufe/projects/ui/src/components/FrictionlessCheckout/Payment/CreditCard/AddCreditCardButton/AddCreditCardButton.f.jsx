import agentAwareUtils from 'utils/AgentAware';
import IconCross from 'components/LegacyIcon/IconCross';
import { wrapFunctionalComponent } from 'utils/framework';
import React from 'react';
import { forms } from 'style/config';

import { Link, Text, Box } from 'components/ui';

const AddNewCreditCardButton = ({ onClick, label, debitCardDisclaimer, isCanada }) => (
    <Link
        hoverSelector='strong'
        display='flex'
        alignItems='center'
        aria-controls='creditcard_form'
        paddingTop={4}
        data-at={Sephora.debug.dataAt('add_new_credit_card')}
        onClick={onClick}
        className={agentAwareUtils.applyHideAgentAwareClassToTiers(['1', '2'])}
    >
        <IconCross
            fontSize={forms.RADIO_SIZE}
            fill='#666666'
        />
        <Box marginLeft={3}>
            <Text is='strong'>{label}</Text>
            {isCanada && (
                <Text
                    display='block'
                    fontSize='sm'
                    color='gray'
                >
                    {debitCardDisclaimer}
                </Text>
            )}
        </Box>
    </Link>
);

export default wrapFunctionalComponent(AddNewCreditCardButton, 'AddNewCreditCardButton');
