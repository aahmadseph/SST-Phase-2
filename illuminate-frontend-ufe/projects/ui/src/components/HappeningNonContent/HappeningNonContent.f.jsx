import React from 'react';
import framework from 'utils/framework';
import { Container } from 'components/ui';
import anaConsts from 'analytics/constants';
import BackToTopButton from 'components/BackToTopButton';

const { wrapFunctionalComponent } = framework;

const HappeningNonContent = ({ component }) => {
    if (component) {
        return (
            <>
                <BackToTopButton analyticsLinkName={anaConsts.LinkData.BACK_TO_TOP} />
                <Container
                    is='main'
                    paddingTop={5}
                    paddingBottom={[5, null, 0]}
                    paddingX={[3, null, null]}
                >
                    {component}
                </Container>
            </>
        );
    }

    return null;
};

export default wrapFunctionalComponent(HappeningNonContent, 'HappeningNonContent');
