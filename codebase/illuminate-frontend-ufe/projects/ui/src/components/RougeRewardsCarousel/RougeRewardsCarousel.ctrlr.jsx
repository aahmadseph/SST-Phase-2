import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { UserInfoReady } from 'constants/events';
import Action from 'components/Content/Action';
import {
    Text, Box, Grid, Link
} from 'components/ui';
import basketUtils from 'utils/Basket';
import AddToBasketButton from 'components/AddToBasketButton';
import ProductListLayouts from 'components/Content/ProductListLayout';
import contentConstants from 'constants/content';
import uiUtils from 'utils/UI';

const { SKELETON_TEXT } = uiUtils;
const { PRODUCT_LIST_LAYOUT_VARIANTS, PRODUCT_LIST_CARD_SIZE_VARIANTS } = contentConstants;
const ActionLink = Action(Link);

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;

class RougeRewardsCarousel extends BaseClass {
    state = {
        user: null
    };

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            this.setState({
                user: this.props.user
            });
        });
    }

    componentDidUpdate(_prevProps, prevState) {
        const { user } = this.state;
        const { basket } = this.props;

        if (user && user !== prevState.user) {
            this.setState(
                {
                    user
                },
                this.props.loadRougeRewards(user.language.toLowerCase(), user.profileLocale, basket)
            );
        }
    }

    renderBiButton = sku => {
        return (
            <Box marginTop={2}>
                <Box
                    display='block'
                    marginTop={[2, 3]}
                >
                    <AddToBasketButton
                        sku={sku}
                        variant={ADD_BUTTON_TYPE.SECONDARY}
                        isAddButton={true}
                        size='sm'
                        isRewardItem={true}
                        originalContext={this.props.analyticsContext}
                        onlyUseTextProp={'add'}
                    />
                </Box>
            </Box>
        );
    };

    render() {
        const {
            rougeExclusiveRewards,
            title,
            showSkeleton,
            rougeBadgeText,
            viewAllText,
            marginTop = 0,
            marginBottom = 0,
            customStyles,
            isRougeExclusive,
            analyticsContext,
            showViewAll
        } = this.props;

        const hasRougeOnlyRewards = rougeExclusiveRewards.length > 0;

        if (!isRougeExclusive || !hasRougeOnlyRewards) {
            return null;
        }

        const ProductListLayout = ProductListLayouts[PRODUCT_LIST_LAYOUT_VARIANTS['Rouge Exclusive Rewards Carousel']];

        return (
            <Box
                marginTop={Array.isArray(customStyles?.marginTop) ? customStyles?.marginTop : marginTop}
                marginBottom={Array.isArray(customStyles?.marginBottom) ? customStyles?.marginBottom : marginBottom}
            >
                <Grid
                    alignItems='baseline'
                    columns='1fr auto'
                    lineHeight='tight'
                    gap={3}
                >
                    <Grid
                        marginBottom={5}
                        gap={0}
                    >
                        <Text
                            is='h2'
                            fontSize={['md', 'lg']}
                            fontWeight='bold'
                            css={showSkeleton && [{ minWidth: 204 }, SKELETON_TEXT]}
                            children={title}
                        />
                    </Grid>
                    {showViewAll && (
                        <ActionLink
                            action={{
                                targetUrl: '/rewards'
                            }}
                            padding={2}
                            margin={-2}
                            color='blue'
                            children={viewAllText}
                            analyticsNextPageData={{ linkData: `${title?.trim().toLowerCase()}:carousel:show more` }}
                        />
                    )}
                </Grid>
                <ProductListLayout
                    title={title}
                    skus={rougeExclusiveRewards}
                    showPrice={true}
                    renderBiButton={this.renderBiButton()}
                    showSkeleton={showSkeleton}
                    showMarketingFlags={true}
                    isBIRBReward={true}
                    rougeBadgeText={rougeBadgeText}
                    analyticsContext={analyticsContext}
                    size={PRODUCT_LIST_CARD_SIZE_VARIANTS['Rouge Exclusive Rewards Carousel']}
                    isCarousel={true}
                />
            </Box>
        );
    }
}

export default wrapComponent(RougeRewardsCarousel, 'RougeRewardsCarousel');
