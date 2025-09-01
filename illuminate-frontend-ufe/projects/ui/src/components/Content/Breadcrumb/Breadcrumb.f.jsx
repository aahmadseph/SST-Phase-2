import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { site } from 'style/config';
import { Flex, Link } from 'components/ui';
import Action from 'components/Content/Action';
const ActionLink = Action(Link);
import Chevron from 'components/Chevron';

const Breadcrumb = props => {
    const {
        breadcrumbs, localization, fontSize, customStyles = {}, onLinkClick
    } = props;

    return (
        <nav aria-label={localization || 'breadcrumb'}>
            <Flex
                is='ol'
                flexWrap='nowrap'
                fontSize={fontSize || 'sm'}
                alignItems='center'
                lineHeight='tight'
                color='gray'
                paddingY={2}
                minHeight={site.BREADCRUMB_HEIGHT}
                overflow='hidden'
                css={{
                    ...customStyles?.breadcrumbs,
                    whiteSpace: 'nowrap'
                }}
            >
                {breadcrumbs.map((crumb, index) => {
                    const isCurrent = crumb.action?.isCurrent;
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <li
                            key={`breadcrumb_${crumb.label}`}
                            style={getLiStyle(isLast)}
                        >
                            <ActionLink
                                padding={2}
                                margin={-2}
                                sid={crumb.sid}
                                action={crumb.action}
                                children={crumb.label}
                                onClick={e => onLinkClick && onLinkClick(e, crumb.action)}
                                css={getActionLinkStyle(isLast, isCurrent)}
                                {...(isCurrent && {
                                    ['aria-current']: 'page',
                                    color: 'base'
                                })}
                            />
                            {!isLast && (
                                <Chevron
                                    direction='right'
                                    size='.5em'
                                    marginX={2}
                                    css={{ flexShrink: 0 }}
                                />
                            )}
                        </li>
                    );
                })}
            </Flex>
        </nav>
    );
};

const getLiStyle = isLast => ({
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    flexShrink: isLast ? 1 : 0,
    flexGrow: isLast ? 1 : 0,
    maxWidth: isLast ? '100%' : 'auto'
});

const getActionLinkStyle = (isLast, isCurrent) => ({
    ...(isLast
        ? {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            minWidth: 0,
            maxWidth: '100%'
        }
        : {}),
    ...(isCurrent && {
        pointerEvents: 'none'
    })
});

export default wrapFunctionalComponent(Breadcrumb, 'Breadcrumb');
