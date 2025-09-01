import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Container } from 'components/ui';
import BeautyInsider from 'components/Content/BeautyInsider';

const LayoutBeautyInsider = ({ content }) => {
    return (
        <Container>
            <BeautyInsider content={content} />
        </Container>
    );
};

export default wrapFunctionalComponent(LayoutBeautyInsider, 'LayoutBeautyInsider');
