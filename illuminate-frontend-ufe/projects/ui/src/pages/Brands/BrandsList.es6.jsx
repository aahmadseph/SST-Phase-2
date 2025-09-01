import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import ConnectedBrandsList from 'components/Brand/BrandsList';

class BrandsList extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedBrandsList groupedBrands={this.props.groupedBrands} />
            </div>
        );
    }
}

export default wrapComponent(BrandsList, 'BrandsList');
