import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Image, Flex } from 'components/ui';
import { colors } from 'style/config';

const Status = ({ status }) => (
    <Flex
        flexDirection='row'
        marginBottom={2}
        alignItems='center'
    >
        <Image src='/img/ufe/checkmark.svg' />
        <Text
            children={status}
            is='p'
            color={colors.green}
            lineHeight='tight'
            fontWeight='bold'
            marginLeft={1}
            fontSize={['base', 'base', 'md']}
        />
    </Flex>
);

Status.propTypes = {
    status: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(Status, 'Status');
