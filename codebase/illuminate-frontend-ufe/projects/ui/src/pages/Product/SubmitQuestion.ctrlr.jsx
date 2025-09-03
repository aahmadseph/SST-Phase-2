/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import SubmitQuestionBody from 'components/ProductPage/QuestionsAndAnswers/SubmitQuestion/SubmitQuestionBody';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

class SubmitQuestion extends BaseClass {
    render() {
        return (
            <div>
                <SubmitQuestionBody />
            </div>
        );
    }
}

export default withAfterEventsRendering(wrapComponent(SubmitQuestion, 'SubmitQuestion'), ['UserInfoReady']);
