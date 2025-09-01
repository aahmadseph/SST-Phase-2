/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import React from 'react';
import { wrapComponent } from 'utils/framework';

import analyticsConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';

import { Button, Divider, Grid } from 'components/ui';
import LanguageLocaleUtils from 'utils/LanguageLocale';

import Collapse from 'components/GlobalModals/ConsumerPrivacyModal/ConsumerPrivacyCollapse';
import InputSwitch from 'components/Inputs/InputSwitch/InputSwitch';
import Modal from 'components/Modal/Modal';
import cookieUtils from 'utils/Cookies';
import Location from 'utils/Location';
import gpc from 'utils/gpc';

const ITEMS = {
    overview: 'overview',
    requiredCookies: 'required-cookies',
    advertisingCookies: 'advertising-cookies'
};

const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/ConsumerPrivacyModal/locales', 'ConsumerPrivacyModal');

class ConsumerPrivacyModal extends BaseClass {
    state = {
        expanded: ITEMS.overview,
        accepted: !cookieUtils.read(cookieUtils.KEYS.CCPA_CONSENT_COOKIE)
    };

    defineExpandedItem = name => () => {
        const expanded = !this.shouldBeExpanded(name) ? name : null;
        const sectionHeading = name.replace('-', ' ');

        this.setState({ expanded });

        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: `privacy settings:${sectionHeading}`
            }
        });
    };

    shouldBeExpanded = name => {
        return this.state.expanded === name;
    };

    applySettings = () => {
        const { accepted } = this.state;

        if (accepted) {
            cookieUtils.delete(cookieUtils.KEYS.CCPA_CONSENT_COOKIE);
        } else {
            gpc.deleteAllCookiesExceptAllowed();
            cookieUtils.write(cookieUtils.KEYS.CCPA_CONSENT_COOKIE, 1);
        }

        anaUtils.setNextPageData({
            linkData: 'privacy settings:save preferences'
        });

        Location.reload();
    };

    handleAcceptSwitch = () => {
        this.setState({ accepted: !this.state.accepted });
    };

    renderOverviewItem() {
        return (
            <Collapse
                id={ITEMS.overview}
                title='Overview'
                expanded={this.shouldBeExpanded(ITEMS.overview)}
                onClick={this.defineExpandedItem(ITEMS.overview)}
            >
                <p>
                    Your privacy is important to us.
                    <br />
                    <br />
                    We use technologies, such as cookies, that gather information on our website. That information is used for a variety of purposes
                    such as to understand how visitors interact with our websites, or to serve advertisements on our websites or on other websites.
                    The use of technologies, such as cookies, constitutes a “sale” of personal information under the California Consumer Privacy Act.
                    You can stop the use of certain third party tracking technologies that are not considered our service providers by clicking on the
                    “Do Not Sell or Share My Personal Information” link at the bottom of our website and selecting your preferences below, or
                    broadcasting the global privacy control signal. Note that due to technological limitations, if you visit our website from a
                    different computer or device, or clear cookies on your browser that store your preferences, you will need to return to this screen
                    to select your preferences and/or rebroadcast the signal. You can find a description of the types of tracking technologies, and
                    your options with respect to those technologies, below.
                </p>
            </Collapse>
        );
    }

    renderRequiredCookiesItem() {
        return (
            <Collapse
                id={ITEMS.requiredCookies}
                title='Required Cookies'
                expanded={this.shouldBeExpanded(ITEMS.requiredCookies)}
                onClick={this.defineExpandedItem(ITEMS.requiredCookies)}
                renderDivider
            >
                <p>
                    Required cookies keep our site working.
                    <br />
                    These cookies are necessary for our website to function. For example, required cookies are used when saving your settings and
                    preferences, when you log in and out of your account, and for other basic site functions. These cookies cannot be disabled.
                </p>
            </Collapse>
        );
    }

    renderAdvertisingCookiesItem() {
        return (
            <Collapse
                id={ITEMS.advertisingCookies}
                title='Third Party Advertising & Analytics Cookies'
                subtitle={getText(this.state.accepted ? 'allowCookies' : 'disallowCookies')}
                expanded={this.shouldBeExpanded(ITEMS.advertisingCookies)}
                onClick={this.defineExpandedItem(ITEMS.advertisingCookies)}
                renderDivider
            >
                <Grid
                    marginTop={1}
                    columns='1fr auto'
                    alignItems='center'
                >
                    <div>Allow advertising & analytics cookies</div>
                    <InputSwitch
                        name='advertising_cookies'
                        id='advertising_cookies'
                        checked={this.state.accepted}
                        onClick={this.handleAcceptSwitch}
                    />
                </Grid>

                <Divider marginY={4} />

                <p>
                    Advertising cookies are used to provide you with a personalized experience. These cookies may be set by our advertising partners
                    to build a profile of your interests. If you do not allow these cookies to be used, either by your browser settings or if you opt
                    out by toggling the button above to the left , you will experience less targeted advertising from our partners. Note that if you
                    select “do not allow advertising & analytics cookies” we may still use third party tracking technology from companies that have
                    contractually agreed to limit their use, storage, and disclosure of collected information to serving Sephora-specific
                    advertisements.
                </p>
            </Collapse>
        );
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.props.requestClose}
                hasBodyScroll={true}
                isDrawer={true}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('modalTitle')}</Modal.Title>
                </Modal.Header>

                <Modal.Body
                    paddingTop={null}
                    paddingBottom={null}
                    height={470}
                >
                    {
                        <>
                            {this.renderOverviewItem()}
                            {this.renderRequiredCookiesItem()}
                            {this.renderAdvertisingCookiesItem()}
                        </>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        onClick={this.applySettings}
                        children={getText('save')}
                        variant='primary'
                        block
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

ConsumerPrivacyModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    requestClose: PropTypes.func.isRequired
};

export default wrapComponent(ConsumerPrivacyModal, 'ConsumerPrivacyModal');
