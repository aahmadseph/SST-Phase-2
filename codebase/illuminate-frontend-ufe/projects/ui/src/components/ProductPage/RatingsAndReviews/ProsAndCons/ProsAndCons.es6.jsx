import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Flex, Text } from 'components/ui';
import Chiclet from 'components/Chiclet';
import PropTypes from 'prop-types';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const NUMBER_OF_PROS_AND_CONS = 3;

class ProsAndCons extends BaseClass {
    LIMIT_OF_REVIEWS = 6;
    PAGE = 0;

    constructor(props) {
        super(props);
        const { sentiments, selectedSentiment } = props.product;
        this.state = {
            pros: this.getSentimentsOfType(sentiments, 'pros'),
            cons: this.getSentimentsOfType(sentiments, 'cons'),
            selectedId: selectedSentiment || null
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product.selectedSentiment !== this.props.product.selectedSentiment) {
            this.setState({ selectedId: this.props.product.selectedSentiment });
        }
    }

    getSentimentsOfType = (sentiments, type) => {
        return sentiments.filter(sentiment => sentiment.type === type);
    };

    handleChicletClick = (sentiment, type) => {
        if (this.state.selectedId !== sentiment) {
            this.setState({ selectedId: sentiment });

            this.props.loadHighlightedReviews({
                sentiment: sentiment,
                type: type,
                productId: this.props.product?.productDetails?.productId,
                limit: this.LIMIT_OF_REVIEWS,
                page: this.PAGE,
                language: this.props.language
            });

            this.fireAnalytics(type, sentiment);
        } else {
            this.setState({ selectedId: null });
            this.props.deselectSentiment();
        }
    };

    fireAnalytics = (proConType = '', sentiment = '') => {
        const actionLink = `reviews:ratings&reviews-filter:${proConType}`;
        const selectedFilter = proConType.replace(/([A-Z])/g, ' $1') + '=' + sentiment;
        const pageDetail = digitalData.page.attributes?.sephoraPageInfo?.pageName?.split(':')?.[1];

        const eventData = {
            data: {
                filterSelections: selectedFilter,
                selectedFilter: selectedFilter,
                actionInfo: actionLink,
                linkName: actionLink,
                eventStrings: anaConsts.Event.EVENT_71,
                pageDetail
            }
        };

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);
    };

    renderChiclet = (item, type) => {
        return (
            <Chiclet
                key={item.sentiment}
                variant='shadow'
                isActive={item.sentiment === this.state.selectedId}
                onClick={() => this.handleChicletClick(item.sentiment, type)}
                children={`${item.sentiment} (${item.count})`}
            />
        );
    };

    createList = ({ sentiments, type }) => {
        const chicletsArray = [];

        sentiments.forEach((item, index) => {
            if (index < NUMBER_OF_PROS_AND_CONS) {
                chicletsArray.push(this.renderChiclet(item, type));
            }
        });

        return chicletsArray;
    };

    render() {
        const { localization } = this.props;

        return (
            <Flex
                flexDirection='column'
                lineHeight='tight'
            >
                {this.state.pros.length > 0 && (
                    <>
                        <Text
                            is='h3'
                            fontWeight='bold'
                            marginBottom={4}
                            children={localization.pros}
                        />
                        <Flex
                            flexWrap='wrap'
                            gap={2}
                        >
                            {this.createList({
                                sentiments: this.state.pros,
                                type: 'pros'
                            })}
                        </Flex>
                    </>
                )}
                {this.state.cons.length > 0 && (
                    <>
                        <Text
                            is='h3'
                            fontWeight='bold'
                            paddingTop={[4, 5]}
                            marginTop='auto'
                            marginBottom={4}
                            children={localization.cons}
                        />
                        <Flex
                            flexWrap='wrap'
                            gap={2}
                        >
                            {this.createList({
                                sentiments: this.state.cons,
                                type: 'cons'
                            })}
                        </Flex>
                    </>
                )}
            </Flex>
        );
    }
}

ProsAndCons.propTypes = {
    product: PropTypes.object.isRequired,
    localization: PropTypes.object.isRequired
};

export default wrapComponent(ProsAndCons, 'ProsAndCons');
