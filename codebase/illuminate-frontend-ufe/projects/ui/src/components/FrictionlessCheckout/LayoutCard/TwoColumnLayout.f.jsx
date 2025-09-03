import { Flex, Box, Divider } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, mediaQueries } from 'style/config';
import React from 'react';
import MediaUtils from 'utils/Media';
const { Media } = MediaUtils;

const FlexContainer = ({ children }) => (
    <>
        <Media lessThan='sm'>
            <Flex flexDirection='column'> {children} </Flex>
        </Media>
        <Media greaterThan='xs'>
            <Flex flexDirection='row'> {children} </Flex>
        </Media>
    </>
);

function TwoColumnLayout({ LeftComponent, RightComponent }) {
    return (
        <FlexContainer>
            <Box
                flex={1}
                paddingRight={[0, 16]}
            >
                {LeftComponent}
            </Box>
            {RightComponent && (
                <>
                    <Media lessThan='sm'>
                        <Divider marginBottom={4} />
                    </Media>
                    <Box
                        css={style.boxWithBorderLeft}
                        flex={1}
                        paddingLeft={[0, 16]}
                    >
                        {RightComponent}
                    </Box>
                </>
            )}
        </FlexContainer>
    );
}

const style = {
    boxWithBorderLeft: {
        [mediaQueries.sm]: {
            borderLeft: `1px solid ${colors.lightGray}`
        }
    }
};

TwoColumnLayout.defaultProps = {
    LeftComponent: null,
    RightComponent: null
};

export default wrapFunctionalComponent(TwoColumnLayout, 'CardBody');
