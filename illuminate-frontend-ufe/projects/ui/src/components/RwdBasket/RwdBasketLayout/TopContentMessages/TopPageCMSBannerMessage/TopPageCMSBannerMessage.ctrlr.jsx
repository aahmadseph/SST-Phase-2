import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { Grid, Image, Box } from 'components/ui';
import TopContentLayout from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentLayout';
import RichText from 'components/Content/RichText';
import uiUtils from 'utils/UI';
import Location from 'utils/Location';
import { wrapComponent } from 'utils/framework';
import { radii } from 'style/config';

const { SKELETON_OVERLAY } = uiUtils;
const RECOGNIZED_CLASS = '.isRecognized &';

class TopPageCMSBannerMessage extends BaseClass {
    state = {
        isDoubleLine: false
    };

    handleBannerMessageClick = e => {
        const { targetUrl, onClick } = this.props;

        if (onClick) {
            onClick(e);

            return;
        }

        Location.navigateTo(e, targetUrl);
    };

    render() {
        const {
            key, icon, text, showSkeleton, backgroundColor, alignItems, targetUrl, onClick, showBasketGreyBackground
        } = this.props;
        const shouldAddClickEvent = !!(targetUrl || onClick);

        return (
            <TopContentLayout
                updateIsDoubleLine={() => this.setState({ isDoubleLine: true })}
                backgroundColor={backgroundColor}
                showBasketGreyBackground={showBasketGreyBackground}
            >
                {!showSkeleton && (
                    <Grid
                        key={key}
                        columns={icon ? 'auto 1fr' : 'auto'}
                        gap={3}
                        lineHeight='tight'
                        alignItems={alignItems}
                        {...(shouldAddClickEvent && {
                            // Makes Grid act like a button with pointer cursor;
                            // not all banners are clickable.
                            onClick: e => this.handleBannerMessageClick(e)
                        })}
                    >
                        {icon && (
                            <Image
                                src={icon}
                                css={[
                                    {
                                        objectFit: 'contain',
                                        display: 'inline-block',
                                        width: '1em',
                                        height: '1em',
                                        fontSize: '20px',
                                        position: 'relative'
                                    },
                                    !this.state.isDoubleLine && {
                                        marginBottom: '-2px',
                                        marginTop: '2px'
                                    }
                                ]}
                                disableLazyLoad={true}
                            />
                        )}
                        <Box
                            paddingTop={this.state.isDoubleLine ? 0 : 1}
                            alignContent={['center', null]}
                        >
                            <RichText
                                content={text}
                                renderText={this.props.renderText}
                                style={{
                                    display: 'inline',
                                    p: {
                                        display: 'inline'
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                )}
                {showSkeleton && <div css={[{ [RECOGNIZED_CLASS]: SKELETON_OVERLAY }, styles.skeleton.banner]} />}
            </TopContentLayout>
        );
    }
}

const styles = {
    skeleton: {
        banner: {
            borderRadius: radii[2],
            overflow: 'hidden'
        }
    }
};

TopPageCMSBannerMessage.propTypes = {
    alignItems: PropTypes.string
};

TopPageCMSBannerMessage.defaultProps = {
    alignItems: 'normal'
};

export default wrapComponent(TopPageCMSBannerMessage, 'TopPageCMSBannerMessage');
