import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Box } from 'components/ui';
import userUtils from 'utils/User';

class BiBackground extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const { hasGraphic = true, children, ...props } = this.props;

        const isMobile = Sephora.isMobile();
        const biStatus = userUtils.getBiStatus();
        const statusDisplay = userUtils.displayBiStatus(biStatus);

        const dotSize = isMobile ? 94 : 180;
        let dotWidth = dotSize;
        let dotHeight = dotSize;

        if (userUtils.isRouge()) {
            dotWidth = isMobile ? 564 : 1080;
            dotHeight = isMobile ? 282 : 540;
        }

        return (
            <Box
                padding={isMobile ? 4 : 5}
                baseCss={
                    hasGraphic && {
                        backgroundImage: `url(/img/ufe/bi/bg-${statusDisplay.toLowerCase()}.svg)`,
                        backgroundSize: `${dotWidth}px ${dotHeight}px`,
                        backgroundPosition: 'center'
                    }
                }
                {...props}
            >
                <Box
                    position='relative'
                    marginX='auto'
                    paddingTop={isMobile ? 3 : 5}
                    paddingBottom={isMobile ? 3 : 6}
                    paddingX={isMobile ? 4 : 7}
                    backgroundColor='white'
                    maxWidth={813}
                    lineHeight='tight'
                    borderRadius={2}
                    data-at={Sephora.debug.dataAt('bi_section')}
                    boxShadow='light'
                >
                    {children}
                </Box>
            </Box>
        );
    }
}

export default wrapComponent(BiBackground, 'BiBackground');
