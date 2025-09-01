import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Flex, Image } from 'components/ui';
import uiUtils from 'utils/UI';
import {
    radii, space, fontSizes, lineHeights, mediaQueries
} from 'style/config';
import Location from 'utils/Location';
import contentConsts from 'constants/content';
import LoveActions from 'actions/LoveActions';
import store from 'store/Store';

const {
    RECAP_CAROUSEL: { ITEM_URLS }
} = contentConsts;

const { SKELETON_ANIMATION, SKELETON_COPY } = uiUtils;

function EmptyRecapItem({
    targetUrl,
    isLoading,
    displayTitle,
    title,
    subtitle,
    recapList,
    sid,
    isCreateList,
    actionForCreateList,
    triggerClick,
    showApplyPointsInReadyToCheckoutSection
}) {
    if (showApplyPointsInReadyToCheckoutSection && targetUrl.includes(ITEM_URLS.BASKET)) {
        styles.cardTitle.marginBottom = 0;
    }

    return (
        <Flex
            role='button'
            onClick={async e => {
                e.preventDefault();

                if (!isCreateList) {
                    const action = LoveActions.createNewList(title, null, true);
                    const response = await store.dispatch(action);
                    triggerClick && (await triggerClick(sid));
                    Location.navigateTo(e, `/profile/Lists/${response.shoppingListId}`);
                } else {
                    actionForCreateList();
                }
            }}
            flexDirection='column'
            lineHeight='tight'
            textAlign='left'
            backgroundColor='white'
            borderRadius={2}
            boxShadow={isCreateList ? 'none' : 'light'}
            padding={isCreateList ? [0, 0] : [3, 4]}
            fontSize={['sm', 'base']}
            css={styles.root}
        >
            {!isCreateList ? (
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
            ) : (
                <Image
                    disableLazyLoad={true}
                    alt='Create List'
                    src={'/img/ufe/newListCard.svg'}
                />
            )}
        </Flex>
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

EmptyRecapItem.propTypes = {
    isLoading: PropTypes.bool
};

EmptyRecapItem.defaultProps = {
    isLoading: true
};

export default wrapFunctionalComponent(EmptyRecapItem, 'EmptyRecapItem');
