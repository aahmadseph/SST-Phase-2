import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import { CARD_GAP, CARD_WIDTH } from 'constants/productCard';
import { Text } from 'components/ui';
import Storage from 'utils/localStorage/Storage';

class Recap extends BaseClass {
    componentDidMount() {
        this.props.fetchPurchaseHistory(this.props);
        this.props.fetchBeautyRecommendations(this.props);
        this.props.requiredData.rvData && this.props.updateRvData(Storage.local.getItem('rvData'));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            this.props.fetchPurchaseHistory(this.props);
            this.props.fetchBeautyRecommendations(this.props);
        }
    }

    render() {
        const {
            title, subtitle, sid, isLoading, hideRow, cards
        } = this.props;

        if (hideRow) {
            return null;
        }

        return (
            <div id={sid}>
                {title && (
                    <Text
                        is='h2'
                        lineHeight='tight'
                        marginBottom={subtitle ? '.25em' : 4}
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        children={title}
                    />
                )}
                {subtitle && (
                    <Text
                        is='p'
                        lineHeight='tight'
                        marginBottom={4}
                        marginRight='auto'
                        children={subtitle}
                    />
                )}
                <Carousel
                    isLoading={isLoading}
                    gap={CARD_GAP}
                    paddingY={4}
                    marginX='-container'
                    scrollPadding={[2, 'container']}
                    itemWidth={CARD_WIDTH}
                    items={cards}
                    hasShadowHack={true}
                    onImpression={this.props.triggerRecapImpression}
                />
            </div>
        );
    }
}

Recap.propTypes = {
    sid: PropTypes.string,
    cards: PropTypes.array,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    hideRow: PropTypes.bool,
    isLoading: PropTypes.bool
};

Recap.defaultProps = {
    sid: null,
    cards: null,
    title: null,
    subtitle: null,
    hideRow: false,
    isLoading: true
};

export default wrapComponent(Recap, 'Recap', true);
