import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';
import Chiclet from 'components/Chiclet';

function UpperFunnelChiclet(props) {
    const { refinement, children, ...restProps } = props;
    const { labelClick, chicletDisplayName, refinementValueDisplayName, refinementValueSpecificDisplayName } = refinement;

    const label = (
        <>
            {chicletDisplayName || refinementValueDisplayName}: <b>{refinementValueSpecificDisplayName}</b>
        </>
    );

    return (
        <Chiclet
            {...restProps}
            maxWidth={null}
            clickOnX
        >
            <Link
                padding={2}
                margin={-2}
                arrowDirection='down'
                onClick={labelClick}
                disableUnderline
                css={styles.link}
            >
                {label}
            </Link>
        </Chiclet>
    );
}

const styles = {
    link: {
        cursor: 'pointer'
    }
};

export default wrapFunctionalComponent(UpperFunnelChiclet, 'UpperFunnelChiclet');
