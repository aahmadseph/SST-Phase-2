import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Markdown from 'components/Markdown/Markdown';
import BccBase from 'components/Bcc/BccBase/BccBase';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import tokensManager from 'utils/tokens/manager';

class BccMarkdown extends BaseClass {
    state = { content: '' };

    componentDidMount() {
        tokensManager.evaluator(this.props.text).then(content => {
            this.setState({ content });
        });
    }

    render() {
        const {
            name,
            backGroundColor,
            text,
            enableTesting,
            contentType,
            componentName,
            isTrackByName,
            componentType,
            targetWindow,
            isBccStyleWrapperApplied,
            modalComponentTemplate,
            enablePageRenderTracking = null,
            ...props
        } = this.props;

        return (
            <BccBase {...this.props}>
                <Markdown
                    {...props}
                    targetWindow={targetWindow}
                    modalComponentTemplate={modalComponentTemplate}
                    content={this.state.content}
                    callback={this.props.callback}
                />
                {enablePageRenderTracking && <PageRenderReport />}
            </BccBase>
        );
    }
}

export default wrapComponent(BccMarkdown, 'BccMarkdown', true);
