import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BccRwdComponentList from 'components/Bcc/BccRwdComponentList';
import processEvent from 'components/../analytics/processEvent';
import anaConsts from 'components/../analytics/constants';
import cmsApi from 'components/../services/api/cms';
import Loader from 'components/Loader';
import bccModalOpenEvent from 'analytics/bindings/pages/all/bccModalOpenEvent';

class BccModal extends BaseClass {
    state = {
        isOpen: false,
        rwdContent: null
    };

    trackOpenEvent = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                bindingMethods: [bccModalOpenEvent],
                bccComponentName: this.props.name
            }
        });
    };

    toggleOpen = () => {
        if (this.props.modalState === true) {
            this.props.toggleFromParent();
        } else {
            const isOpen = !this.state.isOpen;

            if (isOpen) {
                this.trackOpenEvent();
            }

            this.setState({ isOpen });
        }
    };

    componentDidMount() {
        if (this.props.modalState) {
            this.trackOpenEvent();
        }

        if (this.props.seoName) {
            cmsApi.getRwdMediaContent(this.props.seoName).then(data => {
                this.setState({ rwdContent: data });
            });
        }
    }

    render() {
        const {
            titleText, design, components, componentList, style, width
        } = this.props;

        // non rwd sizing
        const isLarge = design === 'Large';
        const isSmall = design === 'Small';

        const { rwdContent } = this.state;

        const title = rwdContent?.title || titleText;
        const rwdComps = rwdContent?.zone1 || componentList;
        const legacyComps = components;

        return (
            <Modal
                isOpen={this.props.modalState || this.state.isOpen}
                onDismiss={this.toggleOpen}
                width={isSmall ? 0 : isLarge ? 5 : width || style.width}
            >
                {title && (
                    <Modal.Header>
                        <Modal.Title dangerouslySetInnerHTML={{ __html: title }} />
                    </Modal.Header>
                )}
                <Modal.Body padForX={!title}>
                    {rwdComps || legacyComps ? (
                        <div css={styles.componentsWrap}>
                            {rwdComps ? (
                                <BccRwdComponentList
                                    context='modal'
                                    items={rwdComps}
                                />
                            ) : (
                                <BccComponentList
                                    items={legacyComps}
                                    isContained={Sephora.isMobile()}
                                />
                            )}
                        </div>
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

const styles = {
    componentsWrap: {
        '& > :first-child': {
            marginTop: 0
        },
        '& > :last-child': {
            marginBottom: 0
        }
    }
};

BccModal.defaultProps = {
    style: {
        width: 2
    }
};

export default wrapComponent(BccModal, 'BccModal', true);
