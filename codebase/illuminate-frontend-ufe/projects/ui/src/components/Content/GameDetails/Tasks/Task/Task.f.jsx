import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Image, Flex, Text, Button
} from 'components/ui';
import OverlayImage from 'components/OverlayImage';
import Media from 'components/Content/Media';
import PendingPoints from 'components/Content/GameDetails/Tasks/Task/PendingPoints';

const TASK_PROGRESS = {
    PARTIAL: 'pending',
    COMPLETED: 'completed'
};

const Task = ({
    image,
    pointsText,
    description,
    showCtaLabel,
    ctaLabel,
    showCheckmark,
    pendingInfoTitle,
    pendingInfoDescription,
    id,
    promoId,
    fireTaskDetailAnalytics,
    setTaskDetailCTAAnalytics,
    modalCopy,
    modalCtaLabel,
    modalImage,
    modalTitle,
    modalCtaDisabled,
    modalCtaAction,
    modalStatus,
    joinTheChallengeCtaLabel,
    joinTheChallengeCtaEnabled,
    onJoinButtonClick,
    showJoinCta,
    gameEnded,
    localization,
    features,
    handleTaskModalCtaClick
}) => {
    const isPartial = showCheckmark === TASK_PROGRESS.PARTIAL;
    const isCompleted = showCheckmark === TASK_PROGRESS.COMPLETED;
    const gameIsCompleted = isPartial || isCompleted;

    const handleClick = event => {
        event.stopPropagation();
        handleTaskModalCtaClick({
            id,
            promoId,
            modalCopy,
            modalCtaLabel,
            modalImage,
            modalTitle,
            modalCtaDisabled,
            modalCtaAction,
            modalStatus,
            joinTheChallengeCtaLabel,
            joinTheChallengeCtaEnabled,
            onJoinButtonClick,
            showJoinCta,
            gameEnded,
            localization,
            features,
            gameIsCompleted,
            setTaskDetailCTAAnalytics,
            fireTaskDetailAnalytics
        });
    };

    return (
        <Flex
            padding={[3, 3, 5]}
            flexDirection='column'
            boxShadow='0px 0px 6px rgba(0, 0, 0, 0.2)'
            borderRadius={2}
            justifyContent='space-between'
            is='button'
            onClick={handleClick}
        >
            {image && (
                <OverlayImage
                    image={
                        <Media
                            {...image}
                            size={[64, 72]}
                        />
                    }
                    overlayImage={
                        showCheckmark ? (
                            <Image
                                src={`/img/ufe/${isPartial ? 'half-' : ''}filled-checkmark.svg`}
                                height={[20, 20, 32]}
                                width={[20, 20, 32]}
                            />
                        ) : null
                    }
                />
            )}
            <Flex
                height='100%'
                flexDirection='column'
            >
                {description && (
                    <Text
                        children={description}
                        paddingTop={4}
                        paddingBottom={3}
                        fontSize={['base', 'md']}
                        lineHeight='tight'
                    />
                )}
                <Flex
                    flexDirection='row'
                    alignItems='center'
                    flexWrap='wrap'
                >
                    {pointsText && (
                        <Text
                            children={pointsText}
                            fontWeight='bold'
                            lineHeight='tight'
                            fontSize={['base', 'md']}
                        />
                    )}
                    {isPartial && (
                        <Flex
                            marginLeft={1}
                            justifyContent='center'
                            alignItems='center'
                        >
                            <PendingPoints
                                pendingInfoTitle={pendingInfoTitle}
                                pendingInfoDescription={pendingInfoDescription}
                            />
                        </Flex>
                    )}
                </Flex>
            </Flex>
            {showCtaLabel && (
                <Button
                    children={ctaLabel}
                    variant='secondary'
                    marginTop={4}
                    paddingLeft={3}
                    paddingRight={3}
                    minHeight={32}
                    width={['100%', '100%', '160px']}
                    size='sm'
                    onClick={handleClick}
                />
            )}
        </Flex>
    );
};

Task.propTypes = {
    image: PropTypes.object,
    pointsText: PropTypes.string,
    description: PropTypes.string,
    showCtaLabel: PropTypes.bool,
    ctaLabel: PropTypes.string,
    showCheckmark: PropTypes.string,
    pendingInfoTitle: PropTypes.string,
    pendingInfoDescription: PropTypes.string,
    promoId: PropTypes.string,
    fireTaskDetailAnalytics: PropTypes.func.isRequired,
    setTaskDetailCTAAnalytics: PropTypes.func.isRequired,
    showGameInfoModal: PropTypes.func.isRequired,
    modalCopy: PropTypes.object,
    modalCtaLabel: PropTypes.string,
    modalImage: PropTypes.object,
    modalTitle: PropTypes.string,
    modalCtaDisabled: PropTypes.bool,
    modalCtaAction: PropTypes.object,
    modalStatus: PropTypes.string,
    features: PropTypes.object
};

export default wrapFunctionalComponent(Task, 'Task');
