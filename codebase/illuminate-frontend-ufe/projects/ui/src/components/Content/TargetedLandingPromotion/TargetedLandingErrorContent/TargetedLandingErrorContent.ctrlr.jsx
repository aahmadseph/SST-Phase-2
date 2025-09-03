/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import {
    Container, Text, Button, Image
} from 'components/ui';
import { ERROR_TYPE_DATA } from 'utils/TargetedLandingPromotion';

class TargetedLandingErrorContent extends BaseClass {
    render() {
        const { mainHeading, bodyText, buttonText, onClickCTA } = ERROR_TYPE_DATA[this.props.errorType];

        return (
            <Container
                paddingY={7}
                paddingX={4}
            >
                <Image
                    src='/img/ufe/icons/empty-state.svg'
                    size={96}
                />
                <Text
                    is='h2'
                    fontWeight='bold'
                    fontSize='md'
                    marginTop={5}
                    children={mainHeading}
                />
                <Text
                    is='p'
                    marginTop={1}
                    children={bodyText}
                />
                <Button
                    variant='primary'
                    children={buttonText}
                    width='100%'
                    marginTop={5}
                    maxWidth={['100%', 224]}
                    onClick={onClickCTA}
                />
            </Container>
        );
    }
}

export default wrapComponent(TargetedLandingErrorContent, 'TargetedLandingErrorContent', true);
