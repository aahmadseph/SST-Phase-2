/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import EnhancedContentPage from 'components/EnhancedContent';
import { withEnhancedContentPageProps } from 'viewModel/enhancedContentPage/withEnhancedContentPageProps';
const ConnectedEnhancedContentPage = withEnhancedContentPageProps(EnhancedContentPage);

class EnhancedContent extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedEnhancedContentPage />
            </div>
        );
    }
}

export default wrapComponent(EnhancedContent, 'EnhancedContent');
