import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Box } from 'components/ui';

function LanguageSelector({ options = [], activeType, onSelect }) {
    return options.length > 0 ? (
        <Flex
            backgroundColor='lightGray'
            borderRadius='full'
            fontSize='sm'
        >
            {options.map((option, index) => {
                const isActive = activeType === option.key;

                return (
                    <Box
                        key={index}
                        aria-label={option.name}
                        data-at={Sephora.debug.dataAt(`${option.name.toLowerCase()}_btn`)}
                        position='relative'
                        height='2em'
                        paddingX={'1em'}
                        borderRadius='full'
                        border={1}
                        zIndex={isActive && 0}
                        borderColor={isActive ? 'midGray' : 'transparent'}
                        backgroundColor={isActive && 'white'}
                        css={[
                            styles.focusVisible,
                            isActive || {
                                '.no-touch &:hover': {
                                    textDecoration: 'underline'
                                }
                            }
                        ]}
                        onClick={e => !isActive && onSelect(e, option.key)}
                        children={option.name}
                        aria-pressed={isActive}
                    />
                );
            })}
        </Flex>
    ) : null;
}

const styles = {
    focusVisible: {
        outline: 0,
        '&:focus-visible': {
            outline: '2px solid #0066cc',
            outlineOffset: '2px'
        }
    }
};

export default wrapFunctionalComponent(LanguageSelector, 'LanguageSelector');
