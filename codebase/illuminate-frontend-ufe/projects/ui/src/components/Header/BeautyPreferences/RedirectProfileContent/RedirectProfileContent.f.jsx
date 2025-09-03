/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Grid, Link
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import ColorIQContent from 'components/Header/BeautyPreferences/ColorIQContent';
import { CONTAINER_SIZE } from 'constants/beautyPreferences';

function RedirectProfileContent({
    colorIQDesc1, colorIQDesc2, shadeFinder, openShadeFinderModal, hasColorIQ
}) {
    return (
        <>
            <Box
                margin={[null, null, '0 auto']}
                marginBottom={[4, null, 1]}
                maxWidth={[null, null, CONTAINER_SIZE]}
                position='relative'
                top={[null, null, '-20px']}
            >
                <Text>
                    {colorIQDesc1}
                    <Link
                        color='blue'
                        underline={true}
                        onClick={openShadeFinderModal}
                    >
                        {shadeFinder}
                    </Link>
                    <Markdown
                        display='inline'
                        css={{ p: { display: 'inline' } }}
                        content={colorIQDesc2}
                    />
                </Text>
            </Box>
            {hasColorIQ && (
                <Grid
                    columns={[null, null, 2]}
                    gap={1}
                    marginX={'auto'}
                    marginTop={[null, null, -1]}
                    maxWidth={[null, null, CONTAINER_SIZE]}
                >
                    <ColorIQContent />
                </Grid>
            )}
        </>
    );
}

RedirectProfileContent.propTypes = {
    colorIQDesc1: PropTypes.string.isRequired,
    colorIQDesc2: PropTypes.string.isRequired,
    shadeFinder: PropTypes.string.isRequired,
    hasColorIQ: PropTypes.bool
};

RedirectProfileContent.defaultProps = {
    hasColorIQ: false
};

export default wrapFunctionalComponent(RedirectProfileContent, 'RedirectProfileContent');
