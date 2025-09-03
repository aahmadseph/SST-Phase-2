/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import ComponentList from 'components/Content/ComponentList';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import ContentConstants from 'constants/content';
import PropTypes from 'prop-types';
import getModal from 'services/api/cms/getModal';
import { wrapComponent } from 'utils/framework';

const { CONTEXTS } = ContentConstants;

class ChildContentModal extends BaseClass {
    state = {
        items: null
    };

    componentDidMount() {
        const { country, channel, language } = Sephora.renderQueryParams;

        getModal({
            country,
            channel,
            language,
            sid: this.props.childData.sid
        }).then(comp => {
            this.setState({ items: comp?.data?.items });
        });
    }

    render() {
        const { isOpen, onDismiss, childData } = this.props;
        const { title, width } = childData;
        const { items } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
                width={width}
            >
                {title && (
                    <Modal.Header>
                        <Modal.Title children={title} />
                    </Modal.Header>
                )}
                <Modal.Body padForX={!title}>
                    {items ? (
                        <ComponentList
                            items={items}
                            context={CONTEXTS.MODAL}
                            removeFirstItemMargin={true}
                            removeLastItemMargin={true}
                        />
                    ) : (
                        <Loader
                            isShown={true}
                            isInline={true}
                        />
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

ChildContentModal.propTypes = {
    childData: PropTypes.shape({
        sid: PropTypes.string,
        title: PropTypes.string,
        width: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6])
    })
};

ChildContentModal.defaultProps = {
    childData: {
        sid: null,
        title: null,
        width: 2
    }
};

export default wrapComponent(ChildContentModal, 'ChildContentModal', true);
