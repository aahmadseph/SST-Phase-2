/*global PDF417*/

import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Flex } from 'components/ui';
import LoadScriptsUtils from 'utils/LoadScripts';
import { PostLoad } from 'constants/events';

const { wrapComponent } = FrameworkUtils;
const { loadScripts } = LoadScriptsUtils;

const BARCODE_WIDTH = 3.2;
const BARCODE_HEIGHT = 1;

class Barcode417 extends BaseClass {
    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            loadScripts(['/js/ufe/isomorphic/thirdparty/pdf417-min.js'], () => {
                this.createBarcode(this.props.code);
            });
        });
    }

    createBarcode = code => {
        if (this.canvas) {
            const ratio = window.devicePixelRatio || 1;
            PDF417.init(code);
            const barcode = PDF417.getBarcodeArray();
            const canvas = this.canvas;
            canvas.width = BARCODE_WIDTH * barcode.num_cols * ratio;
            canvas.height = BARCODE_HEIGHT * barcode.num_rows * ratio;
            canvas.style.width = canvas.width / ratio + 'px';
            canvas.style.height = canvas.height / ratio + 'px';
            const ctx = canvas.getContext('2d');
            ctx.scale(ratio, ratio);
            let y = 0;

            for (let r = 0; r < barcode.num_rows; ++r) {
                let x = 0;

                for (let c = 0; c < barcode.num_cols; ++c) {
                    if (barcode.bcode[r][c] === '1') {
                        ctx.fillRect(x, y, BARCODE_WIDTH, BARCODE_HEIGHT);
                    }

                    x += BARCODE_WIDTH;
                }

                y += BARCODE_HEIGHT;
            }
        }
    };

    render() {
        const { border, width } = this.props;

        return (
            <Flex
                justifyContent='center'
                backgroundColor='white'
                padding={2}
                border={border}
                borderColor='midGray'
                borderRadius={2}
                width={width}
            >
                <canvas
                    css={{
                        display: 'block',
                        width: 288,
                        maxWidth: '100%',
                        height: 'auto'
                    }}
                    ref={comp => (this.canvas = comp)}
                />
            </Flex>
        );
    }
}

export default wrapComponent(Barcode417, 'Barcode417', true);
