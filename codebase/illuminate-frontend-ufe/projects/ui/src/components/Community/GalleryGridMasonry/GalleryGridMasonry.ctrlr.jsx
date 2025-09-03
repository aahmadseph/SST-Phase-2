import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Grid, Button, Text, Container, Box
} from 'components/ui';
import { mediaQueries } from 'style/config';
import GalleryCard from 'components/Community/GalleryCard';

class GalleryGridMasonry extends BaseClass {
    render() {
        const { galleryItems, showSkeleton, showMoreButton, loadMorePhotos } = this.props;
        const { results, showMore, viewing } = this.props.localization;
        const galleryCards = showSkeleton ? this.props.gallerySkeleton : galleryItems;

        return (
            <Container
                paddingX={2}
                mb={8}
            >
                <Grid css={showSkeleton ? styles.skeletonGrid : styles.galleryGrid}>
                    {(galleryCards || []).map((card, index) => (
                        <GalleryCard
                            {...card}
                            key={`GalleryCard_${index.toString()}`}
                            index={index}
                            showSkeleton={showSkeleton}
                        />
                    ))}
                </Grid>
                {galleryItems?.length > 0 && (
                    <Box
                        textAlign='center'
                        mt={6}
                    >
                        <Text
                            is='p'
                            color='gray'
                            lineHeight='14px'
                            fontSize={'sm'}
                            marginBottom={2}
                            children={`${viewing} 1-${galleryItems?.length} ${results}`}
                        />
                        {showMoreButton && (
                            <Button
                                variant='secondary'
                                width='100%'
                                maxWidth='16.5em'
                                lineHeight='18px'
                                children={showMore}
                                onClick={loadMorePhotos}
                            />
                        )}
                    </Box>
                )}
            </Container>
        );
    }
}

const styles = {
    galleryGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: 'calc((100vw - 83px)/2)',
        gridGap: '10px',
        '.small': {
            gridRow: 'span 1'
        },
        '.medium': {
            gridRow: 'span 2'
        },
        '.large': {
            gridRow: 'span 2'
        },
        [mediaQueries.lg]: {
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridAutoRows: 'calc((100vw - 143px)/6)'
        },
        ['@media (min-width: 1280px)']: {
            gridAutoRows: '189px'
        }
    },
    skeletonGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: '200px',
        gridGap: '10px',
        '.small': {
            gridRow: 'span 1'
        },
        '.medium': {
            gridRow: 'span 2'
        },
        '.large': {
            gridRow: 'span 2'
        },
        [mediaQueries.lg]: {
            gridTemplateColumns: 'repeat(6, 1fr)'
        }
    }
};

export default wrapComponent(GalleryGridMasonry, 'GalleryGridMasonry', true);
