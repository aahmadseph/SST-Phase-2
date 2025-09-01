import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';

const BiSummaryRedirectEnhancer = ({ children }) => {
    const urlPath = '/profile/BeautyInsider';

    return (
        <Link
            underline={true}
            color='blue'
            href={urlPath}
            children={children}
        />
    );
};

BiSummaryRedirectEnhancer.defaultProps = { children: null };

BiSummaryRedirectEnhancer.propTypes = {
    children: PropTypes.element
};

export default wrapFunctionalComponent(BiSummaryRedirectEnhancer, 'BiSummaryRedirectEnhancer');
