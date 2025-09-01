import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Flex, Link
} from 'components/ui';

const BeautyInsiderModuleLayout = ({
    title, headerCtaTitle, headerCta, leftContentZone, rightContentZone, isSingleContentZone = false, content
}) => {
    return (
        <Box
            marginTop={[4, 5]}
            boxShadow='light'
            borderRadius={2}
        >
            <Flex
                alignItems='baseline'
                justifyContent='space-between'
                paddingTop={[4, 5]}
                paddingX={[4, 5]}
            >
                <Text
                    is='h2'
                    fontWeight='bold'
                    fontSize={['md', 'lg']}
                    children={title}
                />
                {typeof headerCtaTitle === 'function' ? (
                    headerCtaTitle()
                ) : (
                    <Link
                        children={headerCtaTitle}
                        data-at={Sephora.debug.dataAt('pfd_details_link')}
                        color='blue'
                        onClick={headerCta}
                    />
                )}
            </Flex>
            {isSingleContentZone ? (
                <Box
                    paddingTop={4}
                    paddingX={[4, 5]}
                    paddingBottom={[4, 5]}
                >
                    {content}
                </Box>
            ) : (
                <Flex
                    justifyContent='space-between'
                    flexWrap='wrap'
                    paddingTop={4}
                    paddingX={[4, 5]}
                    paddingBottom={[4, 5]}
                >
                    <Box flex={['0 0 100%', '0 0 calc(50% - 5px)']}>{leftContentZone}</Box>
                    <Box flex={['0 0 100%', '0 0 calc(50% - 5px)']}>{rightContentZone}</Box>
                </Flex>
            )}
        </Box>
    );
};

export default wrapFunctionalComponent(BeautyInsiderModuleLayout, 'BeautyInsiderModuleLayout');
