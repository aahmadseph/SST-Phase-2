import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Button, Image, Text, Grid, Box
} from 'components/ui';
import PropTypes from 'prop-types';

function EligibleForReplacementScreen(props) {
    const {
        goToCustomerService,
        weAreHereToHelp,
        requestRefund,
        pleaseContact,
        requestReplacement,
        replaceOrder,
        weProvideReplacement,
        selectOne,
        createReplaceOrder,
        redirectToCustomerService
    } = props;

    return (
        <>
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
                fontSize='md'
                lineHeight='tight'
            >
                {weAreHereToHelp}
            </Text>
            <Text
                is='p'
                paddingTop={2}
                textAlign='center'
                lineHeight='tight'
            >
                {selectOne}
            </Text>
            <Grid
                padding={1}
                columns='auto 1fr'
                marginTop={6}
                alignItems='center'
            >
                <Image
                    src='/img/ufe/order/immediateRefund.svg'
                    width={64}
                    height={64}
                />
                <Box>
                    <Text
                        is='p'
                        fontWeight='bold'
                        fontSize='md'
                    >
                        {requestRefund}
                    </Text>
                    <Text
                        is='p'
                        marginY={2}
                    >
                        {pleaseContact}
                    </Text>
                    <Button
                        hasMinWidth={true}
                        variant='secondary'
                        onClick={redirectToCustomerService}
                    >
                        {goToCustomerService}
                    </Button>
                </Box>
            </Grid>
            <Grid
                padding={1}
                columns='auto 1fr'
                marginTop={6}
                alignItems='center'
            >
                <Image
                    src='/img/ufe/order/replacement.svg'
                    width={64}
                    height={64}
                />
                <div>
                    <Text
                        is='p'
                        fontWeight='bold'
                        fontSize='md'
                    >
                        {requestReplacement}
                    </Text>
                    <Text
                        is='p'
                        marginY={2}
                    >
                        {weProvideReplacement}
                    </Text>
                    <Button
                        hasMinWidth={true}
                        variant='secondary'
                        onClick={createReplaceOrder}
                    >
                        {replaceOrder}
                    </Button>
                </div>
            </Grid>
        </>
    );
}

EligibleForReplacementScreen.propTypes = {
    goToCustomerService: PropTypes.string,
    weAreHereToHelp: PropTypes.string,
    requestRefund: PropTypes.string,
    pleaseContact: PropTypes.string,
    requestReplacement: PropTypes.string,
    replaceOrder: PropTypes.string,
    weProvideReplacement: PropTypes.string,
    createReplaceOrder: PropTypes.func.isRequired,
    redirectToCustomerService: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(EligibleForReplacementScreen, 'EligibleForReplacementScreen');
