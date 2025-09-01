/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import AddReviewCarousel from 'components/AddReview/AddReviewCarousel/AddReviewCarousel';
import ufeApi from 'services/api/ufeApi';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

class AddReviewPage extends BaseClass {
    render() {
        return (
            <div>
                <AddReviewCarousel requestCounter={ufeApi.getCallsCounter()} />
                <PageRenderReport />
            </div>
        );
    }
}

export default withAfterEventsRendering(wrapComponent(AddReviewPage, 'AddReviewPage'), ['UserInfoReady']);
