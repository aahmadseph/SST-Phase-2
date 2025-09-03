import React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Text, Link, Divider
} from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    fontSizes, fontWeights, colors, space
} from 'style/config';
import bccUtils from 'utils/BCC';
import { renderModal, globalModals } from 'utils/globalModals';

const { SDU_SERVICE_FAQS } = globalModals;
const { SAME_DAY_UNLIMITED_FAQ } = bccUtils.MEDIA_IDS;
// const mediaId = '100700020';

const FeesAndFAQ = ({
    taxes,
    fees,
    needHelp,
    viewFaq,
    alignLeft,
    openInModal,
    showMediaModal,
    redirectToFAQ,
    hideAsteriscSection,
    fireAnalytics,
    FAQClick,
    globalModals: globalModalsData
}) => {
    const clickHandler = () => {
        fireAnalytics(openInModal);
        FAQClick();

        if (openInModal) {
            renderModal(globalModalsData[SDU_SERVICE_FAQS], () => {
                showMediaModal({
                    isOpen: true,
                    mediaId: SAME_DAY_UNLIMITED_FAQ,
                    titleDataAt: 'auto-replenishment'
                });
            });
        } else {
            redirectToFAQ();
        }
    };

    return (
        <Box css={styles.container}>
            {hideAsteriscSection || (
                <Box css={styles.smallText}>
                    <Text is='p'>
                        <sup>*</sup>
                        {taxes}
                    </Text>
                    <Text
                        is='p'
                        css={styles.fees}
                    >
                        <sup>**</sup>
                        {fees}
                    </Text>
                </Box>
            )}
            <Divider css={styles.divider} />
            <Box>
                <Text
                    is='p'
                    css={`
                        ${alignLeft ? { ...styles.needHelp, ...styles.left } : styles.needHelp}
                    `}
                >
                    {`${needHelp} `}
                    <Link
                        css={styles.link}
                        onClick={clickHandler}
                    >
                        {viewFaq}
                    </Link>
                </Text>
            </Box>
        </Box>
    );
};

const styles = {
    container: {
        marginBottom: `-${space[1]}px`
    },
    smallText: {
        fontSize: fontSizes.sm,
        color: colors.gray
    },
    fees: {
        marginTop: space[3]
    },
    divider: {
        marginTop: space[4],
        marginBottom: space[4]
    },
    needHelp: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal,
        textAlign: 'center'
    },
    left: {
        textAlign: 'left'
    },
    link: {
        color: colors.blue
    }
};

FeesAndFAQ.defaultProps = {};

FeesAndFAQ.propTypes = {
    taxes: PropTypes.string.isRequired,
    fees: PropTypes.string.isRequired,
    needHelp: PropTypes.string.isRequired,
    viewFaq: PropTypes.string.isRequired,
    alignLeft: PropTypes.bool
};

export default wrapFunctionalComponent(FeesAndFAQ, 'FeesAndFAQ');
