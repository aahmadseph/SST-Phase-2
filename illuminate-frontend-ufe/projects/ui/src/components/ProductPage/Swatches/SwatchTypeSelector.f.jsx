import React, { useCallback } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Box } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/Swatches/locales', 'Swatches');

// Pre-create CSS styles to avoid recreating on each render
const outlineStyle = { outline: 0 };
const hoverStyle = {
    '.no-touch &:hover': {
        textDecoration: 'underline'
    }
};

// Separate Option component with its own memoized handler
function Option({ option, isActive, onSelect }) {
    const handleClick = useCallback(
        e => {
            e.preventDefault();
            onSelect(e, option);
        },
        [onSelect, option]
    );

    return (
        <Box
            key={option}
            data-at={Sephora.debug.dataAt(`${option.toLowerCase()}_btn`)}
            disabled={isActive}
            position='relative'
            height='2em'
            paddingX={'1em'}
            borderRadius='full'
            border={1}
            zIndex={isActive ? 0 : undefined}
            borderColor={isActive ? 'midGray' : 'transparent'}
            backgroundColor={isActive ? 'white' : undefined}
            css={[outlineStyle, isActive ? null : hoverStyle]}
            onClick={handleClick}
            children={getText(option)}
        />
    );
}

function SwatchTypeSelector({ options = [], activeType, onSelect }) {
    if (!options.length) {
        return null;
    }

    return (
        <Flex
            backgroundColor='lightGray'
            borderRadius='full'
            fontSize='sm'
        >
            {options.map(option => (
                <Option
                    key={option} // Use option as key instead of index for better reconciliation
                    option={option}
                    isActive={activeType === option}
                    onSelect={onSelect}
                />
            ))}
        </Flex>
    );
}

export default wrapFunctionalComponent(SwatchTypeSelector, 'SwatchTypeSelector');
