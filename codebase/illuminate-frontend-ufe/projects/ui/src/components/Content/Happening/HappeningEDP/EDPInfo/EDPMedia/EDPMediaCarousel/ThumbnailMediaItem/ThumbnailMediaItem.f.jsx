import React, { cloneElement } from 'react';

import { wrapFunctionalComponent } from 'utils/framework';

import { colors, radii } from 'style/config';

function ThumbnailMediaItem({ index, selected, onClick, children }) {
    return (
        <div css={styles.root}>
            <button
                css={[styles.initial, selected ? styles.active : styles.inactive]}
                onClick={() => onClick(index)}
            >
                {cloneElement(children, {
                    isThumbnail: true
                })}
            </button>
        </div>
    );
}

const styles = {
    root: {
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '100%'
    },
    initial: {
        display: 'block',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: radii.full,
        padding: 2,
        border: '2px solid transparent',
        transition: 'border-color .2s'
    },
    active: {
        borderColor: colors.black
    },
    inactive: {
        '.no-touch &:hover': {
            borderColor: colors.midGray
        }
    }
};

export default wrapFunctionalComponent(ThumbnailMediaItem, 'ThumbnailMediaItem');
