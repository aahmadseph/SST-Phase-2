import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';
import { mediaQueries } from 'style/config';

const PostDetailsContainer = ({ productTiles }) => {
    return (
        <Flex
            flexDirection={['column', null, 'row']}
            gap={[2, null, 3]}
        >
            {productTiles && <div css={styles.tilesContainer}>{productTiles}</div>}
        </Flex>
    );
};

PostDetailsContainer.propTypes = {
    children: PropTypes.node,
    productTiles: PropTypes.node
};

const styles = {
    tilesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        [mediaQueries.md]: {
            display: 'grid',
            width: 698,
            gap: 12,
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto auto',
            alignItems: 'start',
            justifyItems: 'start'
        }
    }
};

export default wrapFunctionalComponent(PostDetailsContainer, 'PostDetailsContainer');
