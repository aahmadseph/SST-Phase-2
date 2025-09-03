/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import SubmitAnswerBody from 'components/ProductPage/QuestionsAndAnswers/SubmitAnswer/SubmitAnswerBody';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

class SubmitAnswer extends BaseClass {
    render() {
        return (
            <div>
                <SubmitAnswerBody />
            </div>
        );
    }
}

export default withAfterEventsRendering(wrapComponent(SubmitAnswer, 'SubmitAnswer'), ['UserInfoReady']);
