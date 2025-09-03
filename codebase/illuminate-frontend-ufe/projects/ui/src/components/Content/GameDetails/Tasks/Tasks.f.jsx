import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import Carousel from 'components/Carousel';
import Task from 'components/Content/GameDetails/Tasks/Task';
import { space, site } from 'style/config';

const TASKS_PER_SLIDE = 4;
const TASK_GAP = [2, 3];
const TASK_WIDTH = [146, (site.containerMax - space[TASK_GAP[1]] * (TASKS_PER_SLIDE - 1)) / TASKS_PER_SLIDE];

const Tasks = ({
    tasks,
    pendingInfoTitle,
    pendingInfoDescription,
    fireTaskDetailAnalytics,
    setTaskDetailCTAAnalytics,
    joinTheChallengeCtaLabel,
    joinTheChallengeCtaEnabled,
    onJoinButtonClick,
    showJoinCta,
    gameEnded,
    localization
}) => (
    <Box marginTop={4}>
        <Carousel
            gap={TASK_GAP}
            paddingY={4}
            marginX='-container'
            scrollPadding={[2, 'container']}
            itemWidth={TASK_WIDTH}
            hasShadowHack={true}
            items={tasks.map((task, index) => (
                <Task
                    key={task.promoId + index}
                    pendingInfoTitle={pendingInfoTitle}
                    pendingInfoDescription={pendingInfoDescription}
                    fireTaskDetailAnalytics={fireTaskDetailAnalytics}
                    setTaskDetailCTAAnalytics={setTaskDetailCTAAnalytics}
                    joinTheChallengeCtaLabel={joinTheChallengeCtaLabel}
                    joinTheChallengeCtaEnabled={joinTheChallengeCtaEnabled}
                    onJoinButtonClick={onJoinButtonClick}
                    showJoinCta={showJoinCta}
                    gameEnded={gameEnded}
                    localization={localization}
                    {...task}
                />
            ))}
        />
    </Box>
);

Tasks.propTypes = {
    tasks: PropTypes.array.isRequired,
    pendingInfoTitle: PropTypes.string,
    pendingInfoDescription: PropTypes.string,
    promoId: PropTypes.string,
    fireTaskDetailAnalytics: PropTypes.func.isRequired,
    setTaskDetailCTAAnalytics: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(Tasks, 'Tasks');
