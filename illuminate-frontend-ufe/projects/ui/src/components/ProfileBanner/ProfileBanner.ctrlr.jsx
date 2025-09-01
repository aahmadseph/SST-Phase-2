/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import MainProfileBanner from 'components/ProfileBanner/MainProfileBanner';
import StickyProfileBanner from 'components/ProfileBanner/StickyProfileBanner';
import { breakpoints } from 'style/config';
import { DebouncedResize } from 'constants/events';

class ProfileBanner extends BaseClass {
    state = {
        isSMUI: false
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    handleResize = () => {
        const isSMUI = window?.matchMedia(breakpoints.smMax).matches;

        if (isSMUI !== this.state.isSMUI) {
            this.setState({
                isSMUI: isSMUI
            });
        }
    };

    render() {
        const { isAtLeastRecognized } = this.props;

        return (
            <>
                <MainProfileBanner {...this.props} />
                {isAtLeastRecognized && this.state.isSMUI && <StickyProfileBanner {...this.props} />}
            </>
        );
    }
}

export default wrapComponent(ProfileBanner, 'ProfileBanner');
