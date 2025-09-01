import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Divider } from 'components/ui';

function AddReviewTitle(props) {
    return (
        <>
            <Text
                is='h1'
                fontSize='xl'
                fontFamily='serif'
                textAlign='center'
                lineHeight='tight'
                marginY={[4, 5]}
                children={props.children}
            />
            <Divider
                marginBottom={[5, 6]}
                marginX={['-container', 0]}
            />
        </>
    );
}

export default wrapFunctionalComponent(AddReviewTitle, 'AddReviewTitle');
