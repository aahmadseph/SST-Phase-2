import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import decorators from 'utils/decorators';
import userUtils from 'utils/User';
import store from 'store/Store';
import anaConstants from 'analytics/constants';
import AllBankActivity from 'components/RichProfile/BeautyInsider/PointsNSpendBank/AllBankActivity/AllBankActivity';

const ensureUserIsAtLeastRecognized = decorators.ensureUserIsAtLeastRecognized;

class MyPoints extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isUserBi: false,
            user: null,
            isAnonymous: true
        };
    }

    componentDidMount() {
        store.setAndWatch('user', this, data => {
            this.setState({
                isUserBi: userUtils.isBI(),
                isAnonymous: userUtils.isAnonymous(),
                user: data.user
            });
        });

        //Analytics
        digitalData.page.pageInfo.pageName = 'my beauty insider:activity';
        digitalData.page.category.pageType = anaConstants.PAGE_TYPES.USER_PROFILE;
    }

    render() {
        return (
            <div>
                {this.state.user && this.state.isUserBi && (
                    <main>
                        <AllBankActivity user={this.state.user} />
                    </main>
                )}
            </div>
        );
    }
}

export default wrapComponent(ensureUserIsAtLeastRecognized(MyPoints), 'MyPoints');
