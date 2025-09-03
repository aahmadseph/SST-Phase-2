import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import UiUtils from 'utils/UI';
import { colors, radii } from 'style/config';
import { Box, Flex } from 'components/ui';

const { SKELETON_ANIMATION } = UiUtils;

const SwatchesSkeleton = props => {
    const { optionsCount, shape: SHAPE } = props;

    return (
        <Flex
            gap={2}
            css={styles.loadingSkus}
        >
            {[...Array(optionsCount).keys()].map(option => (
                <Box
                    css={[styles[SHAPE], SKELETON_ANIMATION]}
                    key={option}
                />
            ))}
        </Flex>
    );
};

const styles = {
    loadingSkus: {
        paddingTop: '.75rem',
        flexWrap: 'wrap'
    },
    circle: {
        backgroundColor: colors.lightGray,
        borderRadius: radii.full,
        width: 36,
        height: 36
    }
};

export default wrapFunctionalComponent(SwatchesSkeleton, 'SwatchesSkeleton');
