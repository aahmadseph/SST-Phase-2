/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import UnsubscribeQuestionBody from 'components/ProductPage/QuestionsAndAnswers/UnsubscribeQuestion/UnsubscribeQuestionBody';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

class UnsubscribeQuestion extends BaseClass {
    render() {
        return (
            <div>
                <UnsubscribeQuestionBody />
            </div>
        );
    }
}

export default withAfterEventsRendering(wrapComponent(UnsubscribeQuestion, 'UnsubscribeQuestion'), ['UserInfoReady']);
