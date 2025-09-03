import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Link, Divider, Text } from 'components/ui';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class SentimentModal extends BaseClass {
    LIMIT_OF_REVIEWS = 6;
    PAGE = 0;

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
    }

    fireAnalytics = (proConType = '', sentiment = '') => {
        const actionLink = 'reviews:ratings&reviews-filter:highly rated';
        const selectedFilter = proConType.replace(/([A-Z])/g, ' $1') + '=' + sentiment;
        const pageDetail = 'ratings&reviews-highly rated modal';
        const pageType = 'reviews';
        const pageWorld = 'n/a';
        const pageName = `${pageType}:${pageDetail}:${pageWorld}:*`;

        const eventData = {
            data: {
                filterSelections: selectedFilter,
                selectedFilter: selectedFilter,
                actionInfo: actionLink,
                linkName: actionLink,
                eventStrings: anaConsts.Event.EVENT_71,
                pageDetail,
                pageType,
                world: pageWorld,
                pageName,
                previousPage: pageName
            }
        };

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);
    };

    render() {
        const {
            proSentiments, localization, highlightRange, loadHighlightedReviews, onSentimentApply
        } = this.props;

        return (
            <Modal
                width={0}
                isOpen={this.props.isModalOpen}
                onDismiss={this.props.closeModal}
            >
                <Modal.Header>
                    <Modal.Title>{localization.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight='tight'>
                    {proSentiments.map((pro, index) => (
                        <React.Fragment key={`${index}_${pro}`}>
                            {index !== 0 ? <Divider marginY={4} /> : null}
                            <Text
                                is='h3'
                                fontWeight='bold'
                                children={pro.sentiment}
                            />
                            <Text
                                is='p'
                                marginTop={1}
                                marginBottom={2}
                                dangerouslySetInnerHTML={{
                                    __html: highlightRange({
                                        quote: pro.representativeQuote.quote,
                                        ranges: pro.representativeQuote.highLights
                                    })
                                }}
                            />
                            <Link
                                color='blue'
                                padding={2}
                                margin={-2}
                                children={`${localization.seeMore} ${pro.sentiment} (${pro.count})`}
                                onClick={() => {
                                    onSentimentApply();
                                    loadHighlightedReviews({
                                        sentiment: pro.sentiment,
                                        type: pro.type,
                                        productId: this.props.productId,
                                        limit: this.LIMIT_OF_REVIEWS,
                                        page: this.PAGE,
                                        language: this.props.language
                                    });
                                    this.fireAnalytics(pro.type, pro.sentiment);
                                    this.props.closeModal();
                                }}
                            />
                        </React.Fragment>
                    ))}
                </Modal.Body>
            </Modal>
        );
    }
}

SentimentModal.propTypes = {
    proSentiments: PropTypes.array,
    isModalOpen: PropTypes.bool,
    closeModal: PropTypes.func
};

SentimentModal.defaultProps = {
    isModalOpen: false
};

export default wrapComponent(SentimentModal, 'SentimentModal');
