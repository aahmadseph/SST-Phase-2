import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import Actions from 'Actions';
import Media from 'components/Content/Media';
import Modal from 'components/Modal/Modal';
import RichText from 'components/Content/RichText';
import { Button, Box, Text } from 'components/ui';
import JSConfetti from 'thirdparty/confetti';
import { fontSizes } from 'style/config';
import Action from 'components/Content/Action';
import { mediaQueries } from 'style/config';

const ActionButton = Action(Button);

class GameInfoModal extends BaseClass {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        const { showConfetti } = this.props;

        if (showConfetti) {
            this.jsConfetti = new JSConfetti({ canvas: this.canvas.current });
            const config = {
                confettiColors: ['#FAC9BB', '#A9DBD8', '#F8D557', '#EC756A']
            };
            this.jsConfetti.addConfetti(config);
        }
    }

    handleOnDismiss = () => {
        const { dismissCallback } = this.props;
        dismissCallback && dismissCallback();
        store.dispatch(Actions.showGameInfoModal({ isOpen: false }));
    };

    handleCTACallback = () => {
        const { ctaCallback } = this.props;
        ctaCallback && ctaCallback();
        this.handleOnDismiss();
    };

    render() {
        const {
            isOpen, copy, modalStatus, ctaLabel, image, title, ctaDisabled, description, imagePadding, footerBorder, ctaAction
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handleOnDismiss}
                width={0}
                isDrawer={true}
                hasBodyScroll={true}
            >
                <canvas
                    ref={this.canvas}
                    css={{
                        [mediaQueries.xsMax]: {
                            height: 'calc(100dvh / 2)',
                            width: '100vw'
                        },
                        height: '100%',
                        width: '100%',
                        inset: 0,
                        position: 'absolute',
                        zIndex: 1100,
                        pointerEvents: 'none'
                    }}
                />
                <Modal.Header border={0}>
                    {/* For Spacing Purpose */}
                    <Modal.Title>{''}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                    maxHeight='85vh'
                >
                    {image && (
                        <Box paddingX={imagePadding ? 4 : 0}>
                            <Media
                                {...image}
                                size={['100%', '100%']}
                                paddingX={2}
                            />
                        </Box>
                    )}

                    <Box
                        paddingX={[4, 5]}
                        paddingY={4}
                    >
                        {title && (
                            <Text
                                is='h1'
                                children={title}
                                fontWeight='bold'
                                fontSize='lg'
                                lineHeight='tight'
                            />
                        )}
                        {description && (
                            <Text
                                is='p'
                                paddingTop={3}
                                children={description}
                                fontSize='md'
                                lineHeight='tight'
                            />
                        )}
                        {modalStatus && (
                            <Text
                                is='p'
                                paddingTop={3}
                                children={modalStatus}
                                fontWeight='bold'
                                lineHeight='tight'
                            />
                        )}
                        {copy && (
                            <Box paddingTop={3}>
                                <RichText
                                    content={copy}
                                    style={{ fontSize: fontSizes.base }}
                                />
                            </Box>
                        )}
                    </Box>
                </Modal.Body>
                <Modal.Footer
                    hasBorder={footerBorder}
                    paddingX={[4, 5]}
                >
                    <ActionButton
                        variant='primary'
                        children={ctaLabel}
                        disabled={ctaDisabled}
                        width='100%'
                        action={ctaAction}
                        onClick={this.handleCTACallback}
                        useRedirect={true}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

GameInfoModal.propTypes = {
    isOpen: PropTypes.bool,
    copy: PropTypes.object,
    ctaLabel: PropTypes.string,
    image: PropTypes.object,
    title: PropTypes.string,
    ctaDisabled: PropTypes.bool,
    ctaAction: PropTypes.object,
    showConfetti: PropTypes.bool,
    description: PropTypes.string,
    imagePadding: PropTypes.bool,
    footerBorder: PropTypes.bool,
    ctaCallback: PropTypes.func,
    dismissCallback: PropTypes.func
};

export default wrapComponent(GameInfoModal, 'GameInfoModal', true);
