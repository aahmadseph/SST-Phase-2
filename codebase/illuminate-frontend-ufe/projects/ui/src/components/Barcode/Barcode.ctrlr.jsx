import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Flex, Text } from 'components/ui';
import JsBarcode from 'jsbarcode';

const { wrapComponent } = FrameworkUtils;

const BARCODES = {
    CODE39: 'CODE39',
    CODE128: 'CODE128'
};

class Barcode extends BaseClass {
    componentDidMount() {
        if (this.props.id && this.svg) {
            this.createBarcode(this.svg, this.props.id, this.props.code);
        }
    }

    createBarcode = (element, id, code) => {
        JsBarcode(element, id, {
            format: BARCODES[code],
            displayValue: false
        });
    };

    render() {
        const {
            hasBorder, showLabel, barcodeDataAt, labelDataAt, flexDirection = 'column', isCenter = true
        } = this.props;

        return (
            <Flex
                flexDirection={flexDirection}
                alignItems='center'
                justifyContent={isCenter ? 'center' : null}
            >
                <Box
                    backgroundColor='white'
                    {...(hasBorder && {
                        padding: 2,
                        border: 1,
                        borderColor: 'gray',
                        borderRadius: 2
                    })}
                    textAlign='center'
                    data-at={Sephora.debug.dataAt(barcodeDataAt)}
                    borderRadius={2}
                >
                    <svg
                        css={{
                            display: 'block',
                            width: 288,
                            maxWidth: '100%',
                            height: 'auto'
                        }}
                        ref={comp => (this.svg = comp)}
                    />
                </Box>
                {showLabel && (
                    <Text
                        is='p'
                        marginTop={1}
                        data-at={Sephora.debug.dataAt(labelDataAt)}
                        children={this.props.id}
                    />
                )}
            </Flex>
        );
    }
}

export default wrapComponent(Barcode, 'Barcode', true);
