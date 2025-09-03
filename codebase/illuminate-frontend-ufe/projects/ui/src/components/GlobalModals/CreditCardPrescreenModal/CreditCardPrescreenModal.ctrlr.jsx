/* eslint-disable class-methods-use-this */
import Actions from 'Actions';
import store from 'store/Store';
import CreditCardActions from 'actions/CreditCardActions';
import userActions from 'actions/UserActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import BaseClass from 'components/BaseClass';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Modal from 'components/Modal/Modal';
import { Button } from 'components/ui';
import { PRESCREEN_USER_RESPONSES } from 'constants/CreditCard';
import React from 'react';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import { wrapComponent } from 'utils/framework';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import storage from 'utils/localStorage/Storage';

const { getLocaleResourceFile } = LanguageLocaleUtils;

// eslint-disable-next-line no-console
const logError = error => console.error(error && error.errorMessages && error.errorMessages[0]);
const redirectToApply = () => {
    store.dispatch(Actions.showCreditCardPrescreenModal(false));
    urlUtils.redirectTo('/creditcard-apply');
};
const closeModal = () => store.dispatch(Actions.showCreditCardPrescreenModal(false));

class CreditCardPrescreenModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //ILLUPH - 117699
        if (processEvent) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'creditcard:bcc prescreen-banner:n/a:*',
                    pageType: 'creditcard'
                }
            });
        }
    }

    handleNoThanks = () => {
        CreditCardActions.captureRealtimePrescreenUserResponse(PRESCREEN_USER_RESPONSES.DECLINED).catch(logError).finally(closeModal);

        //ILLUPH - 117699 AC#2
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: 'creditcard:bcc prescreen-banner:n/a:*',
                linkName: 'creditcard:bcc prescreen-banner:no thanks',
                internalCampaign: 'creditcard:bcc prescreen-banner:no thanks'
            }
        });
    };

    handleAcceptNow = () => {
        CreditCardActions.captureRealtimePrescreenUserResponse(PRESCREEN_USER_RESPONSES.ACCEPTED)
            .then(() => {
                //need to get up to date user data so cc apply page reflects current status
                storage.local.removeItem(LOCAL_STORAGE.CREDIT_CARD_TARGETERS);
                store.dispatch(userActions.getUserFull(null, redirectToApply));
            })
            .catch(logError)
            .finally(closeModal);
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/locales', 'modals');
        const { content, isOpen } = this.props;

        const isDesktop = Sephora.isDesktop();

        return (
            <Modal
                isOpen={isOpen}
                width={4}
                showDismiss={false}
                hasBodyScroll={true}
                dataAt='creditCardPrescreenModal'
            >
                <Modal.Header>
                    <Modal.Title>{content.title || getText('sephoraCreditCard')}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                    maxHeight={470}
                >
                    <BccComponentList items={content.regions.content} />
                </Modal.Body>
                <Modal.Footer>
                    <div
                        css={
                            isDesktop && {
                                maxWidth: 600,
                                margin: '0 auto'
                            }
                        }
                    >
                        <LegacyGrid
                            fill={true}
                            gutter={isDesktop ? 5 : 4}
                        >
                            <LegacyGrid.Cell>
                                <Button
                                    variant='secondary'
                                    block={true}
                                    onClick={this.handleNoThanks}
                                    children={getText('noThanks')}
                                />
                            </LegacyGrid.Cell>
                            <LegacyGrid.Cell>
                                <Button
                                    variant='primary'
                                    block={true}
                                    onClick={this.handleAcceptNow}
                                    children={getText('acceptNow')}
                                />
                            </LegacyGrid.Cell>
                        </LegacyGrid>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(CreditCardPrescreenModal, 'CreditCardPrescreenModal', true);
