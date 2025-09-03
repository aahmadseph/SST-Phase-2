import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Link, Text, Flex, Image
} from 'components/ui';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import Chevron from 'components/Chevron';
import { space, mediaQueries, fontWeights } from 'style/config';

const RefinementWorldLink = world => {
    const {
        worldName, worldKey, completedRefinements, totalRefinements, onWorldClick
    } = world;

    if (!worldName || !worldKey) {
        return null;
    }

    const handleWorldClick = e => {
        onWorldClick?.(e, world);
    };

    return (
        <>
            <Link
                href={`/profile/BeautyPreferences/${worldKey}`}
                css={styles.worldLink}
                onClick={handleWorldClick}
            >
                <Flex css={styles.worldInfo}>
                    <Image
                        alt={`${worldName} icon`}
                        aria-hidden='true'
                        src={`/img/ufe/beauty-preferences-redesigned/${worldKey?.toLowerCase()}-world.svg`}
                        size={32}
                    />
                    <Flex css={styles.worldDescription}>
                        <Text
                            is='h2'
                            fontWeight={fontWeights.bold}
                            fontSize={['md', null, 'lg']}
                        >
                            {worldName}
                        </Text>
                        <ProgressBar
                            total={totalRefinements}
                            completed={completedRefinements}
                        />
                    </Flex>
                </Flex>
                <Chevron isThicker={true} />
            </Link>
        </>
    );
};

const styles = {
    worldLink: {
        display: 'flex',
        alignItems: 'center',
        gap: space[5],
        marginBottom: space[4],
        width: '100%',
        [mediaQueries.smMax]: {
            justifyContent: 'space-between'
        }
    },
    worldInfo: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        maxWidth: '192px',
        gap: space[2]
    },
    worldDescription: {
        flex: 1,
        flexDirection: 'column'
    }
};

RefinementWorldLink.propTypes = {
    worldName: PropTypes.string,
    worldKey: PropTypes.string,
    onWorldClick: PropTypes.func,
    completedRefinements: PropTypes.number,
    totalRefinements: PropTypes.number
};

export default wrapFunctionalComponent(RefinementWorldLink, 'RefinementWorldLink');
