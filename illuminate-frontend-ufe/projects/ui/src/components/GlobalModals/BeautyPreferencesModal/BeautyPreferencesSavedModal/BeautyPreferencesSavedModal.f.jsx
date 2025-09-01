import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import {
    Button, Grid, Link, Text
} from 'components/ui';

function BeautyPreferencesSavedModal({
    isOpen,
    close,
    savedTitle,
    savedMessage1,
    savedMessage2,
    savedMessage3,
    linkText,
    keepGoing,
    gotIt,
    callback,
    cancelCallback
}) {
    const savedTitleWithEmoji = `🎉 ${savedTitle}`;
    const savedMessage3WithEmoji = `🛍️ ${savedMessage3}`;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={close}
            isDrawer={true}
            width={1}
        >
            <Modal.Header>
                <Modal.Title>{savedTitleWithEmoji}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {`${savedMessage1} `}
                    <Link
                        color='blue'
                        children={`${linkText} `}
                        onClick={callback}
                        underline={true}
                    />
                    {savedMessage2}
                </p>
                <Text
                    is='p'
                    marginTop={4}
                    children={` ${savedMessage3WithEmoji}`}
                />
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    columns={2}
                    gap={4}
                >
                    <Button
                        variant='secondary'
                        onClick={callback}
                        children={keepGoing}
                    />
                    <Button
                        variant='primary'
                        onClick={cancelCallback}
                        children={gotIt}
                    />
                </Grid>
            </Modal.Footer>
        </Modal>
    );
}

BeautyPreferencesSavedModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func,
    savedTitle: PropTypes.string.isRequired,
    savedMessage1: PropTypes.string.isRequired,
    savedMessage2: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    keepGoing: PropTypes.string.isRequired,
    gotIt: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(BeautyPreferencesSavedModal, 'BeautyPreferencesSavedModal');
