import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import {
    Grid, Text, Button, Link
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import CopyToClipboard from 'react-copy-to-clipboard';

class ReportContentModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isCopied: false
        };
    }

    handleOnDismiss = () => {
        const { toggleReportContentModal } = this.props;
        toggleReportContentModal({ isOpen: false });
    };

    handleOnCopy = () => {
        this.setState({
            isCopied: true
        });
    };

    render() {
        const {
            localization: {
                reportTitle, subTitle1, subTitle2, copied, copy
            },
            isOpen,
            shareReportUrl
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handleOnDismiss}
                isDrawer={true}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{reportTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        marginBottom={2}
                    >
                        {subTitle1}{' '}
                        <Link
                            href='mailto:privacy@pixleeturnto.com'
                            children='privacy@pixleeturnto.com'
                            underline={true}
                        />{' '}
                        {subTitle2}
                    </Text>
                    <Grid columns='1fr auto'>
                        <TextInput
                            marginBottom={null}
                            highlight={true}
                            value={shareReportUrl}
                            readOnly={true}
                            label='URL'
                        />
                        <CopyToClipboard
                            text={shareReportUrl}
                            onCopy={this.handleOnCopy}
                        >
                            <Button variant='primary'>{this.state.isCopied ? copied : copy}</Button>
                        </CopyToClipboard>
                    </Grid>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ReportContentModal, 'ReportContentModal', true);
