/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'Store';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import ProductActions from 'actions/ProductActions';

import ProductImage from 'components/Product/ProductImage/ProductImage';
import Textarea from 'components/Inputs/Textarea/Textarea';

import Loader from 'components/Loader/Loader';
import SubmitMessage from 'components/ProductPage/QuestionsAndAnswers/SubmitMessage';
import ModalGuidelines from 'components/ProductPage/QuestionsAndAnswers/ModalGuidelines';

import UrlUtils from 'utils/Url';
import FormValidator from 'utils/FormValidator';
import Iovation from 'utils/Iovation';
import skuUtils from 'utils/Sku';
import Location from 'utils/Location';
import userUtils from 'utils/User';
import UI from 'utils/UI';
import localeUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

import questionAnswerApi from 'services/api/questionAndAnswer';
import questionsAnswersAnalytics from 'analytics/bindingMethods/pages/productPage/questionsAnswersBindings';

import {
    Text, Container, Link, Box, Grid, Button, Divider
} from 'components/ui';

import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';

import { PostLoad } from 'constants/events';

import Empty from 'constants/empty';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

const MIN_QUESTION_CHARS = 15;
const MAX_QUESTION_CHARS = 255;

let initialLoadFired = false;
let emailId;

class SubmitQuestionBody extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showGuidelines: false,
            emailNotification: true,
            presetLogin: '',
            isDisabled: false,
            acceptedTerms: false,
            showTermsError: false,
            questionBody: null,
            isCommunityServiceEnabled: false,
            profileId: '',
            questionText: ''
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
                    questionsAnswersAnalytics.fireSubmitPageLoad(data.currentProduct, true);
                    initialLoadFired = true;
                }
            },
            store.STATE_STRATEGIES.DIRECT_INIT
        );
    }

    componentDidMount() {
        const productId = UrlUtils.getParamsByName('productId');
        const skuId = UrlUtils.getParamsByName('skuId');
        const isCommunityServiceEnabled = Sephora.configurationSettings?.isCommunityServiceEnabled;

        this.setState({
            isCommunityServiceEnabled
        });

        store.dispatch(ProductActions.fetchCurrentProduct(productId, skuId));
        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            Iovation.loadIovationScript();
            Iovation.getBlackboxString([], true).then(blackBoxString => {
                this.setState({
                    deviceData: blackBoxString
                });
            });

            store.setAndWatch('user', this, userData => {
                const isAnonymous = userUtils.isAnonymous();

                if (userData) {
                    this.setState({
                        presetLogin: !isAnonymous ? userData.user.login : null,
                        profileId: !isAnonymous ? userData.user.profileId : null
                    });
                    emailId = !isAnonymous ? userData.user.login : null;
                }
            });
        });
    }

    submitQuestion = e => {
        e.preventDefault();
        this.setState({
            isDisabled: true
        });

        if (this.validateForm()) {
            const { currentProduct, isCommunityServiceEnabled, profileId } = this.state;
            const productDetails = currentProduct.productDetails;
            const productId = productDetails.productId;
            const isUS = localeUtils.isUS();
            const locale = localeUtils.isCanada() ? (localeUtils.isFrench() ? 'fr-CA' : 'en-CA') : 'en-US';
            const emailText = this.emailText ? this.emailText.getValue() : Empty.string;

            questionAnswerApi
                .submitQuestion(
                    productId,
                    encodeURIComponent(this.state.questionText.replace(/%\d\w|\+/g, ' ')),
                    this.state.deviceData,
                    emailText,
                    isCommunityServiceEnabled,
                    locale,
                    profileId
                )
                .then(() => {
                    questionsAnswersAnalytics.fireSubmitSuccessPageLoad(currentProduct, true);

                    this.setState(
                        {
                            requestSuccess: true,
                            requestFailed: false
                        },
                        () => UI.scrollTo({ ref: this.topContainerRef })
                    );
                    const questionBodyData = {
                        questionBody: this.state.questionBody,
                        questionSkuId: currentProduct.currentSku?.skuId ? currentProduct.currentSku?.skuId : null,
                        questionProductId: productDetails?.productId,
                        questionPrice: currentProduct.currentSku?.listPrice,
                        questionCurrency: isUS ? 'USD' : 'CAD',
                        questionBrandName: productDetails?.brand?.displayName,
                        questionProductName: productDetails?.displayName,
                        questionVariationType: currentProduct?.currentSku?.variationType,
                        questionVariationValue: currentProduct?.currentSku?.variationValue,
                        questionProductTopCategory: currentProduct?.parentCategory?.displayName
                    };
                    //Analytics requested XSEL-1976
                    processEvent.process(
                        anaConsts.LINK_TRACKING_EVENT,
                        {
                            data: {
                                linkName: anaConsts.EVENT_NAMES.ASK_QUESTION_BODY_DETAILS,
                                actionInfo: anaConsts.EVENT_NAMES.ASK_QUESTION_BODY_DETAILS,
                                specificEventName: anaConsts.EVENT_NAMES.ASK_QUESTION_BODY_DETAILS,
                                sponsoredProductInformation: questionBodyData
                            }
                        },
                        { specificEventName: anaConsts.EVENT_NAMES.ASK_QUESTION_BODY_DETAILS }
                    );
                })
                .catch(error => {
                    const errorMessages =
                        error && error.errorMessages && error.errorMessages.length
                            ? error.errorMessages
                            : ['Bazaarvoice returned error(s) during Question Submit'];
                    questionsAnswersAnalytics.fireSubmitLinkTrackingError(errorMessages);
                    this.setState(
                        {
                            requestFailed: true,
                            requestSuccess: false
                        },
                        () => UI.scrollTo({ ref: this.topContainerRef })
                    );
                });
        } else {
            this.setState({
                isDisabled: false
            });
        }
    };

    validateQuestionText = () => {
        const { questionText } = this.state;

        if (FormValidator.isEmpty(questionText)) {
            this.setState({ questionTextError: true });

            return getText('enterQuestion');
        } else if (questionText.length < MIN_QUESTION_CHARS) {
            this.setState({ questionTextError: true });

            return getText('errorMessageText', [MIN_QUESTION_CHARS]);
        } else {
            this.setState({ questionTextError: false, questionBody: questionText });
        }

        return null;
    };

    validateEmailText = emailText => {
        if (!this.state.emailNotification) {
            return null;
        }

        if (FormValidator.isEmpty(emailText)) {
            return getText('emptyEmailMessage');
        } else if (!FormValidator.isValidEmailAddress(emailText)) {
            return getText('invalidEmailMessage');
        }

        return null;
    };

    setEmail = checked => {
        this.setState(
            {
                emailNotification: checked,
                presetLogin: checked ? emailId : ''
            },
            () => {
                if (checked === false) {
                    this.emailText.validateError();
                }
            }
        );
    };

    setAcceptedTerms = event => {
        const acceptedTerms = event.target.checked;
        this.setState({ acceptedTerms, showTermsError: false });
    };

    handleQuestionTextChange = questionText => {
        this.setState({ questionTextError: false });

        if (questionText.length === MAX_QUESTION_CHARS) {
            this.setState({
                questionTextMessage: getText('maxCharacter')
            });
        } else {
            if (this.state.questionTextMessage) {
                this.setState({
                    questionTextMessage: null
                });
            } else {
                this.setState({
                    questionText
                });
            }
        }

        this.setQuestionTextRef(questionText);
    };

    handleEmailChange = emailAddress => {
        this.setState({ presetLogin: emailAddress });
        this.setEmailAddressRef(emailAddress);
    };

    validateForm = () => {
        const fieldsForValidation = [this.questionText, this.emailText];
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
        const id = this.state.currentProduct.productDetails.productId;
        Location.setLocation(`/product/${id}#QandA`);
    };

    getProductTargetUrl = () => {
        const { skuId } = UrlUtils.getParams();

        return `${this.state.currentProduct.targetUrl}${skuId ? '?skuId=' + skuId : ''}`;
    };

    setQuestionTextRef(comp) {
        if (comp !== null) {
            this.questionText = comp;
        }
    }

    render() {
        const { currentProduct, requestSuccess, requestFailed, showTermsError } = this.state;
        const { currentSku, productDetails = {} } = currentProduct;
        const cancelGoBackUrl = this.getProductTargetUrl();

        return (
            <>
                <Container
                    paddingTop={[4, 6]}
                    ref={this.topContainerRef}
                >
                    {currentSku && !requestSuccess && !requestFailed && (
                        <form
                            noValidate
                            onSubmit={e => this.submitQuestion(e)}
                        >
                            <Grid
                                marginBottom={[5, 6]}
                                gap={3}
                                columns='1fr auto'
                                alignItems='baseline'
                                lineHeight='tight'
                            >
                                <Text
                                    is='h1'
                                    fontSize={['md', 'lg']}
                                    fontWeight='bold'
                                    children={getText('askAQuestionTitle')}
                                />
                                <Link
                                    display={[null, 'none']}
                                    href={this.state.currentProduct.targetUrl}
                                    color='blue'
                                    padding={2}
                                    margin={-2}
                                    data-at={Sephora.debug.dataAt('cancel_link')}
                                    children={getText('cancel')}
                                />
                            </Grid>
                            <Grid
                                columns='auto 1fr'
                                gap={4}
                                lineHeight='tight'
                                alignItems='center'
                            >
                                <ProductImage
                                    id={currentSku.skuId}
                                    skuImages={currentSku.skuImages}
                                    size={100}
                                    disableLazyLoad={true}
                                />
                                <div>
                                    <h2>
                                        <Text
                                            display='block'
                                            fontWeight='bold'
                                            data-at={Sephora.debug.dataAt('brand_name')}
                                            children={productDetails.brand?.displayName}
                                        />
                                        <Text
                                            fontSize={['base', 'md']}
                                            data-at={Sephora.debug.dataAt('product_name')}
                                            children={productDetails.displayName}
                                        />
                                    </h2>
                                    <Text
                                        is='p'
                                        fontSize={['sm', 'base']}
                                        marginTop={['.5em', '1em']}
                                        css={{ ':empty': { marginTop: 0 } }}
                                    >
                                        {currentSku.refinements && currentSku.refinements.sizeRefinements && (
                                            <span>
                                                {currentSku.refinements.sizeRefinements[0]} {getText('size')}
                                            </span>
                                        )}
                                        {currentProduct.variationType !== skuUtils.skuVariationType.NONE && currentSku.variationValue && (
                                            <Text
                                                display='block'
                                                marginTop='.125em'
                                                data-at={Sephora.debug.dataAt('variation_label')}
                                            >
                                                {currentSku.variationValue}
                                                {currentSku.variationDesc && ` - ${currentSku.variationDesc}`}
                                            </Text>
                                        )}
                                    </Text>
                                </div>
                            </Grid>
                            <Divider marginY={[5, 6]} />
                            <Box maxWidth={612}>
                                <Textarea
                                    label={getText('enterYourQuestion', [MAX_QUESTION_CHARS])}
                                    labelDataAt={'question_field_ghost_text'}
                                    placeholder={getText('exampleQuestion')}
                                    rows={4}
                                    name='reviewQuestion'
                                    maxLength={MAX_QUESTION_CHARS}
                                    charCountDataAt={'char_counter_text'}
                                    handleChange={this.handleQuestionTextChange}
                                    invalid={this.state.questionTextError}
                                    errorDataAt={'error_msg_text'}
                                    warning={this.state.questionTextMessage}
                                    validate={this.validateQuestionText}
                                    ref={comp => {
                                        this.setQuestionTextRef(comp);
                                    }}
                                    data-at={Sephora.debug.dataAt('question_field')}
                                />
                                <Link
                                    padding={2}
                                    margin={-2}
                                    onClick={this.toggleGuidelines}
                                    color='blue'
                                    data-at={Sephora.debug.dataAt('guidelines_link')}
                                    children={getText('questionAnswerGuidelines')}
                                />
                                <Checkbox
                                    paddingY={null}
                                    marginBottom={3}
                                    marginTop={5}
                                    checked={!!this.state.emailNotification}
                                    data-at={Sephora.debug.dataAt('work_at_seph_checkbox')}
                                    onClick={e => this.setEmail(e.target.checked)}
                                >
                                    {getText('emailNotification')}
                                </Checkbox>
                                <InputEmail
                                    id='emailSignUpInput'
                                    placeholder={getText('emailAddress')}
                                    disabled={!this.state.emailNotification}
                                    login={this.state.presetLogin}
                                    name='email'
                                    isInputChecked={this.state.emailNotification}
                                    onChange={event =>
                                        this.setState({
                                            presetLogin: event.target.value
                                        })
                                    }
                                    ref={comp => {
                                        if (comp !== null) {
                                            this.emailText = comp;
                                        }
                                    }}
                                    marginBottom={2}
                                    validate={() => this.validateEmailText(this.state.presetLogin)}
                                />
                                <Text
                                    is='p'
                                    lineHeight='tight'
                                    fontSize='sm'
                                    color='gray'
                                    children={`${getText('notification')}`}
                                />
                            </Box>

                            <Divider
                                marginTop={[3, 4]}
                                marginBottom={[3, 5]}
                            />
                            <Grid
                                gap={2}
                                maxWidth={612}
                            >
                                <Checkbox
                                    color={showTermsError ? 'error' : null}
                                    paddingY={null}
                                    checked={!!this.state.acceptedTerms}
                                    onClick={this.setAcceptedTerms}
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
                                {showTermsError && (
                                    <Text
                                        is='p'
                                        color='error'
                                        paddingLeft={6}
                                        fontSize='sm'
                                        lineHeight='tight'
                                    >
                                        {getText('termsError')}
                                    </Text>
                                )}
                                <Text
                                    is='p'
                                    fontSize='sm'
                                    paddingLeft={6}
                                    marginBottom={1}
                                    lineHeight='tight'
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
                                    children={`${getText('note')}`}
                                />
                                <Grid
                                    gap={4}
                                    alignItems='center'
                                    columns={[null, 'auto 1fr']}
                                >
                                    <Button
                                        type='submit'
                                        disabled={this.state.isDisabled}
                                        width={['100%', 'auto']}
                                        minWidth={[null, '14.5em']}
                                        variant='primary'
                                        children={getText('submit')}
                                        data-at={Sephora.debug.dataAt('submit_question_button')}
                                    />
                                    <Link
                                        display={['none', 'block']}
                                        href={cancelGoBackUrl}
                                        color='blue'
                                        padding={2}
                                        margin={-2}
                                        marginRight='auto'
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
                            isQuestion={true}
                            isError={requestFailed}
                            currentSku={currentSku}
                            redirectTo={this.redirectToPpage}
                            currentProduct={currentProduct}
                        />
                    )}
                </Container>
                {this.state.showGuidelines && <ModalGuidelines onDismiss={this.toggleGuidelines} />}
            </>
        );
    }
}

export default wrapComponent(SubmitQuestionBody, 'SubmitQuestionBody', true);
