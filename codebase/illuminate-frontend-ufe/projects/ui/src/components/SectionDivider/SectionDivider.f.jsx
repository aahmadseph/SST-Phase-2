import React from 'react';
import { Divider } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function SectionDivider(props) {
    return (
        <Divider
            color={['nearWhite', 'lightGray']}
            height={[3, 1]}
            marginX={['-container', 0]}
            {...props}
        />
    );
}

SectionDivider.defaultProps = {
    marginY: 5
};

export default wrapFunctionalComponent(SectionDivider, 'SectionDivider');
