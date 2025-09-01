/* eslint-disable class-methods-use-this */
import Actions from 'Actions';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import React from 'react';
import typography from 'style/typography';
import dateUtils from 'utils/Date';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class CreditReportDetailsModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: dateUtils.formatDateMDY(new Date().toISOString(), true, true)
        };
    }

    requestClose = () => {
        store.dispatch(Actions.showCreditReportDetailsModal(false));
    };
    render() {
        const getText = resourceWrapper(
            getLocaleResourceFile('components/GlobalModals/CreditReportDetailsModal/locales', 'CreditReportDetailsModal')
        );
        const { isOpen, bureauAddress, bureauCreditScore, bureauRejectReasons } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                dataAt='creditReportDetailsModal'
            >
                <Modal.Body
                    padForX={true}
                    lineHeight='tight'
                    css={[typography, styles]}
                >
                    <h2>{getText('text1Title1')}</h2>
                    <h3>{getText('text1Title2')}</h3>
                    <p>{getText('text1paragraph1')}</p>
                    <h3>{getText('text1Title3')}</h3>
                    <p>{getText('text1paragraph2')}</p>
                    <p>{getText('text1paragraph3')}</p>
                    <h3>{getText('text1Title4')}</h3>
                    <p>{getText('text1paragraph4')}</p>
                    <p>{getText('text1paragraph5')}</p>
                    <p>{getText('text1paragraph6')}</p>
                    <h3>{getText('text1Title5')}</h3>
                    <p>{getText('text1paragraph7')}</p>

                    <p>
                        {bureauAddress && (
                            <React.Fragment>
                                {' '}
                                {getText('toObtainYourFreeReport', false)}
                                <address>
                                    {bureauAddress.map((addressLine, index) => (
                                        <div key={`address-line-${index}`}>{addressLine}</div>
                                    ))}
                                </address>
                            </React.Fragment>
                        )}
                    </p>

                    <h3>{getText('text2Title1')}</h3>
                    <p>{getText('text2paragraph1', true)}</p>
                    <h2>{getText('text2Title2')}</h2>
                    <h3>{getText('text2Title3')}</h3>
                    <p>{getText('text2paragraph2')}</p>

                    <h3>{getText('yourCS', false, this.state.currentDate, bureauCreditScore)}</h3>
                    <p>{getText('yourCSComment', false)}</p>

                    {bureauRejectReasons && (
                        <React.Fragment>
                            <p>{getText('highestKeyFactors', false)}</p>
                            <ul>
                                {bureauRejectReasons.map((reason, index) => (
                                    <li
                                        key={`reject-reason-${index}`}
                                        children={reason}
                                    />
                                ))}
                            </ul>
                        </React.Fragment>
                    )}
                    <p>{getText('ifYouHaveQuestions', false)}</p>
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    '& address': {
        marginTop: '1em'
    }
};

export default wrapComponent(CreditReportDetailsModal, 'CreditReportDetailsModal', true);
