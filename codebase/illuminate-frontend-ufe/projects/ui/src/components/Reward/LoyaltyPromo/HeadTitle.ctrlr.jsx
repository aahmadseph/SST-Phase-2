/* eslint-disable object-curly-newline */
import React from 'react';
import { Box, Text, Divider } from 'components/ui';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import store from 'store/Store';
import Markdown from 'components/Markdown/Markdown';

class HeadTitle extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { netBeautyBankPointsAvailable: 0 };
    }

    componentDidMount() {
        const { isBopis } = this.props;
        const watchPoints = isBopis ? 'basket.pickupBasket.netBeautyBankPointsAvailable' : 'basket.netBeautyBankPointsAvailable';
        store.setAndWatch(watchPoints, this, data => {
            this.setState({
                netBeautyBankPointsAvailable: data.netBeautyBankPointsAvailable
            });
        });
    }

    render() {
        const { isBopis, isCheckout, getText } = this.props;

        if ((!isCheckout && !isBopis) || (!isCheckout && isBopis && Sephora.isMobile())) {
            return null;
        }

        let pointsInfo;
        const points = this.state.netBeautyBankPointsAvailable;

        if (points >= 0) {
            pointsInfo = (
                <Markdown
                    content={getText('youNowHaveText', [points])}
                    data-at={Sephora.debug.dataAt('you_now_have_points_label')}
                />
            );
        } else {
            pointsInfo = (
                <Markdown
                    color='error'
                    content={getText('youAreExceeding', [Math.abs(points)])}
                />
            );
        }

        return (
            <Box
                paddingX={4}
                paddingTop={4}
            >
                <Text
                    is='p'
                    fontWeight='bold'
                    children={getText('useBiPoints')}
                />
                {pointsInfo}
                <Divider
                    marginTop={4}
                    marginX={-4}
                />
            </Box>
        );
    }
}

HeadTitle.defaultProps = {
    isCheckout: false,
    getText: () => {}
};
HeadTitle.propTypes = {
    isCheckout: PropTypes.bool,
    getText: PropTypes.func.isRequired
};

export default wrapComponent(HeadTitle, 'HeadTitle', true);
