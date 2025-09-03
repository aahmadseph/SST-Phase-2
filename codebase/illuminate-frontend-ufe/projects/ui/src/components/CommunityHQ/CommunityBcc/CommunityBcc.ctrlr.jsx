import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import cmsApi from 'services/api/cms';

const BCC_MEDIA_ID = '43900060';

class CommunityBcc extends BaseClass {
    state = { contentData: null };

    componentDidMount() {
        cmsApi.getMediaContent(BCC_MEDIA_ID).then(data => {
            this.setState({ contentData: data.regions.content });
        });
        //Analytics
        digitalData.page.category.pageType = 'cmnty';
        digitalData.page.pageInfo.pageName = 'home';
    }

    render() {
        return (
            <div>
                <BccComponentList items={this.state.contentData} />
            </div>
        );
    }
}

export default wrapComponent(CommunityBcc, 'CommunityBcc', true);
