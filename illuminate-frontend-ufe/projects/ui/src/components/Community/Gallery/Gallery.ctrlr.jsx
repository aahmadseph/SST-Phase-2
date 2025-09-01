import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Container } from 'components/ui';
import GalleryGreetings from 'components/Community/GalleryGreetings';
import TrendingSection from 'components/Community/TrendingSection';
import ExploreGallery from 'components/Community/ExploreGallery';
import pixleeUtils from 'utils/pixlee';
import PixleeUploader from 'components/Community/PixleeUploader';
import Banner from 'components/Content/Banner';
import { Divider, Box } from 'components/ui';
import { mediaQueries } from 'style/config';

const { getApprovedContentForPhoto, checkUserBeforeActions } = pixleeUtils;

class Gallery extends BaseClass {
    state = {
        openPixleeUploader: false
    };

    componentDidMount() {
        const photoId = new URLSearchParams(global.window?.location.search).get('photoId');
        const upload = new URLSearchParams(global.window?.location.search).get('upload');

        if (photoId) {
            getApprovedContentForPhoto(photoId).then(data => {
                this.props.toggleGalleryLightBox({
                    display: true,
                    sharedItem: data?.data
                });
            });
        }

        if (upload) {
            this.togglePixleeUploader();
        }
    }

    togglePixleeUploader =
        (closeUploader = false) =>
            () => {
                if (!closeUploader) {
                    checkUserBeforeActions().then(() => {
                        this.setState({
                            openPixleeUploader: true
                        });
                    });
                } else {
                    this.setState({
                        openPixleeUploader: false
                    });
                }
            };

    render() {
        const { banner } = this.props;

        return (
            <Container paddingX={2}>
                <GalleryGreetings />
                <TrendingSection togglePixleeUploader={this.togglePixleeUploader()} />
                {!!banner.sid && (
                    <>
                        <div css={styles.banneContainer}>
                            <Banner
                                {...banner}
                                marginTop={0}
                            />
                        </div>
                        <Box
                            marginX={['-6px', null, '0']}
                            paddingX={[0, 2]}
                        >
                            <Divider
                                marginBottom={['-4px', '12px']}
                                height='8px solid'
                            />
                        </Box>
                    </>
                )}
                <ExploreGallery togglePixleeUploader={this.togglePixleeUploader()} />
                {this.state.openPixleeUploader && <PixleeUploader closeUploader={this.togglePixleeUploader(true)} />}
            </Container>
        );
    }
}

const styles = {
    banneContainer: {
        padding: '0 8px',
        marginBottom: '32px',
        marginTop: '3px',
        [mediaQueries.xsMax]: {
            margin: '-10px 16px 16px'
        }
    }
};

export default wrapComponent(Gallery, 'Gallery', true);
