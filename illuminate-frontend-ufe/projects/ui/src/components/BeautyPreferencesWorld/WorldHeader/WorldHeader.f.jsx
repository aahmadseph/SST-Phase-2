import React from 'react';
import { Box, Text } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import WorldNavigation from 'components/BeautyPreferencesWorld/WorldNavigation/WorldNavigation';

function WorldHeader({ worldName, refinementsCount, completedRefinementsCount }) {
    return (
        <>
            <WorldNavigation worldName={worldName} />
            <Box
                marginBottom={4}
                maxWidth='152px'
            >
                <Text
                    is='h1'
                    fontWeight='bold'
                    fontSize={['lg', null, 'xl']}
                    children={worldName}
                    marginBottom={2}
                />
                <ProgressBar
                    total={refinementsCount}
                    completed={completedRefinementsCount}
                />
            </Box>
        </>
    );
}

export default wrapFunctionalComponent(WorldHeader, 'WorldHeader');
