/* eslint-disable class-methods-use-this */

import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import NthCategoryPage from 'components/Category/NthCategoryPage';

class NthCategory extends BaseClass {
    render() {
        return (
            <div>
                <NthCategoryPage />
            </div>
        );
    }
}

export default wrapComponent(NthCategory, 'NthCategory');
