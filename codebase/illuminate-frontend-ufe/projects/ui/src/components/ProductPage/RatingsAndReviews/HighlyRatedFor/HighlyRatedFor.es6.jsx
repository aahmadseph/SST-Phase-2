import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Link } from 'components/ui';
import SentimentModal from 'components/ProductPage/RatingsAndReviews/HighlyRatedFor/SentimentModal/';
const MAX_PROS = 5;

// Analytics
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

import highlightedModalLoad from 'analytics/bindings/pages/all/highlightedModalLoad';

class HighlyRatedFor extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: null,
            isModalOpen: false
        };
    }

    filter = index => {
        this.setState({ selectedId: index });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    /* Returns only the MAX_PROS from amount of sentiments the list of sentiments, filtering out all the cons */
    filterProSentiments = sentiments => {
        const pros = sentiments.filter(sentiment => sentiment.type === 'pros');
        const prosList = pros.slice(0, MAX_PROS);

        return prosList;
    };

    fireAnalytics = () => {
        this.props.highlyRatedForClick();
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                bindingMethods: [highlightedModalLoad]
            }
        });
    };

    /* Creates a list of links for the pros */
    createList = items => {
        const length = items.length;

        return items.map((item, index) => {
            const isLast = index + 1 === length || index + 1 === MAX_PROS;

            return (
                <React.Fragment key={item.sentiment}>
                    <Link
                        color='blue'
                        underline={true}
                        padding={1}
                        margin={-1}
                        key={item.sentiment}
                        onClick={() => {
                            this.filter(index);
                            this.setState({ isModalOpen: true });
                            this.fireAnalytics();
                        }}
                        children={item.sentiment}
                    />
                    {isLast ? ' ' : ',  '}
                </React.Fragment>
            );
        });
    };

    render() {
        const { sentiments = [] } = this.props.product;
        const proSentiments = this.filterProSentiments(sentiments);
        const prosLinkList = this.createList(proSentiments);
        const { localization, onSentimentApply } = this.props;
        const productId = this.props.product?.productDetails?.productId;

        return (
            <>
                <SentimentModal
                    closeModal={this.closeModal}
                    proSentiments={proSentiments}
                    isModalOpen={this.state.isModalOpen}
                    productId={productId}
                    onSentimentApply={onSentimentApply}
                />
                <p>
                    {localization.linkLead} {prosLinkList}
                </p>
            </>
        );
    }
}

HighlyRatedFor.propTypes = {
    product: PropTypes.object.isRequired,
    localization: PropTypes.object.isRequired
};

export default wrapComponent(HighlyRatedFor, 'HighlyRatedFor');
