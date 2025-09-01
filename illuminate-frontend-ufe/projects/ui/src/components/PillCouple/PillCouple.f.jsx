import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

function PillCouple(props) {
    return (
        <Box
            baseCss={styles}
            {...props}
        />
    );
}

const styles = {
    '&': {
        position: 'relative',
        zIndex: 0
    },
    '& > *': {
        verticalAlign: 'top'
    },
    '& > *:focus': {
        position: 'relative',
        zIndex: 1
    },
    '& > :first-child': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        paddingRight: '1em'
    },
    '& > :last-child': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingLeft: '1em',
        marginLeft: 1
    },
    '& > [data-state="active"] ~ *': {
        borderWidth: 1,
        marginLeft: 0,
        marginRight: -1
    }
};

export default wrapFunctionalComponent(PillCouple, 'PillCouple');
