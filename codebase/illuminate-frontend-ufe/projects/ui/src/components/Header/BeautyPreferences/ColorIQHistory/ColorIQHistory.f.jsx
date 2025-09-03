import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import {
    Text, Box, Flex, Button, Grid, Divider
} from 'components/ui';
import Flag from 'components/Flag';

function ColorIQHistory({
    captured, colorIQ, close, colorIQHistoryTitle, gotIt, latest, isOpen
}) {
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={close}
            isDrawer={true}
            width={0}
            hasBodyScroll={true}
        >
            <Modal.Header>
                <Modal.Title>{colorIQHistoryTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {colorIQ.map((skinTone, index) => (
                    <div key={skinTone.shadeCode}>
                        <Grid
                            lineHeight='tight'
                            gap={4}
                            columns='auto 1fr'
                            alignItems='start'
                        >
                            <Box
                                size={36}
                                borderRadius='full'
                                backgroundColor={skinTone.hexCode}
                            />
                            <p>
                                {index === 0 && <Flag children={latest} />}
                                <Text display='block'>{skinTone.description}</Text>
                                <Text
                                    display='block'
                                    color='gray'
                                >
                                    {captured} {skinTone.createDate ?? ''}
                                </Text>
                            </p>
                        </Grid>
                        {index < colorIQ.length - 1 && (
                            <Divider
                                marginY={3}
                                marginX={null}
                            />
                        )}
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer hasBorder={true}>
                <Flex justifyContent='flex-end'>
                    <Button
                        width={[164, 126]}
                        variant='primary'
                        onClick={close}
                        children={gotIt}
                    />
                </Flex>
            </Modal.Footer>
        </Modal>
    );
}

ColorIQHistory.defaultProps = {};

ColorIQHistory.propTypes = {
    captured: PropTypes.string.isRequired,
    colorIQ: PropTypes.array.isRequired,
    close: PropTypes.bool.isRequired,
    colorIQHistoryTitle: PropTypes.string.isRequired,
    gotIt: PropTypes.string.isRequired,
    latest: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(ColorIQHistory, 'ColorIQHistory');
