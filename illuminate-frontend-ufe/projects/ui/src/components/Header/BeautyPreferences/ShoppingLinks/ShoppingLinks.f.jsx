import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Link, Text } from 'components/ui';
import { CONTAINER_SIZE } from 'constants/beautyPreferences';

const renderLink = ({ href, text, handleClick }) => {
    return (
        <Link
            color='blue'
            lineHeight='tight'
            href={href}
            onClick={handleClick}
            children={text}
        />
    );
};

function ShoppingLinks({
    isExpanded, isEnabled, isMultiLink, multiLinkData, linkData
}) {
    return !isExpanded && isEnabled ? (
        <Flex
            display='flex'
            alignItem='center'
            marginX={[null, null, 'auto']}
            marginBottom={4}
            maxWidth={[null, null, CONTAINER_SIZE]}
        >
            {isMultiLink && multiLinkData && (
                <Flex
                    display='flex'
                    alignItem='center'
                    flexDirection={['column', 'column', 'row']}
                    gap={[1, 1, 3]}
                    lineHeight='tight'
                >
                    <Text
                        is='p'
                        color='gray'
                        children={multiLinkData.linksDesc}
                    />
                    <Flex
                        display='flex'
                        gap={3}
                    >
                        {multiLinkData.links &&
                            multiLinkData.links.map((link, i, a) => {
                                const isRenderPipe = i > 0 && i < a.length;

                                return (
                                    <React.Fragment key={link.text}>
                                        {isRenderPipe && <Text color='gray'>|</Text>}
                                        {renderLink(link)}
                                    </React.Fragment>
                                );
                            })}
                    </Flex>
                </Flex>
            )}
            {!isMultiLink && linkData && renderLink(linkData)}
        </Flex>
    ) : null;
}

ShoppingLinks.defaultProps = {
    isExpanded: true,
    isMultiLink: false
};

ShoppingLinks.propTypes = {
    isExpanded: PropTypes.bool,
    isEnabled: PropTypes.bool.isRequired,
    isMultiLink: PropTypes.bool,
    multiLinkData: PropTypes.object,
    linkData: PropTypes.object
};

export default wrapFunctionalComponent(ShoppingLinks, 'ShoppingLinks');
