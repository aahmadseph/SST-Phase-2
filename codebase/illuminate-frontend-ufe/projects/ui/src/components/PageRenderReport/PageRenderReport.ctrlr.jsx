/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

class PageRenderReport extends BaseClass {
    componentDidMount() {
        Sephora.Util.Perf.report('Page Rendered');
    }

    shouldComponentUpdate = () => {
        return false;
    };

    render() {
        if (Sephora.isNodeRender) {
            return <script dangerouslySetInnerHTML={{ __html: 'Sephora.Util.Perf.report("Page Rendered");' }}></script>;
        } else {
            return null;
        }
    }
}

export default wrapComponent(PageRenderReport, 'PageRenderReport', true);
