import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Button, Image, Text, Box
} from 'components/ui';
import PropTypes from 'prop-types';

function UniversalSorryMessageScreen(props) {
    const { goToCustomerService, weAreHereToHelp, pleaseReachOut, redirectToCustomerService } = props;

    return (
        <Box textAlign='center'>
            <Image
                display='block'
                marginY={4}
                src='/img/ufe/order/beautyInsiderCharacter.svg'
                marginX='auto'
                alt={goToCustomerService}
            />
            <Text
                is='p'
                fontWeight='bold'
                textAlign='center'
            >
                {weAreHereToHelp}
            </Text>
            <Text
                is='p'
                marginTop={2}
                marginBottom={4}
                textAlign='center'
            >
                {pleaseReachOut}
            </Text>
            <Button
                block={true}
                variant='secondary'
                onClick={redirectToCustomerService}
            >
                {goToCustomerService}
            </Button>
        </Box>
    );
}

UniversalSorryMessageScreen.propTypes = {
    goToCustomerService: PropTypes.string,
    weAreHereToHelp: PropTypes.string,
    pleaseReachOut: PropTypes.string,
    redirectToCustomerService: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(UniversalSorryMessageScreen, 'UniversalSorryMessageScreen');
