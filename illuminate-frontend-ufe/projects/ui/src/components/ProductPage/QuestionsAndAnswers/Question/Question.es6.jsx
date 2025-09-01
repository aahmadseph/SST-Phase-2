/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import anaUtils from 'analytics/utils';
import {
    Box, Grid, Text, Link
} from 'components/ui';
import Answer from 'components/ProductPage/QuestionsAndAnswers/Answer/Answer';
import dateUtils from 'utils/Date';
import UrlUtils from 'utils/Url';
import languageLocale from 'utils/LanguageLocale';

const getText = languageLocale.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

let scrollPos;

class Question extends BaseClass {
    state = { showMoreAnswers: false };

    processPostedDate = postedDate => dateUtils.formatSocialDate(postedDate, true);

    getPostedBy = userNickname => (userNickname ? getText('postedBy', [userNickname]) : '');

    getAnswersToShow = () => {
        const answersArray = this.props.answers;
        let answersToShow = answersArray.slice(0, 1);

        if (this.state.showMoreAnswers) {
            answersToShow = answersArray;
        }

        return answersToShow;
    };

    redirectToSubmitAnswerPage = () => {
        const { productId, questionId, skuId } = this.props;

        anaUtils.setNextPageData({ linkData: 'answer this question' });

        const PRODUCT_SUBMIT_ANSWER_URL = `/submitAnswer?productId=${productId}&questionId=${questionId}&skuId=${skuId}`;

        return UrlUtils.redirectTo(PRODUCT_SUBMIT_ANSWER_URL);
    };

    render() {
        const {
            productId, userNickname, questionDetails, submissionTime, answers = []
        } = this.props;

        const { showMoreAnswers } = this.state;

        const answersToShow = this.getAnswersToShow();

        const answerLink = (
            <Box marginTop={4}>
                <Link
                    padding={2}
                    margin={-2}
                    color='blue'
                    onClick={() => this.redirectToSubmitAnswerPage()}
                    data-at={Sephora.debug.dataAt('answer_link')}
                    children={getText('answerThisQuestion')}
                />
            </Box>
        );

        const moreAnswersLink = answers.length > 1 && (
            <Link
                padding={2}
                margin={-2}
                arrowDirection={!showMoreAnswers ? 'down' : 'up'}
                onClick={() => {
                    if (!showMoreAnswers) {
                        scrollPos = window.scrollY;
                    }

                    this.setState(
                        {
                            showMoreAnswers: !showMoreAnswers
                        },
                        () => {
                            if (showMoreAnswers) {
                                window.scroll(0, scrollPos);
                            }
                        }
                    );
                }}
                children={!showMoreAnswers ? getText('moreAnswers', [answers.length - 1]) : getText('showLess')}
            />
        );

        return (
            <div>
                <Grid
                    columns='1.5em 1fr'
                    gap={null}
                    data-at={Sephora.debug.dataAt('questions_section')}
                >
                    <Text
                        aria-label={getText('question')}
                        fontWeight='medium'
                        children='Q:'
                    />
                    <div>
                        <Text
                            is='h4'
                            fontWeight='medium'
                            lineHeight='relaxed'
                            children={questionDetails}
                        />
                        <Text
                            is='p'
                            fontSize={['sm', 'base']}
                            color='gray'
                            data-at={Sephora.debug.dataAt('QuestionAskedTime')}
                            children={`${getText('asked')} ${this.processPostedDate(submissionTime)} ${this.getPostedBy(userNickname)}`}
                        />
                        {answers.length === 0 && answerLink}
                    </div>
                </Grid>
                {answers.length > 0 &&
                    answersToShow.map((item, index) => (
                        <Answer
                            key={item.answerId}
                            productId={productId}
                            {...item}
                            {...(index === answersToShow.length - 1 && {
                                answerLink,
                                moreAnswersLink
                            })}
                        />
                    ))}
            </div>
        );
    }
}

export default wrapComponent(Question, 'Question');
