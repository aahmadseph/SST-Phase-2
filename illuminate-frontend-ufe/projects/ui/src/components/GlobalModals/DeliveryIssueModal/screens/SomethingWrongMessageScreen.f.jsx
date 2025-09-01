import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Text, Box } from 'components/ui';
import { Link } from 'components/ui';

function SomethingWrongMessageScreen(props) {
    const {
        somethingWrong, please, contactCustomerService, orTryLater, redirectToCustomerService, iconImage, style
    } = props;

    const imageSrcs = {
        curbSide: '/img/ufe/order/curbsideConfirmation.svg',
        eyeLashes: '/img/ufe/order/eyeLashesCharacter.svg'
    };

    return (
        <Box
            textAlign='center'
            style={style}
        >
            <Image
                display='block'
                marginY={4}
                src={imageSrcs[iconImage]}
                width={120}
                marginX='auto'
                alt={somethingWrong}
            />
            <Text
                is='p'
                fontWeight='bold'
                textAlign='center'
            >
                {somethingWrong}
            </Text>
            <Text
                is='p'
                marginTop={2}
                marginBottom={4}
                textAlign='center'
            >
                {please}
                {redirectToCustomerService && (
                    <Link
                        color='blue'
                        aria-label={contactCustomerService}
                        onClick={redirectToCustomerService}
                        children={contactCustomerService}
                    />
                )}
                {orTryLater}
            </Text>
        </Box>
    );
}

SomethingWrongMessageScreen.propTypes = {
    somethingWrong: PropTypes.string,
    please: PropTypes.string,
    contactCustomerService: PropTypes.string,
    orTryLater: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    redirectToCustomerService: PropTypes.func,
    iconImage: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.string)
};

SomethingWrongMessageScreen.defaultTypes = {
    iconImage: 'curbSide'
};

export default wrapFunctionalComponent(SomethingWrongMessageScreen, 'SomethingWrongMessageScreen');
