/* eslint-disable object-curly-newline */
import React, { Component } from 'react';

function withInnerModal(WrappedComponent, Modal) {
    class InnerModalHOC extends Component {
        constructor(props) {
            super(props);
            this.state = {
                modalProps: null
            };
            this.openModal = this.openModal.bind(this);
            this.closeModal = this.closeModal.bind(this);
        }

        openModal(props) {
            this.setState({ modalProps: props });
        }

        closeModal() {
            this.setState({ modalProps: null });
        }

        render() {
            const { modalProps } = this.state;

            return (
                <WrappedComponent
                    {...this.props}
                    openModal={this.openModal}
                    closeModal={this.closeModal}
                    innerModal={
                        modalProps && (
                            <Modal
                                {...modalProps}
                                closeModal={this.closeModal}
                            />
                        )
                    }
                />
            );
        }
    }

    InnerModalHOC.displayName = `InnerModalHOC(${WrappedComponent.displayName})`;

    return InnerModalHOC;
}

export default withInnerModal;
