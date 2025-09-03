import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { colors, space } from 'style/config';
import { Box, Text, Link } from 'components/ui';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import bccUtils from 'utils/BCC';

import navClickBindings from 'analytics/bindingMethods/pages/all/navClickBindings';

const { trackNavClick } = navClickBindings;
const { COMPONENT_NAMES } = bccUtils;

class ContentStoreLeftNav extends BaseClass {
    trackNavClick = name => () => {
        trackNavClick(['left nav', this.props.ancestorHierarchy[0].displayName, name]);
    };

    processHierarchy = (comps, isAncestorHierarchy) => {
        const elements =
            comps &&
            comps.map((comp, index) => {
                const name = isAncestorHierarchy ? comp.displayName : comp.displayTitle;
                const isActive = this.props.targetUrl === (comp.targetScreen && comp.targetScreen.targetUrl);

                if (comp.ancestorHierarchy) {
                    const nextComp = comps[index + 1];
                    const hideBottomBorder = index === comps.length - 1 || (nextComp && nextComp.ancestorHierarchy);

                    return this.processAncestorHierarchy([comp], true, hideBottomBorder);
                } else {
                    return (
                        <Link
                            key={name}
                            display='block'
                            paddingY={1}
                            href={comp.targetScreen && comp.targetScreen.targetUrl}
                            onClick={this.trackNavClick(name)}
                            fontWeight={isActive && 'bold'}
                        >
                            {name}
                        </Link>
                    );
                }
            });

        return elements;
    };

    processAncestorHierarchy = (comps, isSubLevel, hideBottomBorder) => {
        return (
            comps &&
            comps.map(comp => {
                return (
                    <Box
                        key={comp.displayName} //revisit this
                        is={!isSubLevel ? 'nav' : null}
                        aria-label={!isSubLevel ? comp.displayName : null}
                        borderTop={isSubLevel ? 1 : 2}
                        paddingTop={3}
                        css={
                            isSubLevel && hideBottomBorder
                                ? {
                                    marginTop: space[3],
                                    borderColor: colors.lightGray
                                }
                                : isSubLevel
                                    ? {
                                        marginTop: space[3],
                                        marginBottom: space[3],
                                        borderColor: colors.lightGray,
                                        paddingBottom: space[3],
                                        borderBottomWidth: 1
                                    }
                                    : {
                                        borderBottomWidth: 2,
                                        paddingBottom: space[3]
                                    }
                        }
                    >
                        <Text
                            is={isSubLevel ? 'h3' : 'h2'}
                            fontSize={isSubLevel ? 'base' : 'md'}
                            fontWeight='bold'
                            marginBottom={2}
                        >
                            {comp.displayName}
                        </Text>
                        {this.processHierarchy(comp.ancestorHierarchy, true)}
                    </Box>
                );
            })
        );
    };

    render() {
        const { leftRegion, ancestorHierarchy } = this.props;

        return (
            <div>
                {this.processAncestorHierarchy(ancestorHierarchy)}
                {leftRegion && leftRegion.length && (
                    <BccComponentList
                        items={leftRegion}
                        disableLazyLoadCount={leftRegion.length > 1 ? 2 : 1}
                        enablePageRenderTracking={true}
                        propsCallback={function (componentType) {
                            if (componentType === COMPONENT_NAMES.LINK_GROUP) {
                                return { isSimple: true };
                            } else {
                                return null;
                            }
                        }}
                    />
                )}
            </div>
        );
    }
}

export default wrapComponent(ContentStoreLeftNav, 'ContentStoreLeftNav');
