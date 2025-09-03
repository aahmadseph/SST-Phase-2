import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Flex, Button } from 'components/ui';

import { colors, shadows } from 'style/config';

function StepsCTA({
    ctaText, onClick, type, smuiBottom, additionalCTA
}) {
    return (
        <Flex
            marginTop={[null, null, 6]}
            paddingX={[4, null, 0]}
            paddingY={[2, null, 0]}
            position={['fixed', null, 'relative']}
            right={0}
            bottom={[smuiBottom != null ? smuiBottom : 'calc(var(--bottomNavHeight) - 1px)', null, 0]}
            left={0}
            backgroundColor={[colors.white, null, 'inherit']}
            zIndex={['var(--layer-flyout)', null, 'auto']}
            borderBottom={[`1px solid ${colors.lightGray}`, null, 'none']}
            boxShadow={[shadows.light, null, 'none']}
            flexDirection={['column', null, 'row']}
            alignItems={[null, null, 'center']}
            gap={[2, null, 5]}
        >
            <Button
                variant={type}
                width={['100%', null, 320]}
                children={ctaText}
                onClick={onClick}
            />
            {additionalCTA}
        </Flex>
    );
}

StepsCTA.defaultProps = {
    type: 'primary',
    smuiBottom: null,
    onClick: () => {}
};

export default wrapFunctionalComponent(StepsCTA, 'StepsCTA', true);
