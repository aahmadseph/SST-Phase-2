/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import NthBrandsPage from 'components/Brand/NthBrandsPage';

class BrandNthCategory extends BaseClass {
    render() {
        return (
            <div>
                <NthBrandsPage />
            </div>
        );
    }
}

export default wrapComponent(BrandNthCategory, 'BrandNthCategory');
