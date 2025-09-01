import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import LoveChunklet from 'components/Header/InlineLoves/LovesChunklets/LoveChunklet';

const LovesChunklets = ({
    lists, thumbnails, arrowWidth, arrowCircleWidth, handleLinkClick, toggleModal
}) => {
    return (
        <Carousel
            gap={2}
            marginX={0}
            paddingX={1}
            arrowWidth={arrowWidth}
            arrowCircleWidth={arrowCircleWidth}
            scrollPadding={'container'}
            itemWidth={'auto'}
            hasShadowHack={true}
            showArrowOnHover={true}
            minHeight={0}
            outdent={-16}
            items={lists.map(list => (
                <LoveChunklet
                    list={list}
                    thumbnails={thumbnails}
                    recapList={true}
                    handleLinkClick={handleLinkClick}
                    toggleModal={toggleModal}
                />
            ))}
        />
    );
};

LovesChunklets.propTypes = {
    lists: PropTypes.array,
    // Max number of product thumbnails to show in each chunklet
    thumbnails: PropTypes.number,
    // Width (in pixels) of the navigation arrows inside the circle used to go navigate the slides
    arrowWidth: PropTypes.number,
    // Width (in pixels) of the circle that contains the navigation arrows
    arrowCircleWidth: PropTypes.number
};

LovesChunklets.defaultProps = {
    lists: [],
    thumbnails: 3,
    arrowWidth: 10,
    arrowCircleWidth: 32
};

export default wrapFunctionalComponent(LovesChunklets, 'LovesChunklets');
