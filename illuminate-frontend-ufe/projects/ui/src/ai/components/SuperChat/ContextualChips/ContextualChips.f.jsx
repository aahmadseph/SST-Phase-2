import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { mediaQueries, space, colors } from 'style/config';
import { Flex } from 'components/ui';
import Chiclet from 'components/Chiclet';

function ContextualChips({ chips = [], sendMessage, onChipClick }) {
    if (!chips || chips.length === 0) {
        return null;
    }

    const handleChipClick = chip => {
        if (onChipClick) {
            onChipClick(chip);
        } else if (sendMessage && chip?.content) {
            sendMessage(chip.content);
        }
    };

    const handleKeyDown = (e, chip) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleChipClick(chip);
        }
    };

    return (
        <Flex
            css={styles.container}
            gap={2}
            role='group'
            aria-label='Contextual suggestions'
        >
            {chips.map(chip => {
                return (
                    <Chiclet
                        key={chip?.id}
                        variant='shadow'
                        children={chip?.content}
                        onClick={() => handleChipClick(chip)}
                        css={styles.chiclet}
                        aria-label={`Suggestion: ${chip?.content}`}
                        tabIndex={0}
                        onKeyDown={e => handleKeyDown(e, chip)}
                    />
                );
            })}
        </Flex>
    );
}

const styles = {
    container: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        [mediaQueries.xsMax]: {
            position: 'fixed',
            bottom: 80,
            left: space[2],
            right: 0,
            backgroundColor: colors.white,
            padding: space[2],
            height: 57,
            flexDirection: 'row',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            scrollPadding: space[2],
            scrollBehavior: 'smooth'
        }
    },
    chiclet: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        width: 'auto',
        alignSelf: 'flex-start',
        [mediaQueries.xsMax]: {
            whiteSpace: 'nowrap'
        }
    }
};

export default wrapFunctionalComponent(ContextualChips, 'ContextualChips');
