import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Divider
} from 'components/ui';

const ApplyFlowSection = props => {
    const { title, note, children } = props;

    return (
        <Box>
            <Divider marginY={5} />
            <Flex
                alignItems='baseline'
                justifyContent='space-between'
            >
                <Text
                    is='h2'
                    fontWeight='bold'
                    fontSize={['md', 'lg']}
                    marginBottom={5}
                    children={title}
                />
                {note && (
                    <Text
                        is='p'
                        fontSize='sm'
                        color='gray'
                        children={note}
                    />
                )}
            </Flex>
            {children}
        </Box>
    );
};

export default wrapFunctionalComponent(ApplyFlowSection, 'ApplyFlowSection');
