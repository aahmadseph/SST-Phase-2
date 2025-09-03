/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'Store';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Auth from 'utils/Authentication';
import actions from 'Actions';
import ProductActions from 'actions/ProductActions';

import Location from 'utils/Location';
import Iovation from 'utils/Iovation';
import UrlUtils from 'utils/Url';
import FormValidator from 'utils/FormValidator';
import dateUtils from 'utils/Date';
import communityUtils from 'utils/Community';
import questionAnswerApi from 'services/api/questionAndAnswer';
import questionsAnswersAnalytics from 'analytics/bindingMethods/pages/productPage/questionsAnswersBindings';
import localeUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

import {
    Text, Container, Link, Box, Grid, Button, Divider
} from 'components/ui';
import { breakpoints } from 'style/config';
import Textarea from 'components/Inputs/Textarea/Textarea';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Loader from 'components/Loader/Loader';
import SubmitMessage from 'components/ProductPage/QuestionsAndAnswers/SubmitMessage';
import ModalGuidelines from 'components/ProductPage/QuestionsAndAnswers/ModalGuidelines';
import UI from 'utils/UI';
import { PostLoad } from 'constants/events';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

const MAX_ANSWER_CHARS = 1000;

let initialLoadFired = false;

class SubmitAnswerBody extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            productId: '',
            questionId: '',
            questionText: null,
            submissionTime: '',
            nickName: '',
            isSephoraEmployee: false,
            isFreeProduct: false,
            deviceData: null,
            answerTextError: false,
            isXS: null,
            showGuidelines: false,
            acceptedTerms: false,
            showTermsError: false,
            answerBody: null,
            isCommunityServiceEnabled: false,
            biAccountId: null,
            userNickname: '',
            profileId: ''
        };
        this.topContainerRef = React.createRef();
        store.setAndWatch(
            { 'page.product': 'currentProduct' },
            this,
            data => {
                if (
                    data &&
                    data.currentProduct &&
                    data.currentProduct.currentSku &&
                    data.currentProduct.currentSku.actionFlags &&
                    !initialLoadFired
                ) {
                    questionsAnswersAnalytics.fireSubmitPageLoad(data.currentProduct, false);
                    initialLoadFired = true;
                }
            },
            store.STATE_STRATEGIES.DIRECT_INIT
        );
    }

    componentDidMount() {
        const productId = UrlUtils.getParamsByName('productId')[0];
        const questionId = UrlUtils.getParamsByName('questionId')[0];
        const skuId = UrlUtils.getParamsByName('skuId')[0];
        const isCommunityServiceEnabled = Sephora.configurationSettings?.isCommunityServiceEnabled;

        store.dispatch(ProductActions.fetchCurrentProduct(productId, skuId));

        this.setState({
            productId: productId,
            questionId: questionId,
            isXS: window.matchMedia(breakpoints.xsMax).matches,
            isCommunityServiceEnabled
        });

        Auth.requireLoggedInAuthentication()
            .then(() => communityUtils.ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.bv))
            .then(() => {
                const user = store.getState().user;
                this.setState({
                    biAccountId: user.beautyInsiderAccount?.biAccountId,
                    profileId: user.profileId,
                    userNickname: user.nickName
                });
            })
            .catch(() => {
                // If the user cancels at any state of signin then redirect to product page.
                this.redirectToPpage();
            });

        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            Iovation.loadIovationScript();
            Iovation.getBlackboxString([], true).then(blackBoxString => {
                this.setState({
                    deviceData: blackBoxString
                });
            });
        });

        questionAnswerApi
            .getQuestionById(questionId, skuId)
            .then(data => {
                if (data.Results && data.Results.length) {
                    this.setState({
                        questionText: data.Results[0].QuestionDetails,
                        submissionTime: data.Results[0].SubmissionTime,
                        nickName: data.Results[0].UserNickname
                    });
                }
            })
            .catch(errors => {
                console.log('errors', errors); // eslint-disable-line no-console
            });
    }

    submitAnswer = e => {
        e.preventDefault();
        const {
            productId,
            questionId,
            isFreeProduct,
            isSephoraEmployee,
            currentProduct,
            questionText,
            isCommunityServiceEnabled,
            biAccountId,
            userNickname,
            profileId
        } = this.state;
        const isUS = localeUtils.isUS();
        const locale = localeUtils.isCanada() ? (localeUtils.isFrench() ? 'fr-CA' : 'en-CA') : 'en-US';

        if (this.validateForm()) {
            questionAnswerApi
                .submitAnswer(
                    productId,
                    questionId,
                    encodeURIComponent(this.answerText.getValue()).replace(/%\d\w|\+/g, ' '),
                    this.state.deviceData,
                    isSephoraEmployee,
                    isFreeProduct,
                    isCommunityServiceEnabled,
                    locale,
                    biAccountId,
                    userNickname,
                    profileId
                )
                .then(() => {
                    questionsAnswersAnalytics.fireSubmitSuccessPageLoad(currentProduct, false);

                    this.setState(
                        {
                            requestSuccess: true
                        },
                        () => UI.scrollTo({ ref: this.topContainerRef })
                    );
                    const AnswerBodyData = {
                        answerBody: this.state.answerBody,
                        answerQuestionId: questionId,
                        answerQuestionText: questionText,
                        answerSkuId: currentProduct.currentSku?.skuId ? currentProduct.currentSku?.skuId : null,
                        answerProductId: currentProduct.productDetails?.productId,
                        answerPrice: currentProduct.currentSku?.listPrice,
                        answerCurrency: isUS ? 'USD' : 'CAD',
                        answerBrandName: currentProduct.productDetails?.brand?.displayName,
                        answerProductName: currentProduct.productDetails?.displayName,
                        answerVariationType: currentProduct.currentSku?.variationType,
                        answerVariationValue: currentProduct.currentSku?.variationValue,
                        answerProductTopCategory: currentProduct.parentCategory?.displayName
                    };
                    //Analytics requested XSEL-1976
                    processEvent.process(
                        anaConsts.LINK_TRACKING_EVENT,
                        {
                            data: {
                                linkName: anaConsts.EVENT_NAMES.ANSWER_QUESTION_BODY_DETAILS,
                                actionInfo: anaConsts.EVENT_NAMES.ANSWER_QUESTION_BODY_DETAILS,
                                specificEventName: anaConsts.EVENT_NAMES.ANSWER_QUESTION_BODY_DETAILS,
                                sponsoredProductInformation: AnswerBodyData
                            }
                        },
                        { specificEventName: anaConsts.EVENT_NAMES.ANSWER_QUESTION_BODY_DETAILS }
                    );
                })
                .catch(error => {
                    if (error.responseStatus === 403 || error.responseStatus === 401 || error.responseStatus === 400) {
                        store.dispatch(
                            actions.showSignInModal({
                                isOpen: true,
                                callback: () => this.submitAnswer(e),
                                extraParams: { headerValue: '/api/bazaarvoice/answer' }
                            })
                        );
                    } else {
                        const errorMessages =
                            error && error.errorMessages && error.errorMessages.length
                                ? error.errorMessages
                                : ['Bazaarvoice returned error(s) during Answer Submit'];
                        questionsAnswersAnalytics.fireSubmitLinkTrackingError(errorMessages);
                        this.setState(
                            {
                                requestFailed: true
                            },
                            () => UI.scrollTo({ ref: this.topContainerRef })
                        );
                    }
                });
        }
    };

    validateAnswerText = answerText => {
        if (FormValidator.isEmpty(answerText)) {
            this.setState({ answerTextError: true });

            return getText('enterAnswer');
        } else {
            this.setState({ answerTextError: false, answerBody: answerText });
        }

        return null;
    };

    handleAnswerTextChange = answerText => {
        this.setState({ answerTextError: false });

        if (answerText.length === MAX_ANSWER_CHARS) {
            this.setState({
                answerTextMessage: getText('maxCharacter')
            });
        } else {
            if (this.state.answerTextMessage) {
                this.setState({
                    answerTextMessage: null
                });
            }
        }
    };

    validateForm = () => {
        const fieldsForValidation = [this.answerText];
        const errors = FormValidator.getErrors(fieldsForValidation);
        let formIsValid = true;

        if (!this.state.acceptedTerms) {
            formIsValid = false;
            this.setState({ showTermsError: true });
        }

        if (errors.fields.length) {
            formIsValid = false;
            questionsAnswersAnalytics.fireSubmitLinkTrackingError(errors.messages);
            UI.scrollTo({ ref: this.topContainerRef });
        }

        return formIsValid;
    };

    toggleGuidelines = () => {
        this.setState({
            showGuidelines: !this.state.showGuidelines
        });
    };

    redirectToPpage = () => {
        Location.setLocation(`/product/${this.state.productId}#QandA`);
    };

    setAcceptedTerms = event => {
        const acceptedTerms = event.target.checked;
        this.setState({ acceptedTerms, showTermsError: false });
    };

    render() {
        const {
            currentProduct, questionText, submissionTime, nickName, requestSuccess, requestFailed, showTermsError
        } = this.state;

        const { currentSku } = currentProduct;

        return (
            <Container
                paddingTop={[4, 6]}
                ref={this.topContainerRef}
            >
                {!requestSuccess && !requestFailed && (
                    <form
                        noValidate
                        onSubmit={this.submitAnswer}
                    >
                        <Grid
                            marginBottom={[4, 5]}
                            gap={3}
                            columns='1fr auto'
                            alignItems='baseline'
                            lineHeight='tight'
                        >
                            <Text
                                is='h1'
                                fontSize={['md', 'lg']}
                                fontWeight='bold'
                                children={getText('answerAQuestionTitle')}
                            />
                            <Link
                                display={[null, 'none']}
                                onClick={() => this.redirectToPpage()}
                                color='blue'
                                padding={2}
                                margin={-2}
                                data-at={Sephora.debug.dataAt('cancel_link')}
                                children={getText('cancel')}
                            />
                        </Grid>
                        {questionText && (
                            <React.Fragment>
                                <Grid
                                    backgroundColor='nearWhite'
                                    borderRadius={2}
                                    paddingX={[3, 4]}
                                    paddingY={[2, 3]}
                                    gap={null}
                                    columns='1.5em 1fr'
                                    maxWidth={612}
                                >
                                    <Text
                                        aria-label={getText('question')}
                                        fontWeight='bold'
                                        children='Q:'
                                    />
                                    <div>
                                        <Text
                                            is='p'
                                            fontWeight='bold'
                                            data-at={Sephora.debug.dataAt('asked_question_text')}
                                            children={questionText}
                                        />
                                        <Text
                                            is='p'
                                            marginTop='.125em'
                                            color='gray'
                                            fontSize={['sm', 'base']}
                                            data-at={Sephora.debug.dataAt('asked_question_date')}
                                            children={`${dateUtils.formatSocialDate(submissionTime, true)} ${
                                                nickName ? getText('postedBy', [nickName]) : ''
                                            }`}
                                        />
                                    </div>
                                </Grid>
                                <Divider marginY={[5, 6]} />
                            </React.Fragment>
                        )}
                        <Box
                            maxWidth={612}
                            marginBottom={4}
                        >
                            <Textarea
                                label={getText('enterYourAnswer', [MAX_ANSWER_CHARS])}
                                labelDataAt={'answer_field_ghost_text'}
                                rows={this.state.isXS ? 5 : 4}
                                name='reviewAnswer'
                                //minLength={MIN_ANSWER_CHARS}
                                maxLength={MAX_ANSWER_CHARS}
                                charCountDataAt={'char_counter_text'}
                                handleChange={answerText => this.handleAnswerTextChange(answerText)}
                                invalid={this.state.answerTextError}
                                errorDataAt={'error_msg_text'}
                                warning={this.state.answerTextMessage}
                                validate={answerText => this.validateAnswerText(answerText)}
                                ref={comp => (this.answerText = comp)}
                                data-at={Sephora.debug.dataAt('answer_field')}
                            />
                            <Link
                                padding={2}
                                margin={-2}
                                onClick={this.toggleGuidelines}
                                color='blue'
                                data-at={Sephora.debug.dataAt('guidelines_link')}
                                children={getText('questionAnswerGuidelines')}
                            />
                        </Box>
                        <Checkbox
                            paddingY={2}
                            checked={!!this.state.isSephoraEmployee}
                            data-at={Sephora.debug.dataAt('work_at_seph_checkbox')}
                            onClick={() => this.setState({ isSephoraEmployee: !this.state.isSephoraEmployee })}
                        >
                            {getText('iWorkAtSephora')}
                        </Checkbox>
                        <Checkbox
                            paddingY={2}
                            checked={this.state.isFreeProduct}
                            data-at={Sephora.debug.dataAt('free_samples_checkbox')}
                            onClick={() => this.setState({ isFreeProduct: !this.state.isFreeProduct })}
                        >
                            {getText('iReceivedFreeSample')}
                        </Checkbox>
                        <Divider
                            marginTop={4}
                            marginBottom={4}
                        />
                        <Checkbox
                            marginTop={4}
                            marginBottom={2}
                            paddingY={null}
                            checked={this.state.acceptedTerms}
                            onClick={this.setAcceptedTerms}
                            color={showTermsError ? 'error' : null}
                        >
                            {getText('yesIAgree')}
                            <Link
                                href='https://www.sephora.com/beauty/terms-of-use'
                                color='blue'
                                data-at={Sephora.debug.dataAt('terms_and_conditions_link')}
                                padding={2}
                                margin={-2}
                                target='_blank'
                            >
                                {getText('termsAndConditions')}
                            </Link>
                            .
                        </Checkbox>
                        <Grid
                            gap={3}
                            maxWidth={612}
                        >
                            {showTermsError && (
                                <Text
                                    is='p'
                                    color='error'
                                    paddingBottom={2}
                                    paddingLeft={6}
                                    fontSize='sm'
                                    lineHeight='tight'
                                >
                                    {getText('termsError')}
                                </Text>
                            )}
                            <Text
                                fontSize='sm'
                                lineHeight='tight'
                                paddingLeft={6}
                                color='gray'
                            >
                                <Text
                                    display='inline-block'
                                    marginTop='.125em'
                                    fontWeight='bold'
                                >
                                    {getText('noteLabel')}:{' '}
                                </Text>
                                {getText('responsiblity')}
                            </Text>
                            <Text
                                is='p'
                                lineHeight='tight'
                                fontSize='sm'
                                color='gray'
                                children={getText('answerNote')}
                            />
                            <Grid
                                gap={4}
                                alignItems='center'
                                columns={[null, 'auto 1fr']}
                            >
                                <Button
                                    width={['100%', 'auto']}
                                    minWidth={[null, '14.5em']}
                                    variant='primary'
                                    type='submit'
                                    data-at={Sephora.debug.dataAt('submit_answer_button')}
                                    children={getText('submit')}
                                />
                                <Link
                                    display={['none', 'block']}
                                    color='blue'
                                    padding={2}
                                    margin={-2}
                                    marginRight='auto'
                                    onClick={() => this.redirectToPpage()}
                                    data-at={Sephora.debug.dataAt('cancel_link')}
                                    children={getText('cancel')}
                                />
                            </Grid>
                        </Grid>
                    </form>
                )}
                {!currentSku && <Loader isShown={true} />}
                {(requestSuccess || requestFailed) && (
                    <SubmitMessage
                        redirectTo={this.redirectToPpage}
                        isError={requestFailed}
                    />
                )}
                {this.state.showGuidelines && <ModalGuidelines onDismiss={this.toggleGuidelines} />}
            </Container>
        );
    }
}

export default wrapComponent(SubmitAnswerBody, 'SubmitAnswerBody', true);
