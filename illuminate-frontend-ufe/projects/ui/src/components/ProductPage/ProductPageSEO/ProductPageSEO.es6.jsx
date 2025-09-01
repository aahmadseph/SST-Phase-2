import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

class ProductPageSEO extends BaseClass {
    shouldComponentUpdate = nextProps => {
        const {
            product: { schemas }
        } = this.props;

        return nextProps.product.schemas !== schemas;
    };

    render() {
        const {
            product: { schemas }
        } = this.props;

        return (
            <Fragment>
                {schemas?.length &&
                    schemas.map(schema => (
                        <script
                            key={schema['@type']}
                            type='application/ld+json'
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        ></script>
                    ))}
            </Fragment>
        );
    }
}

ProductPageSEO.propTypes = {
    product: PropTypes.shape({
        schemas: PropTypes.array.isRequired
    }).isRequired
};

export default wrapComponent(ProductPageSEO, 'ProductPageSEO');
