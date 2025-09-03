import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { space } from 'style/config';
import { Box } from 'components/ui';
import RewardItem from 'components/Reward/RewardItem/RewardItem';
import bccUtils from 'utils/BCC';

const { IMAGE_SIZES } = bccUtils;
const GUTTER_PADDING = space[3];

class RewardsGrid extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const isDesktop = Sephora.isDesktop();

        const {
            isAnonymous, title, items, isBIRBReward = false, anchor
        } = this.props;

        function getRows(rewards) {
            const renderLimit = isDesktop ? 12 : 8;
            const rows = [];
            let rowItems = [];

            for (let x = 0, max = rewards.length; x < max; x++) {
                const reward = rewards[x];

                rowItems.push(
                    <div
                        css={isDesktop ? styles.itemFS : styles.itemMW}
                        key={`${reward.productId}_${reward.skuId}`}
                    >
                        <RewardItem
                            key={reward.skuId}
                            badges={true}
                            useAddToBasket={true}
                            showPrice={true}
                            rootContainerName={title}
                            isBIRBReward={isBIRBReward}
                            isAnonymous={isAnonymous}
                            showMarketingFlags={true}
                            imageSize={IMAGE_SIZES[162]}
                            productStringContainerName={title}
                            {...reward}
                        />
                    </div>
                );

                // Flush products into new row once there's enough of them
                if (rowItems.length % renderLimit === 0) {
                    rows.push(
                        <div
                            key={reward.productId}
                            css={styles.row}
                        >
                            {rowItems.slice()}
                        </div>
                    );
                    rowItems = [];
                }
            }

            // Flush any left over products
            if (rowItems.length) {
                rows.push(
                    <div
                        css={styles.row}
                        data-lload='comp'
                    >
                        {rowItems.slice()}
                    </div>
                );
            }

            return rows;
        }

        return (
            <React.Fragment>
                <Box
                    fontFamily='serif'
                    lineHeight='tight'
                    fontSize={isDesktop ? '2xl' : 'xl'}
                    marginBottom={isDesktop ? 5 : 4}
                    textAlign={isDesktop && 'center'}
                    children={title}
                    id={anchor}
                    data-at={Sephora.debug.dataAt('reward_grid_title')}
                />
                {items && getRows(items)}
            </React.Fragment>
        );
    }
}

const itemStyle = {
    display: 'flex',
    paddingLeft: GUTTER_PADDING,
    paddingRight: GUTTER_PADDING
};

const styles = {
    row: {
        display: 'flex',
        flexFlow: 'row wrap',
        marginLeft: -GUTTER_PADDING,
        marginRight: -GUTTER_PADDING
    },
    itemMW: [
        itemStyle,
        {
            width: '50%',
            marginTop: space[4],
            marginBottom: space[4]
        }
    ],
    itemFS: [
        itemStyle,
        {
            width: '25%',
            marginTop: space[5],
            marginBottom: space[5]
        }
    ]
};

export default wrapComponent(RewardsGrid, 'RewardsGrid');
