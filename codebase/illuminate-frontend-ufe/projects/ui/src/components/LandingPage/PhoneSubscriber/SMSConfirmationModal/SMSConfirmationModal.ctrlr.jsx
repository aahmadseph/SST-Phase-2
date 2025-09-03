import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import languageLocale from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import Modal from 'components/Modal/Modal';
import {
    Button, Text, Link, Divider
} from 'components/ui';

const { getLocaleResourceFile, getCurrentCountry, isUS } = languageLocale;

const getText = resourceWrapper(getLocaleResourceFile('components/LandingPage/PhoneSubscriber/SMSConfirmationModal/locales', 'SMSConfirmationModal'));

const country = getCurrentCountry();

class SMSConfirmationModal extends BaseClass {
    render() {
        const { isOpen, continueShoppingCallBack, closeModal, phoneNumber = '' } = this.props;

        return (
            <Modal
                showDismiss
                isOpen={isOpen}
                onDismiss={closeModal}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title data-at={Sephora.debug.dataAt('sms_confirmation_title')}>{getText('modalTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='h2'
                        fontWeight='bold'
                        fontSize='md'
                        marginBottom={2}
                        lineHeight='tight'
                        children={getText('heading')}
                    />
                    <Text
                        is='p'
                        marginBottom={5}
                        children={getText('checkYourSMS', false, <strong>{phoneNumber}</strong>)}
                    />
                    <Button
                        variant='primary'
                        hasMinWidth={true}
                        onClick={continueShoppingCallBack}
                    >
                        {getText('continueShopping')}
                    </Button>
                    <Divider marginY={5} />
                    <Text
                        is='p'
                        fontSize='sm'
                        marginBottom={4}
                        lineHeight='tight'
                        children={getText(
                            `disclaimerLine1${country}`,
                            false,
                            <Link
                                padding={2}
                                margin={-2}
                                color='blue'
                                underline={true}
                                target='_blank'
                                href={'/beauty/sms-terms-and-conditions'}
                                children={getText('textTerms')}
                            />,
                            <Link
                                padding={2}
                                margin={-2}
                                color='blue'
                                underline={true}
                                target='_blank'
                                href={'/beauty/privacy-policy'}
                                children={getText('privacyPolicy')}
                            />,
                            isUS() && (
                                <Link
                                    padding={2}
                                    margin={-2}
                                    color='blue'
                                    underline={true}
                                    target='_blank'
                                    href={'/beauty/privacy-policy#USNoticeIncentive'}
                                    children={getText('noticeOfFinancialInsentive')}
                                />
                            )
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(SMSConfirmationModal, 'SMSConfirmationModal', true);
