import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Markdown from 'components/Markdown/Markdown';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';

function BccRwdCopy({ text, content, enablePageRenderTracking = false }) {
    return (
        <>
            <Markdown content={text ? text : content} />
            {enablePageRenderTracking && <PageRenderReport />}
        </>
    );
}

export default wrapFunctionalComponent(BccRwdCopy, 'BccRwdCopy');
