/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Grid, Text, Button, Flex, Divider, Image
} from 'components/ui';
import {
    colors, fontSizes, fontWeights, space, mediaQueries, borders, radii
} from 'style/config';
import biApi from 'services/api/beautyInsider';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import store from 'store/Store';
import Actions from 'Actions';
import mediaUtils from 'utils/Media';
import Modal from 'components/Modal/Modal';
import BiBarcode from 'components/BiBarcode/BiBarcode';
import { UserInfoReady } from 'constants/events';
import { HEADER_VALUE } from 'constants/authentication';

const { Media } = mediaUtils;
const BI_TYPES = userUtils.types;

const getText = localeUtils.getLocaleResourceFile('components/ProfileBanner/locale', 'ProfileBanner');
const ORIGINS = {
    BEAUTY: 'beautyInsider',
    REWARDS: 'rewardsBazaar'
};

class MainProfileBanner extends BaseClass {
    state = {
        realTimeVIBMessages: [],
        userLoaded: false,
        showBarcode: false
    };

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            this.getBiPoints();
            this.setState({ userLoaded: true });
        });
    }

    getBiPoints = () => {
        if (this.props.user?.profileId) {
            biApi.getBiPoints(this.props.user?.profileId).then(biInfo => {
                this.setState({
                    realTimeVIBMessages: biInfo.realTimeVIBMessages
                });
            });
        }
    };

    render() {
        const { isAtLeastRecognized, origin } = this.props;

        return (
            <Box css={styles.container}>
                <Grid
                    columns={[1, 2]}
                    gap={[5, 0]}
                    padding={[4, 6]}
                >
                    {this.Title(origin)}
                    {this.state.userLoaded && <>{isAtLeastRecognized ? this.SignedIn() : this.SignedOut()}</>}
                </Grid>
                <Media lessThan='md'>
                    <Modal
                        isOpen={this.state.showBarcode}
                        isDrawer={true}
                        onDismiss={() => this.setState({ showBarcode: false })}
                    >
                        <Modal.Header>
                            <Modal.Title>{getText('barcodeTitle')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Text
                                is='p'
                                lineHeight='tight'
                                marginBottom={4}
                                children={getText('barcodeDesc')}
                            />
                            <BiBarcode profileId={this.props.user?.profileId} />
                        </Modal.Body>
                    </Modal>
                </Media>
            </Box>
        );
    }

    SignedIn = () => {
        const { netBeautyBankPointsAvailable } = this.props;
        const biStatus = userUtils.getBiStatus();
        const statusText = biStatus === BI_TYPES.BI ? 'insiderText' : 'vibText';
        const statusDisplay = userUtils.displayBiStatus(biStatus);
        const { realTimeVIBMessages } = this.state;

        const logoProps = {
            src: `/img/ufe/bi/new-logo-${statusDisplay.toLowerCase()}.svg`,
            height: [22, 29],
            alt: statusDisplay
        };

        return (
            <Grid
                css={styles.smuiGrid}
                columns={[2, 4]}
                gap={0}
            >
                <Box marginRight={[0, 5]}>
                    <Text
                        is='p'
                        children={getText(statusText)}
                    />
                    <Box marginTop={3}>
                        <Image {...logoProps} />
                    </Box>
                </Box>
                <Box>
                    <Text
                        is='p'
                        children={getText('pointsText')}
                        css={styles.bigNumber}
                    />
                    <Text
                        children={netBeautyBankPointsAvailable}
                        fontWeight='bold'
                        fontSize={[space[6], 40]}
                        lineHeight='tight'
                        css={styles.bigNumber}
                    />
                </Box>
                <div css={styles.verticalDivider} />
                <Box
                    gridColumn={['1 / 3', 4]}
                    alignSelf='center'
                    marginTop={[4, 0]}
                    maxWidth={['none', '50%']}
                >
                    {realTimeVIBMessages?.length > 0 &&
                        realTimeVIBMessages.map((item, i) => (
                            <Text
                                key={`vib_message_${i}`}
                                is='span'
                                lineHeight='tight'
                                marginBottom={4}
                                dangerouslySetInnerHTML={{ __html: `${i >= 1 ? ' ' : ''}${item}` }}
                            />
                        ))}
                </Box>
            </Grid>
        );
    };

    SignedOut = () => {
        return (
            <Flex css={styles.flexContainer}>
                <Box flexGrow={1}>
                    <Text
                        is='p'
                        children={getText('rewardText')}
                        marginBottom={2}
                        fontWeight='bold'
                    />
                    <Button
                        variant='primary'
                        width='100%'
                        onClick={() => store.dispatch(Actions.showRegisterModal({ isOpen: true }))}
                    >
                        {getText('joinNowBtn')}
                    </Button>
                </Box>
                <div css={styles.verticalDivider} />
                <Divider css={styles.horizontalDivider} />
                <Box flexGrow={1}>
                    <Text
                        is='p'
                        children={getText('beautyText')}
                        marginBottom={2}
                        fontWeight='bold'
                    />
                    <Button
                        variant='primary'
                        width='100%'
                        onClick={() =>
                            store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }))
                        }
                    >
                        {getText('signInBtn')}
                    </Button>
                </Box>
            </Flex>
        );
    };

    Title = origin => {
        const title = getText(`${origin}Title`);
        const description = getText(`${origin}Description`);

        return (
            <Box css={styles.titleBox}>
                <Flex justifyContent='space-between'>
                    <Text
                        is='h1'
                        children={title}
                    />
                    {this.props.isAtLeastRecognized && (
                        <Media lessThan='md'>
                            <Box
                                data-at={Sephora.debug.dataAt('show_card_link')}
                                aria-label={getText('showCard')}
                                onClick={() => this.setState({ showBarcode: true })}
                            >
                                <Image
                                    src='/img/ufe/icons/barcode-updated.svg'
                                    size={28}
                                />
                            </Box>
                        </Media>
                    )}
                </Flex>

                <Text
                    is='p'
                    fontSize={['md-bg', 'lg-bg']}
                    children={description}
                />
            </Box>
        );
    };
}

const styles = {
    container: {
        border: borders[1],
        borderColor: colors.midGray,
        borderRadius: radii[2],
        paddingTop: space[7],
        backgroundSize: `auto ${space[7]}px`,
        [mediaQueries.sm]: {
            paddingTop: space[0],
            backgroundSize: 'auto'
        }
    },
    titleBox: {
        h1: {
            fontSize: fontSizes.xl,
            fontWeight: fontWeights.bold,
            [mediaQueries.sm]: {
                fontSize: fontSizes['2xl']
            }
        }
    },
    verticalDivider: {
        borderLeft: `${borders[1]} ${colors.midGray}`,
        marginLeft: space[5],
        marginRight: space[5],
        height: '100%',
        alignSelf: 'center',
        display: 'none',
        [mediaQueries.sm]: {
            display: 'block'
        }
    },
    horizontalDivider: {
        marginTop: space[4],
        marginBottom: space[4],
        [mediaQueries.sm]: {
            display: 'none'
        }
    },
    flexContainer: {
        display: 'grid',
        [mediaQueries.sm]: {
            display: 'flex'
        }
    },
    smuiGrid: {
        display: 'grid',
        [mediaQueries.sm]: {
            display: 'flex',
            justifyContent: 'center'
        }
    },
    bigNumber: {
        wordWrap: 'normal',
        whiteSpace: 'nowrap'
    }
};

MainProfileBanner.propTypes = {
    origin: PropTypes.oneOf([ORIGINS.BEAUTY, ORIGINS.REWARDS])
};

MainProfileBanner.defaultProps = {
    origin: ORIGINS.BEAUTY
};

export default wrapComponent(MainProfileBanner, 'MainProfileBanner', true);
