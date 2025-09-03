import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button, Flex } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/DeliveryFrequencyModal/locales', 'DeliveryFrequencyModal');

function DeliveryFrequencyCTA(props) {
    return (
        <Flex marginTop={3}>
            <Button
                onClick={props.onDismiss}
                marginRight={2}
                width='50%'
                variant='secondary'
            >
                {getText('cancel')}
            </Button>
            <Button
                onClick={props.onSave}
                width='50%'
                variant='primary'
            >
                {getText('save')}
            </Button>
        </Flex>
    );
}

export default wrapFunctionalComponent(DeliveryFrequencyCTA, 'DeliveryFrequencyCTA');
