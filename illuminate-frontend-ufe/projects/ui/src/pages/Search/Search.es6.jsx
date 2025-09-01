/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import ConnectedSearch from 'components/Search';

class Search extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedSearch />
            </div>
        );
    }
}

export default wrapComponent(Search, 'Search');
