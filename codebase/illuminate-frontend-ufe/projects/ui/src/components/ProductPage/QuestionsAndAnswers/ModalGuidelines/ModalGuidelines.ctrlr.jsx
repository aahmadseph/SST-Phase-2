import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Button } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import typography from 'style/typography';
import getModal from 'services/api/cms/getModal';
import { globalModals } from 'utils/globalModals';
import ComponentList from 'components/Content/ComponentList';
import ContentConstants from 'constants/content';

const { CONTEXTS } = ContentConstants;
const { COMMUNITY_QUESTIONS_AND_ANSWERS } = globalModals;

const { getLocaleResourceFile, isFrench } = localeUtils;

class ModalGuidelines extends BaseClass {
    state = {
        contentfulData: {},
        isLoading: true
    };

    componentDidMount() {
        const { sid } = this.props.globalModals[COMMUNITY_QUESTIONS_AND_ANSWERS] || {};

        if (sid) {
            const { country, channel, language } = Sephora.renderQueryParams;
            getModal({ country, language, channel, sid })
                .then(data => {
                    this.setState({
                        contentfulData: data?.data,
                        isLoading: false
                    });
                })
                .catch(() => {
                    this.setState({
                        isLoading: false
                    });
                });
        } else {
            this.setState({
                isLoading: false
            });
        }
    }

    render() {
        const getText = getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

        const termsOfUseUrl = isFrench() ? 'https://www.sephora.com/ca/fr/beauty/terms-of-use' : 'https://www.sephora.com/beauty/terms-of-use';

        const { contentfulData, isLoading } = this.state;

        if (isLoading) {
            return null;
        }

        return (
            <Modal
                isOpen={true}
                onDismiss={this.props.onDismiss}
                width={2}
            >
                <Modal.Header>
                    <Modal.Title>{contentfulData?.title ? contentfulData.title : getText('questionAnswerGuidelines')}</Modal.Title>
                </Modal.Header>
                <Modal.Body css={typography}>
                    {contentfulData?.items?.length ? (
                        <ComponentList
                            items={contentfulData.items}
                            context={CONTEXTS.MODAL}
                            removeFirstItemMargin={true}
                            removeLastItemMargin={true}
                        />
                    ) : (
                        <>
                            <p>{getText('modalGuidelinesModeration')}</p>
                            <p>{getText('considerBeforeAsking')}</p>
                            <ul>
                                <li>{getText('focusOnProduct')}</li>
                                <li>
                                    {getText('relevantDetails')} <a href={termsOfUseUrl}>{getText('termsOfUse')}</a>.
                                </li>
                                <li>{getText('noMedicalAdvice')}</li>
                                <li>
                                    {getText('language1')} <a href={termsOfUseUrl}>{getText('termsOfUse')}</a>
                                    {getText('language2')}
                                </li>
                            </ul>
                            <p>{getText('answersGuidelines')}</p>
                            <ul>
                                <li>{getText('answersFocusOnExperience')}</li>
                                <li>{getText('answersDetails')}</li>
                                <li>
                                    {getText('answersModerators')} <a href={termsOfUseUrl}>{getText('termsOfUse')}</a>.
                                </li>
                                <li>{getText('answersNoMedicalAdvice')}</li>
                                <li>
                                    {getText('answersLanguage1')} <a href={termsOfUseUrl}>{getText('termsOfUse')}</a>
                                    {getText('answersLanguage2')}
                                </li>
                            </ul>
                            <p>
                                {getText('rightsReservations')} <a href={getText('contactUsUrl')}>{getText('contactUsUrl')}</a>.
                            </p>
                            <p>{getText('nowAskAndAnswer')}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        hasMinWidth={true}
                        children={getText('done')}
                        onClick={this.props.onDismiss}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(ModalGuidelines, 'ModalGuidelines');
