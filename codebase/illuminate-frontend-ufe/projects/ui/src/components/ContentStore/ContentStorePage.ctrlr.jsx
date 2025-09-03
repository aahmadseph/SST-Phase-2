import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RwdContentStoreBindings from 'analytics/bindingMethods/pages/contentStore/rwdContentStoreBindings';
import { Container } from 'components/ui';
import BccRwdComponentList from 'components/Bcc/BccRwdComponentList/BccRwdComponentList';

class ContentStorePage extends BaseClass {
    componentDidMount() {
        RwdContentStoreBindings.setPageLoadAnalytics(this.props.contentStoreData || {});
    }

    render() {
        const regions = this.props.contentStoreData?.regions;
        const zoneOne = regions?.zoneOne;

        return (
            <Container>
                {zoneOne && (
                    <BccRwdComponentList
                        enablePageRenderTracking={true}
                        context='container'
                        items={zoneOne}
                    />
                )}
            </Container>
        );
    }
}

export default wrapComponent(ContentStorePage, 'ContentStorePage', true);
