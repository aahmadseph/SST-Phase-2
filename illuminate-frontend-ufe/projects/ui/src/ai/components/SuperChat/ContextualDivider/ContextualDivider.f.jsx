import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Divider, Text } from 'components/ui';

function ContextualDivider({ label }) {
    if (!label) {
        return null;
    }

    return (
        <Flex
            flexDirection='column'
            width='100%'
        >
            <Divider marginBottom={2} />
            <Text
                fontSize='xs'
                css={styles.label}
            >
                {label}
            </Text>
        </Flex>
    );
}

const styles = {
    label: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
};

export default wrapFunctionalComponent(ContextualDivider, 'ContextualDivider');
