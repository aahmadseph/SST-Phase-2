import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import CategoryTree from 'components/CategoryTree/CategoryTree';

const Departments = props => {
    return (
        <div>
            <CategoryTree categoryTreeData={props.allCategoriesList} />
        </div>
    );
};

export default wrapFunctionalComponent(Departments, 'Departments');
