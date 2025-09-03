import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import {
    Text, Box, Flex, Button, Grid, Divider, Link
} from 'components/ui';
import Flag from 'components/Flag';

function ColorIQHistoryWorld({
    captured, colorIQ, close, colorIQHistoryTitle, gotIt, latest, isOpen, colorIQLink
}) {
    const getColorMatchUrl = skinTone => {
        if (skinTone.labValue) {
            const [l, a, b] = skinTone.labValue.split(',');

            return `/beauty/makeup-color-match?l=${l}&a=${a}&b=${b}`;
        }

        return '/beauty/makeup-color-match';
    };

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
                {colorIQ.map((skinTone, index) => {
                    // Date is already formatted as MM/DD/YYYY with zeros from the save action
                    const formattedDate = skinTone.createDate || skinTone.creationDate;

                    return (
                        <div key={skinTone.shadeCode || index}>
                            <Grid
                                lineHeight='tight'
                                gap={4}
                                columns='auto 1fr'
                                alignItems='start'
                            >
                                <Box
                                    size={36}
                                    borderRadius='full'
                                    backgroundColor={skinTone.hexCode || skinTone.hexValue}
                                />
                                <Box>
                                    {index === 0 && <Flag children={latest} />}
                                    <Text display='block'>{skinTone.description}</Text>
                                    <Text
                                        display='block'
                                        color='gray'
                                    >
                                        {captured} {formattedDate}
                                    </Text>
                                    {colorIQLink && (
                                        <Link
                                            href={getColorMatchUrl(skinTone)}
                                            color='#136BEA'
                                            fontSize='12px'
                                            fontWeight='normal'
                                            css={{
                                                textDecoration: 'underline',
                                                marginTop: '8px',
                                                display: 'block'
                                            }}
                                        >
                                            {colorIQLink}
                                        </Link>
                                    )}
                                </Box>
                            </Grid>
                            {index < colorIQ.length - 1 && (
                                <Divider
                                    marginY={3}
                                    marginX={null}
                                />
                            )}
                        </div>
                    );
                })}
            </Modal.Body>
            <Modal.Footer hasBorder={true}>
                <Flex
                    justifyContent='center'
                    width='100%'
                >
                    <Button
                        width='100%'
                        variant='primary'
                        onClick={close}
                        children={gotIt}
                    />
                </Flex>
            </Modal.Footer>
        </Modal>
    );
}

ColorIQHistoryWorld.propTypes = {
    captured: PropTypes.string.isRequired,
    colorIQ: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    colorIQHistoryTitle: PropTypes.string.isRequired,
    gotIt: PropTypes.string.isRequired,
    latest: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    colorIQLink: PropTypes.string
};

export default wrapFunctionalComponent(ColorIQHistoryWorld, 'ColorIQHistoryWorld');
