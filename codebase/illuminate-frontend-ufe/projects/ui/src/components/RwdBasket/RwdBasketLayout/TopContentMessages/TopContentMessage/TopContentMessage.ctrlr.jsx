import React from 'react';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import BaseClass from 'components/BaseClass';

import {
    Grid, Icon, Text, Box
} from 'components/ui';
import InfoButton from 'components/InfoButton';
import TopContentLayout from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentLayout';

import Actions from 'actions/Actions';
const { showFreeReturnsModal } = Actions;

import processEvent from 'analytics/processEvent';
import analyticsConstants from 'analytics/constants';
import { TOP_BANNER_MESSAGES } from 'constants/RwdBasket';

const fireFreeReturnsTracking = () => {
    const world = 'n/a';
    const pageName = `${analyticsConstants.PAGE_TYPES.RETURNS}:${analyticsConstants.PAGE_NAMES.FREE_RETURNS}:${world}:*`;
    const linkData = `${analyticsConstants.LinkData.FREE_RETURNS}:${digitalData.page.category.pageType}`;

    processEvent.process(analyticsConstants.ASYNC_PAGE_LOAD, {
        data: {
            pageName,
            pageType: analyticsConstants.PAGE_TYPES.RETURNS,
            pageDetail: analyticsConstants.PAGE_NAMES.FREE_RETURNS,
            world,
            linkData
        }
    });
};

class TopContentMessage extends BaseClass {
    state = {
        isDoubleLine: false
    };

    renderFreeReturnsInfoButton = localization => (
        <InfoButton
            isOutline
            padding={0}
            margin={0}
            marginLeft={2}
            aria-label={localization.infoIcon}
            onClick={() => {
                store.dispatch(showFreeReturnsModal({ isOpen: true }));
                fireFreeReturnsTracking();
            }}
        />
    );
    render() {
        const {
            messageKey, icon, message, backgroundColor, showBasketGreyBackground, localization
        } = this.props;

        return (
            <TopContentLayout
                updateIsDoubleLine={() => this.setState({ isDoubleLine: true })}
                backgroundColor={backgroundColor}
                showBasketGreyBackground={showBasketGreyBackground}
            >
                <Grid
                    key={messageKey}
                    columns='auto 1fr'
                    gap={3}
                    lineHeight='tight'
                >
                    <Box alignContent={this.state.isDoubleLine ? 'unset' : 'center'}>
                        <Icon
                            name={icon}
                            size={20}
                        />
                    </Box>
                    <Box alignContent={['center', null]}>
                        <Text>
                            <Text dangerouslySetInnerHTML={{ __html: message }} />
                            {messageKey === TOP_BANNER_MESSAGES.FREE_RETURNS && this.renderFreeReturnsInfoButton(localization)}
                        </Text>
                    </Box>
                </Grid>
            </TopContentLayout>
        );
    }
}

export default wrapComponent(TopContentMessage, 'TopContentMessage');
