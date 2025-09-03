import React from 'react';
import PropTypes from 'prop-types';
import MediaUtils from 'utils/Media';
import FrameworkUtils from 'utils/framework';
import AnayliticsConstants from 'analytics/constants';
import {
    Box, Divider, Grid, Image, Flex, Button, Text
} from 'components/ui';
import {
    colors, fontSizes, fontWeights, mediaQueries, space
} from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;
const { ORDER_CONFIRMATION_PAGENAME } = AnayliticsConstants.SMS;

const { Media } = MediaUtils;

const SmsOptInBanner = ({
    shouldDisplayBanner, displayDivider, imgSrc, handleRedirect, localization, isBOPIS = false
}) => {
    const { bannerTitle, bannerParagraph, bannerButton } = localization;

    return shouldDisplayBanner ? (
        <div>
            <Box
                is='div'
                marginY={6}
            >
                {displayDivider && (
                    <Divider
                        height={1}
                        marginY={[4, null, 5]}
                    />
                )}
                <Grid
                    css={isBOPIS ? styles.gridContainerBOPIS : styles.gridContainer}
                    p={4}
                >
                    <Image
                        src={imgSrc}
                        marginX={isBOPIS ? 2 : [2, 8]}
                        width={46}
                        height={55}
                    />
                    <Flex css={styles.textAndButtonWrapper}>
                        <Box css={styles.contentWrapper}>
                            <Text
                                css={styles.header}
                                is='h3'
                                children={bannerTitle}
                            />
                            <Flex css={styles.paragraphWrapper}>
                                <Text
                                    css={styles.paragraph}
                                    is='p'
                                >
                                    {bannerParagraph}
                                </Text>
                            </Flex>
                        </Box>
                        <Box>
                            <Media lessThan='md'>
                                <Box
                                    width={156}
                                    height={28}
                                >
                                    <Button
                                        size='sm'
                                        variant='secondary'
                                        children={bannerButton}
                                        onClick={() => handleRedirect(ORDER_CONFIRMATION_PAGENAME)}
                                    />
                                </Box>
                            </Media>
                            <Media greaterThan='sm'>
                                <Button
                                    variant='secondary'
                                    block={true}
                                    children={bannerButton}
                                    onClick={() => handleRedirect(ORDER_CONFIRMATION_PAGENAME)}
                                />
                            </Media>
                        </Box>
                    </Flex>
                </Grid>
            </Box>
        </div>
    ) : (
        <></>
    );
};

const styles = {
    bannerImage: {
        marginTop: space[2],
        marginBottom: space[2]
    },
    textAndButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginRight: `${space[3]}px`
    },
    contentWrapper: {
        flexBasis: '285px',
        flexGrow: 1,
        flexShrink: 0
    },
    header: {
        fontWeight: fontWeights.bold,
        fontSize: `${fontSizes.md}`
    },
    paragraphWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: `${space[4]}px`,
        [mediaQueries.sm]: {
            marginBottom: '0px'
        }
    },
    paragraph: {
        marginRight: `${space[1]}px`,
        fontSize: `${fontSizes.base}`
    },
    smFontSize: {
        fontSizes: `${fontSizes.sm}`
    },
    gridContainer: {
        gridTemplateColumns: '1fr 7fr',
        backgroundColor: colors.nearWhite
    },
    gridContainerBOPIS: {
        gridTemplateColumns: '1fr 7fr',
        backgroundColor: colors.nearWhite,
        [mediaQueries.sm]: {
            gridTemplateColumns: '1fr 10fr'
        }
    }
};

SmsOptInBanner.defaultProps = {
    isBOPIS: false,
    displayDivider: false
};

SmsOptInBanner.propTypes = {
    shouldDisplayBanner: PropTypes.bool.isRequired,
    imgSrc: PropTypes.string.isRequired,
    handleRedirect: PropTypes.func.isRequired,
    localization: PropTypes.shape({}).isRequired,
    isBOPIS: PropTypes.bool,
    displayDivider: PropTypes.bool
};

export default wrapFunctionalComponent(SmsOptInBanner, 'SmsOptInBanner');
