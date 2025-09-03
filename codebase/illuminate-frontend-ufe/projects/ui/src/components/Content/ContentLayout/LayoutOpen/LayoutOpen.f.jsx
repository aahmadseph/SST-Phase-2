import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Container } from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import Breadcrumb from 'components/Content/Breadcrumb';

import Location from 'utils/Location';

const { CONTEXTS, COMPONENT_TYPES } = contentConstants;

const LayoutOpen = ({
    content, breadcrumbs, localization, trackSoftLink = '', customStyles = {}, enablePageRenderTracking = false
}) => {
    const items = content.content;
    const firstComp = items?.[0];

    // custom top margin for banner list
    if (firstComp && !firstComp.marginTop && firstComp.type === COMPONENT_TYPES.BANNER_LIST) {
        firstComp.marginTop = 2;
    }

    const page = Location.isOffersPage() ? 'offers' : 'content';

    return (
        <Container>
            {breadcrumbs && (
                <Breadcrumb
                    breadcrumbs={breadcrumbs}
                    localization={localization?.breadcrumb}
                    customStyles={customStyles}
                />
            )}
            <ComponentList
                items={items}
                context={CONTEXTS.CONTAINER}
                removeFirstItemMargin={Location.isSeasonalPage()}
                removeLastItemMargin={true}
                trackSoftLink={trackSoftLink}
                customStyles={customStyles}
                enablePageRenderTracking={enablePageRenderTracking}
                page={page}
            />
        </Container>
    );
};

LayoutOpen.propTypes = {
    content: PropTypes.object.isRequired,
    seo: PropTypes.object
};

LayoutOpen.defaultProps = {
    seo: null
};

export default wrapFunctionalComponent(LayoutOpen, 'LayoutOpen');
