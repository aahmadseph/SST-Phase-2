/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import ComponentList from 'components/Content/ComponentList';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import ContentConstants from 'constants/content';
import PropTypes from 'prop-types';
import getModal from 'services/api/cms/getModal';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import Actions from 'Actions';
import {
    Button, Text, Grid, Flex
} from 'components/ui';
import { mediaQueries, colors } from 'style/config';

import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import CreditCardActions from 'actions/CreditCardActions';
import { PRESCREEN_USER_RESPONSES } from 'constants/CreditCard';
import userActions from 'actions/UserActions';
import storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import localeUtils from 'utils/LanguageLocale';
import RCPSCookies from 'utils/RCPSCookies';
import Location from 'utils/Location';
import ContentModalBindings from 'analytics/bindingMethods/components/globalModals/contentModal/ContentModalBindings';

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/locales', 'modals');

const { CONTEXTS } = ContentConstants;

class ContentModal extends BaseClass {
    state = {
        items: null
    };

    componentDidMount() {
        const { country, channel, language } = Sephora.renderQueryParams;

        getModal({
            country,
            channel,
            language,
            sid: this.props.data.sid
        }).then(comp => {
            const items = comp?.data?.items;
            this.setState({ items });
            this.getPersonalizedContentItems(items);
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps?.user?.userId !== this.props.user?.userId) {
            this.getPersonalizedContentItems(this.state.items);
        }
    }

    isPersonalizationAvailable() {
        if (Location.isBasketPage()) {
            return Sephora.configurationSettings.isBasketVfoPersonalizationEnabled;
        }

        return false;
    }

    getPersonalizedContentItems(items) {
        if (!this.isPersonalizationAvailable()) {
            return;
        }

        store.dispatch(this.props.getPersonalizedEnabledComponents(items));
    }

    creditCardPrescreenHeader = () => {
        const firstName = userUtils.getProfileFirstName();
        const lastName = userUtils.getProfileLastName();

        return (
            <Text
                is='h2'
                fontWeight='bold'
                fontSize='lg'
                marginBottom={4}
                children={`${getText('congratulations')} ${firstName} ${lastName}!`}
            />
        );
    };

    // eslint-disable-next-line no-console
    logError = error => console.error(error && error.errorMessages && error.errorMessages[0]);
    redirectToApply = () => {
        urlUtils.redirectTo('/creditcard/apply');
    };
    closeModal = () => store.dispatch(Actions.showContentModal({ isOpen: false, data: null }));
    handleAction = type => () => {
        let userResponseService = CreditCardActions.captureRealtimePrescreenUserResponse;

        if (RCPSCookies.isRCPSCCAP()) {
            userResponseService = CreditCardActions.realtimePrescreenUserResponse;
        }

        switch (type) {
            case 'apply':
                ContentModalBindings.trackAnalyticsForPrescreenModal(getText('acceptNow'));
                userResponseService(PRESCREEN_USER_RESPONSES.ACCEPTED)
                    .then(() => {
                        //need to get up to date user data so cc apply page reflects current status
                        storage.local.removeItem(LOCAL_STORAGE.CREDIT_CARD_TARGETERS);
                        store.dispatch(userActions.getUserFull(null, this.redirectToApply));
                    })
                    .catch(this.logError);

                break;
            case 'no':
                ContentModalBindings.trackAnalyticsForPrescreenModal(getText('noThanks'));
                userResponseService(PRESCREEN_USER_RESPONSES.DECLINED).catch(this.logError).finally(this.closeModal);

                break;
            case 'not-me':
                ContentModalBindings.trackAnalyticsForPrescreenModal(getText('notMe'));
                userResponseService(PRESCREEN_USER_RESPONSES.NOT_ME).catch(this.logError).finally(this.closeModal);

                break;
            default:
        }
    };

    creditCardPrescreenFooter = () => {
        return (
            <Modal.Footer hasBorder={true}>
                <Grid css={styles.prescreenGrid}>
                    <Button
                        variant='primary'
                        block={true}
                        onClick={this.handleAction('apply')}
                        children={getText('acceptNow')}
                    />
                    <Button
                        variant='primary'
                        block={true}
                        onClick={this.handleAction('no')}
                        children={getText('noThanks')}
                    />
                    <Button
                        variant='primary'
                        block={true}
                        onClick={this.handleAction('not-me')}
                        children={getText('notMe')}
                    />
                </Grid>
            </Modal.Footer>
        );
    };

    renderCloseButtonFooter = () => {
        const { data } = this.props;
        const { footerAlign, closeButtonText, closeButtonWidth } = data;

        const align = {
            left: 'flex-start',
            center: 'center',
            right: 'flex-end'
        };

        return (
            <Modal.Footer hasBorder={true}>
                <Flex justifyContent={align[footerAlign]}>
                    <Button
                        variant='primary'
                        block={true}
                        onClick={this.closeModal}
                        children={closeButtonText}
                        minHeight={[44, null, 32]}
                        {...(closeButtonWidth && { maxWidth: ['100%', null, closeButtonWidth] })}
                    />
                </Flex>
            </Modal.Footer>
        );
    };

    renderFooter = () => {
        const { data } = this.props;
        const { isPrescreenModal, showCloseButton } = data;

        if (isPrescreenModal && !showCloseButton) {
            return this.creditCardPrescreenFooter();
        }

        if (showCloseButton && !isPrescreenModal) {
            return this.renderCloseButtonFooter();
        }

        return null;
    };

    render() {
        const { isOpen, onDismiss, data } = this.props;
        const { title, width, isPrescreenModal, isDrawer } = data;
        const { items } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
                width={width}
                showDismiss={!isPrescreenModal ?? true}
                hasBodyScroll={isPrescreenModal}
                isDrawer={isDrawer}
            >
                {title && (
                    <Modal.Header closable={!isPrescreenModal ?? true}>
                        <Modal.Title children={title} />
                    </Modal.Header>
                )}
                <Modal.Body
                    padForX={!title}
                    hasBodyScroll={isPrescreenModal}
                >
                    {isPrescreenModal && this.creditCardPrescreenHeader()}
                    {items ? (
                        <ComponentList
                            items={items}
                            context={CONTEXTS.MODAL}
                            removeFirstItemMargin={true}
                            removeLastItemMargin={true}
                        />
                    ) : (
                        <Loader
                            isShown={true}
                            isInline={true}
                        />
                    )}
                </Modal.Body>
                {this.renderFooter()}
            </Modal>
        );
    }
}

const styles = {
    prescreenGrid: {
        gap: 8,
        gridTemplateColumns: '1fr',
        justifyItems: 'center',
        [mediaQueries.sm]: {
            gridTemplateColumns: 'repeat(3, 164px)',
            justifyItems: 'unset',
            alignItems: 'center'
        }
    },
    prescreenLink: {
        gridColumn: 'span 2',
        whiteSpace: 'nowrap',
        color: colors.link,
        [mediaQueries.sm]: {
            gridColumn: 'unset'
        }
    }
};

ContentModal.propTypes = {
    data: PropTypes.shape({
        sid: PropTypes.string,
        title: PropTypes.string,
        width: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
        isPrescreenModal: PropTypes.bool,
        showCloseButton: PropTypes.bool,
        isDrawer: PropTypes.bool,
        footerAlign: PropTypes.oneOf(['left', 'center', 'right']),
        closeButtonText: PropTypes.string,
        closeButtonWidth: PropTypes.number
    })
};

ContentModal.defaultProps = {
    data: {
        sid: null,
        title: null,
        width: 2,
        isPrescreenModal: false,
        showCloseButton: false,
        isDrawer: false,
        footerAlign: 'left',
        closeButtonText: getText('close'),
        closeButtonWidth: null
    }
};

export default wrapComponent(ContentModal, 'ContentModal', true);
