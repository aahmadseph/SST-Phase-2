/* eslint-disable class-methods-use-this */
import React from 'react';
import MediaUtils from 'utils/Media';
import { Button } from 'components/ui';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import { PHOTO_CAPTURE_URL } from 'constants/arSkincare';
import StickyFooter from 'components/StickyFooter/StickyFooter';

const { Media } = MediaUtils;
const { wrapComponent } = FrameworkUtils;

class SmartSkinScan extends BaseClass {
    render() {
        const { ctaText, onClickCTA } = this.props;

        return (
            <div>
                <h1>This is a placeholder for smart skin scan landing page</h1>
                <Media lessThan='md'>
                    <StickyFooter accountForBottomNav={true}>
                        <Button
                            variant='primary'
                            block={true}
                            onClick={() => onClickCTA(PHOTO_CAPTURE_URL)}
                        >
                            {ctaText}
                        </Button>
                    </StickyFooter>
                </Media>
            </div>
        );
    }
}

export default wrapComponent(SmartSkinScan, 'SmartSkinScan', true);
