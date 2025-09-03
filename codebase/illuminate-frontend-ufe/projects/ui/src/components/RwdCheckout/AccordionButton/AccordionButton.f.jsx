import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Button } from 'components/ui';

const AccordionButton = ({ customStyle = {}, localization, ...restProps }) => {
    const { saveContinueButton } = localization;

    return (
        <Box marginTop={[5, 6]}>
            <Button
                data-at={Sephora.debug.dataAt('save_continue_btn')}
                variant='primary'
                hasMinWidth={true}
                {...restProps}
                css={customStyle.button}
            >
                {saveContinueButton}
            </Button>
        </Box>
    );
};

export default wrapFunctionalComponent(AccordionButton, 'AccordionButton');
