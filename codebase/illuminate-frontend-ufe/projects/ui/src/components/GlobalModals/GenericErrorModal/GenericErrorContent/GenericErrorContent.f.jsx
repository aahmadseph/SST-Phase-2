import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Image, Text } from 'components/ui';

const GenericErrorContent = ({ header, content }) => {
    return (
        <Flex
            flexDirection='column'
            textAlign='left'
            justifyContent='left'
            height={[null, 412]}
            fontSize={[null, 'md']}
            color='base'
            marginBottom={[9, 0]}
        >
            <Image
                src={'/img/ufe/generic-error.svg'}
                alt={header}
                width={120}
                height={120}
                marginBottom={5}
                marginTop={7}
            />
            <Text
                is='h2'
                fontWeight='bold'
                mb={2}
            >
                {header}
            </Text>
            {content}
        </Flex>
    );
};

export default wrapFunctionalComponent(GenericErrorContent, 'GenericErrorContent');
