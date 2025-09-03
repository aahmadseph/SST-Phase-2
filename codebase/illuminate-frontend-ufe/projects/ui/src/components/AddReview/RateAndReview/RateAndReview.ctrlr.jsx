/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Container, Grid, Box, Text, Button, Divider, Link
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import UploadMedia from 'components/AddReview/UploadMedia/UploadMedia';
import DisplayName from 'components/ProductPage/DisplayName/DisplayName';
import AddReviewTitle from 'components/AddReview/AddReviewTitle/AddReviewTitle';
import AddReviewNote from 'components/AddReview/AddReviewNote/AddReviewNote';
import StarRating from 'components/StarRating/StarRating';
import Textarea from 'components/Inputs/Textarea/Textarea';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import ErrorList from 'components/ErrorList';
import GuidelinesModalLink from 'components/ProductPage/RatingsAndReviews/GuidelinesModalLink';

import BccUtils from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import skuUtils from 'utils/Sku';
import FormValidator from 'utils/FormValidator';
import store from 'Store';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import sanitizeWriteReviewCharacterCount from 'utils/RateAndReview';
const { SKU_ID_PARAM } = skuUtils;

const MIN_REVIEW_CHARS = 50;
const MAX_REVIEW_CHARS = 2000;

const { IMAGE_SIZES } = BccUtils;

class RateAndReview extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isRecommended: null,
            isFreeSample: false,
            isSephoraEmployee: false,
            hasAgreedToTerms: false,
            photos: null,
            showTermsError: null
        };
    }

    MIN_REVIEW_CHARS = MIN_REVIEW_CHARS;
    MAX_REVIEW_CHARS = MAX_REVIEW_CHARS;

    componentDidMount() {
        const searchString = window.location.search;
        const encodedParam = encodeURIComponent('skuId');

        if (searchString.indexOf(`${encodedParam}=`) === -1) {
            const queryParams = Object.assign({}, store.getState().historyLocation.queryParams);
            queryParams[SKU_ID_PARAM] = this.props.product?.currentSku?.skuId;
            store.dispatch(historyLocationActions.goTo({ queryParams }));
        }
    }

    componentWillReceiveProps(updatedProps) {
        this.setState(updatedProps);
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/AddReview/RateAndReview/locales', 'RateAndReview');
        const { product } = this.props;

        const { currentSku, productDetails } = product;

        const { brand, displayName } = productDetails;

        const {
            isRecommended, isFreeSample, isSephoraEmployee, hasAgreedToTerms, showTermsError
        } = this.state;

        const skuImage = (
            <ProductImage
                id={currentSku.skuId}
                skuImages={currentSku.skuImages}
                size={[IMAGE_SIZES[62], IMAGE_SIZES[300]]}
                disableLazyLoad={true}
                altText={supplementAltTextWithProduct(currentSku, product)}
            />
        );

        const skuInfo = (
            <>
                <DisplayName
                    is='h2'
                    marginBottom={[2, 5]}
                    product={{
                        brand: brand,
                        displayName: displayName
                    }}
                />
                <ProductVariation
                    fontSize={['sm', 'base']}
                    {...skuUtils.getProductVariations({
                        product,
                        sku: currentSku
                    })}
                />
            </>
        );

        return (
            <Container hasLegacyWidth={true}>
                <AddReviewTitle children={getText('rateAndReview')} />
                <ErrorList errorMessages={this.state.errorMessages} />
                <Grid
                    columns={[null, 'auto 1fr']}
                    gap={[3, 5, 7]}
                >
                    <Grid
                        columns={['auto 1fr', 1]}
                        gap={2}
                    >
                        {skuImage}
                        <Box display={[null, 'none']}>{skuInfo}</Box>
                    </Grid>
                    <div>
                        <Box display={['none', 'block']}>{skuInfo}</Box>
                        <Divider marginY={5} />
                        <Text
                            aria-hidden
                            is='h2'
                            fontWeight='bold'
                            marginBottom={4}
                            children={getText('rateHeading')}
                        />
                        <StarRating
                            size={32}
                            rating={0}
                            isEditable={true}
                            legend={getText('rateHeading')}
                            starClick={() => this.state.starRatingError && this.validateStarRating()}
                            validate={() => this.validateStarRating()}
                            ref={rating => (this.starRating = rating)}
                        />
                        {this.state.starRatingError && (
                            <InputMsg
                                role='alert'
                                color='error'
                                children={getText('errorMessageRating')}
                            />
                        )}
                        <Box marginTop={4} />

                        <Text
                            is='h2'
                            fontWeight='bold'
                            marginY={4}
                        >
                            {getText('review')}
                        </Text>

                        <Textarea
                            label={getText('writeReview')}
                            placeholder={getText('writeReviewExample')}
                            rows={3}
                            name='reviewBody'
                            minLength={this.MIN_REVIEW_CHARS}
                            maxLength={this.MAX_REVIEW_CHARS}
                            errorMessage={this.state.reviewTextError ? getText('errorMessageText', [this.MIN_REVIEW_CHARS]) : null}
                            handleChange={() => this.state.reviewTextError && this.reviewText.validateError()}
                            invalid={this.state.reviewTextError}
                            validate={() => (this.validateReviewText() ? null : getText('errorMessageText', [this.MIN_REVIEW_CHARS]))}
                            ref={comp => (this.reviewText = comp)}
                            sanitizeCharacterCount={sanitizeWriteReviewCharacterCount}
                        />

                        <Text
                            is='h2'
                            fontWeight='bold'
                            marginBottom={4}
                        >
                            {getText('headline')}{' '}
                            <Text
                                fontWeight='normal'
                                color='gray'
                            >
                                {getText('optional')}
                            </Text>
                        </Text>
                        <TextInput
                            marginBottom={null}
                            placeholder={getText('headlineExample')}
                            name='title'
                            label={getText('addAHeadline')}
                            maxLength={50}
                            ref={comp => (this.titleInput = comp)}
                        />
                        <InputMsg
                            textAlign='right'
                            children={getText('maxChar', ['50'])}
                        />
                        <Text
                            is='p'
                            fontSize='sm'
                            marginTop={4}
                        >
                            {getText('seeFull')} <GuidelinesModalLink />
                        </Text>
                        <Divider marginY={5} />
                        <Text
                            is='h2'
                            fontWeight='bold'
                            marginBottom={4}
                        >
                            {getText('addPhoto')}{' '}
                            <Text
                                fontWeight='normal'
                                color='gray'
                            >
                                ({getText('upToTwoImages')})
                            </Text>
                        </Text>
                        <UploadMedia onChange={this.updatePhotos} />
                        <Divider marginY={5} />
                        <Text
                            is='h2'
                            fontWeight='bold'
                            marginBottom={4}
                        >
                            {getText('wouldYouRecommendThisProduct')}
                        </Text>
                        <Grid
                            columns={2}
                            gap={4}
                            maxWidth={[null, 422]}
                        >
                            <Button
                                block={true}
                                variant='secondary'
                                onClick={this.handleRecommendClick(true)}
                                className={isRecommended === false ? 'is-disabled' : null}
                            >
                                {getText('yes')}
                            </Button>
                            <Button
                                block={true}
                                variant='secondary'
                                onClick={this.handleRecommendClick(false)}
                                className={isRecommended === true ? 'is-disabled' : null}
                            >
                                {getText('no')}
                            </Button>
                        </Grid>
                        {this.state.recommendedError && (
                            <InputMsg
                                role='alert'
                                color='error'
                                children={getText('errorMessageTextRecommend')}
                            />
                        )}
                        <Divider marginY={5} />
                        <Checkbox
                            checked={isFreeSample}
                            onClick={this.handleIsFreeSampleClick}
                        >
                            {getText('productAsAfreeSample')}
                        </Checkbox>
                        <Checkbox
                            checked={isSephoraEmployee}
                            onClick={this.handleIsSephoraEmployeeClick}
                        >
                            {getText('sephoraEmployee')}
                        </Checkbox>
                        <Divider marginY={4} />
                        <Checkbox
                            checked={hasAgreedToTerms}
                            color={showTermsError ? 'error' : null}
                            onClick={this.onTermsToggle}
                        >
                            {getText('yesAgree')}{' '}
                            <Link
                                color='blue'
                                href='https://www.sephora.com/beauty/terms-of-use'
                                target='_blank'
                            >
                                {getText('termsAndConditions')}
                            </Link>
                        </Checkbox>
                        {showTermsError && (
                            <InputMsg
                                role='alert'
                                color='error'
                                children={getText('termsError')}
                            />
                        )}
                        <AddReviewNote />
                        <Button
                            variant='primary'
                            onClick={this.onNext}
                            width={['100%', '14.5em']}
                        >
                            {getText('next')}
                        </Button>
                    </div>
                </Grid>
            </Container>
        );
    }

    updatePhotos = photos => {
        this.setState({ photos });
    };

    validateForm = () => {
        const fieldsForValidation = [this.starRating, this.reviewText];
        const errors = FormValidator.getErrors(fieldsForValidation);
        let formIsValid = true;
        const newState = { showTermsError: !this.state.hasAgreedToTerms, recommendedError: typeof this.state.isRecommended !== 'boolean' };

        if (newState.showTermsError || newState.recommendedError) {
            //set state to display recommend button error message

            formIsValid = false;
            this.setState(newState);
        } else if (errors.fields.length) {
            formIsValid = false;
        }

        return formIsValid;
    };

    validateStarRating = () => {
        const noStarRating = this.starRating.getRating() === 0;

        this.setState({ starRatingError: noStarRating });

        return noStarRating;
    };

    validateReviewText = () => {
        const characterCount = this.reviewText.getCharacterCount();

        const isReviewTextValidLength = FormValidator.isValidLengthRateAndReview(characterCount, this.MIN_REVIEW_CHARS, this.MAX_REVIEW_CHARS);

        //set state to update review textarea invalid property
        //only set state when state and validity status differ to avoid rerenders
        if (!isReviewTextValidLength !== this.state.reviewTextError) {
            this.setState({ reviewTextError: !isReviewTextValidLength });
        }

        return isReviewTextValidLength;
    };

    handleRecommendClick = isRecommended => () => {
        this.setState({
            isRecommended,
            recommendedError: null
        });
    };

    onNext = () => {
        if (this.validateForm()) {
            this.props.onNext({
                reviewTitle: this.titleInput.getValue(),
                reviewText: this.reviewText.getValue(),
                rating: this.starRating.getRating(),
                photos: this.state.photos,
                isRecommended: this.state.isRecommended,
                isFreeSample: this.state.isFreeSample,
                isSephoraEmployee: this.state.isSephoraEmployee
            });
        }
    };

    onTermsToggle = e => {
        this.setState({ hasAgreedToTerms: e.target.checked, showTermsError: false });
    };

    handleIsFreeSampleClick = e => {
        this.setState({ isFreeSample: e.target.checked });
    };

    handleIsSephoraEmployeeClick = e => {
        this.setState({ isSephoraEmployee: e.target.checked });
    };
}

export default wrapComponent(RateAndReview, 'RateAndReview', true);
