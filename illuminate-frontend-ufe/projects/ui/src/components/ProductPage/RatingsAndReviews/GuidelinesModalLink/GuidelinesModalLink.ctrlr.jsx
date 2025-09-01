import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Link, Button } from 'components/ui';
import Modal from 'components/Modal/Modal';
import typography from 'style/typography';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import ComponentList from 'components/Content/ComponentList';
import cmsApi from 'services/api/cms';
import getModal from 'services/api/cms/getModal';
import { globalModals } from 'utils/globalModals';
import ContentConstants from 'constants/content';

const { CONTEXTS } = ContentConstants;
const { COMMUNITY_RATINGS_REVIEWS } = globalModals;
const MEDIA_ID = 100400018;

class GuidelinesModalLink extends BaseClass {
    state = {
        contentData: null,
        showGuidelines: false
    };

    closeModal = () => {
        this.setState(oldState => ({ ...oldState, showGuidelines: false }));
    };

    openModal = () => {
        const { sid } = this.props.globalModals[COMMUNITY_RATINGS_REVIEWS] || {};

        if (this.state.contentData) {
            this.setState(oldState => ({ ...oldState, showGuidelines: true }));
        } else {
            if (sid) {
                const { country, channel, language } = Sephora.renderQueryParams;
                getModal({ country, language, channel, sid }).then(data => {
                    this.setState({
                        showGuidelines: true,
                        contentData: data?.data,
                        isContentfulModal: true
                    });
                });
            } else {
                cmsApi.getMediaContent(MEDIA_ID).then(data => {
                    this.setState({
                        showGuidelines: true,
                        contentData: data && data.regions && data.regions.content ? data.regions.content : null
                    });
                });
            }
        }
    };

    render() {
        const { showGuidelines, contentData, isContentfulModal } = this.state;

        return (
            <>
                <Link
                    onClick={this.openModal}
                    color='blue'
                    padding={2}
                    margin={-2}
                    underline={true}
                >
                    {this.props.ratingsAndReviewsGuidelines}
                </Link>
                {showGuidelines && contentData && (
                    <Modal
                        isOpen={true}
                        onDismiss={this.closeModal}
                        width={isContentfulModal ? contentData?.width : 2}
                    >
                        {isContentfulModal && (
                            <Modal.Header>
                                <Modal.Title>{contentData?.title}</Modal.Title>
                            </Modal.Header>
                        )}
                        <Modal.Body css={typography}>
                            {isContentfulModal ? (
                                <ComponentList
                                    items={contentData?.items}
                                    context={CONTEXTS.MODAL}
                                    removeFirstItemMargin={true}
                                    removeLastItemMargin={true}
                                />
                            ) : (
                                <BccComponentList items={contentData} />
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant='primary'
                                hasMinWidth={true}
                                children={this.props.done}
                                onClick={this.closeModal}
                            />
                        </Modal.Footer>
                    </Modal>
                )}
            </>
        );
    }
}

GuidelinesModalLink.propTypes = {
    done: PropTypes.string,
    ratingsAndReviewsGuidelines: PropTypes.string
};

export default wrapComponent(GuidelinesModalLink, 'GuidelinesModalLink', true);
