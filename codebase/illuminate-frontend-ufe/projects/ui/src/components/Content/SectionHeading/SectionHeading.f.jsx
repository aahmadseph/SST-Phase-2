import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import RichText from 'components/Content/RichText';
import content from 'constants/content';

const { COMPONENT_SPACING } = content;

const SectionHeading = ({ sid, title, description }) => {
    if (!title) {
        return null;
    }

    return (
        <div>
            {sid && (
                <Box
                    id={sid}
                    position='absolute'
                    marginTop={[-COMPONENT_SPACING.LG[0], -COMPONENT_SPACING.LG[1]]}
                />
            )}
            <Box
                lineHeight='tight'
                marginTop={COMPONENT_SPACING.LG}
                marginBottom={4}
            >
                <Text
                    is='h2'
                    fontWeight={'demiBold'}
                    fontSize={['md', 'lg']}
                    lineHeight={'tight'}
                    marginBottom={description && 2}
                    children={title}
                />
                {description && (
                    <RichText
                        lineHeight={'tight'}
                        content={description}
                    />
                )}
            </Box>
        </div>
    );
};

SectionHeading.propTypes = {
    sid: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.object
};

SectionHeading.defaultProps = {
    sid: null,
    title: null,
    description: null
};

export default wrapFunctionalComponent(SectionHeading, 'SectionHeading');
