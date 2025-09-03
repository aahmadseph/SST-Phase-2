import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Image, Text } from 'components/ui';

function AccessPointsNoResults({
    errorCode, enterSearchParams, unableToFindResults, noStoresFound, pleaseTryAgain
}) {
    return (
        <Box
            marginY={7}
            textAlign='center'
        >
            <Image
                display='block'
                src='/img/ufe/no-result.svg'
                size={128}
                marginX='auto'
            />
            <Text
                is='p'
                marginTop={5}
                fontWeight='bold'
            >
                {errorCode && errorCode >= 500 && (
                    <React.Fragment>
                        <span>{unableToFindResults}</span>
                        <br />
                        <br />
                        <span>{pleaseTryAgain}</span>
                    </React.Fragment>
                )}
                {errorCode && errorCode >= 400 && errorCode < 500 && noStoresFound}
                {!errorCode && enterSearchParams}
            </Text>
        </Box>
    );
}

AccessPointsNoResults.defaultProps = {
    location: '',
    errorCode: null
};

export default wrapFunctionalComponent(AccessPointsNoResults, 'AccessPointsNoResults');
