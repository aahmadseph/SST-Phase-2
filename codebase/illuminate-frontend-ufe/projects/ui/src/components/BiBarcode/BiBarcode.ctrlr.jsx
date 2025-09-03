/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Barcode from 'components/Barcode/Barcode417';
import biApi from 'services/api/beautyInsider';
import { PostLoad } from 'constants/events';

class BiBarcode extends BaseClass {
    state = {
        code: null
    };

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            biApi.getBiDigitalCardNumber(this.props.profileId).then(data => {
                this.setState({ code: data.biDigitalCardNumber });
            });
        });
    }

    render() {
        const { code } = this.state;

        return code ? (
            <Barcode
                code={code}
                border={1}
            />
        ) : null;
    }
}

export default wrapComponent(BiBarcode, 'BiBarcode', true);
