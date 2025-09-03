import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Text, Flex } from 'components/ui';
import Action from 'components/Content/Action';
import uiUtils from 'utils/UI';
import {
    radii, space, fontSizes, lineHeights, mediaQueries
} from 'style/config';
import Location from 'utils/Location';
import contentConsts from 'constants/content';
import store from 'store/Store';
import LoveActions from 'actions/LoveActions';

const {
    RECAP_CAROUSEL: { ITEM_URLS }
} = contentConsts;

const { SKELETON_ANIMATION, SKELETON_COPY } = uiUtils;

const ActionFlex = Action(Flex);

function RecapItem({
    targetUrl,
    icid2,
    isLoading,
    displayTitle,
    title,
    subtitle,
    recapList,
    sid,
    children,
    triggerClick,
    action,
    useActionWrapper,
    dontUseInternalTracking,
    showApplyPointsInReadyToCheckoutSection
}) {
    if (showApplyPointsInReadyToCheckoutSection && targetUrl.includes(ITEM_URLS.BASKET)) {
        styles.cardTitle.marginBottom = 0;
    }

    const Wrapper = useActionWrapper ? ActionFlex : Flex;
    const actionProps = {
        action,
        dontUseInternalTracking,
        icid2
    };

    return (
        <Wrapper
            role='button'
            onClick={async e => {
                e.preventDefault();
                store.dispatch(LoveActions.setLoveListName(displayTitle || title));
                triggerClick && (await triggerClick(sid));
                Location.navigateTo(e, targetUrl);
            }}
            flexDirection='column'
            lineHeight='tight'
            textAlign='left'
            backgroundColor='white'
            borderRadius={2}
            boxShadow={'light'}
            padding={[3, 4]}
            fontSize={['sm', 'base']}
            css={styles.root}
            {...(useActionWrapper && actionProps)}
        >
            {(displayTitle || title) && (
                <div css={[styles.cardTitle, isLoading && SKELETON_COPY, recapList && styles.recapList]}>
                    <Text
                        is='h3'
                        fontWeight={recapList ? 'normal' : 'bold'}
                        fontSize={['sm', 'base']}
                        numberOfLines={2}
                    >
                        <span>{displayTitle || title}</span>
                    </Text>
                    {subtitle && (
                        <Text
                            is='p'
                            fontSize={'sm'}
                            color='darkGray'
                            marginTop={1}
                        >
                            {subtitle}
                        </Text>
                    )}
                </div>
            )}
            {isLoading ? (
                <Grid
                    columns={2}
                    gap={[1, 2]}
                >
                    <div css={styles.skeleton.item} />
                    <div css={styles.skeleton.item} />
                    <div css={styles.skeleton.item} />
                    <div css={styles.skeleton.item} />
                </Grid>
            ) : (
                children
            )}
        </Wrapper>
    );
}

const styles = {
    root: {
        '.no-touch &': {
            transition: 'transform .2s',
            '&:hover': {
                transform: `translateY(-${space[1]}px)`
            }
        }
    },
    skeleton: {
        item: [
            SKELETON_ANIMATION,
            {
                paddingBottom: '100%',
                borderRadius: radii[2]
            }
        ]
    },
    cardTitle: {
        marginBottom: space[2],
        height: fontSizes.sm * lineHeights.tight * 2,
        [mediaQueries.sm]: {
            height: fontSizes.base * lineHeights.tight * 2
        }
    },
    recapList: {
        height: 'auto',
        [mediaQueries.sm]: {
            height: 'auto'
        }
    }
};

RecapItem.propTypes = {
    isLoading: PropTypes.bool,
    useActionWrapper: PropTypes.bool,
    dontUseInternalTracking: PropTypes.bool
};

RecapItem.defaultProps = {
    isLoading: true,
    useActionWrapper: false,
    dontUseInternalTracking: false
};

export default wrapFunctionalComponent(RecapItem, 'RecapItem');
