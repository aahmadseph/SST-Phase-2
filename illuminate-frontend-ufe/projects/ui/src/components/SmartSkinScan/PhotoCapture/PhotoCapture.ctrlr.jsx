/* eslint-disable class-methods-use-this */
import React from 'react';
import { Link } from 'components/ui';
import Location from 'utils/Location';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';

const { wrapComponent } = FrameworkUtils;

class PhotoCapture extends BaseClass {
    onClickLink = e => {
        Location.navigateTo(e, '/virtual/smart-skin-scan');

        return false;
    };
    render() {
        return (
            <div>
                <h1>This is Photo capture placeholder page</h1>
                <Link
                    href='/virtual/smart-skin-scan'
                    onClick={e => this.onClickLink(e)}
                >
                    Landing Page
                </Link>
            </div>
        );
    }
}

export default wrapComponent(PhotoCapture, 'PhotoCapture', true);
