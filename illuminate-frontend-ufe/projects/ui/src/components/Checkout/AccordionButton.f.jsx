import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Button } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const AccordionButton = function (props) {
    const { customStyle = {}, ...restProps } = props;
    const getText = localeUtils.getLocaleResourceFile('components/Checkout/locales', 'CheckoutMain');

    return (
        <Box marginTop={[5, 6]}>
            <Button
                data-at={Sephora.debug.dataAt('save_continue_btn')}
                variant='primary'
                hasMinWidth={true}
                {...restProps}
                css={customStyle.button}
            >
                {getText('saveContinueButton')}
            </Button>
        </Box>
    );
};

export default wrapFunctionalComponent(AccordionButton, 'AccordionButton');
