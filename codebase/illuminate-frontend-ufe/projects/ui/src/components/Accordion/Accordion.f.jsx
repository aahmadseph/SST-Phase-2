import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Text, Flex, Icon, Divider
} from 'components/ui';
import {
    space, mediaQueries, lineHeights, fontSizes, fontWeights
} from 'style/config';

const createHeaderClickHandler = onClick => e => {
    onClick?.(e);
};

const createHeaderKeyDownHandler = onClick => e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e);
    }
};

const createDescriptionClickHandler = onClick => e => {
    // If the user clicks a control inside the description, don't toggle the accordion.
    // Otherwise treat the click as a toggle and stop propagation so the handler doesn't fire twice.
    // We intentionally leave out 'button' so a button used as instructional text will still toggle.
    const interactive = e.target.closest('a, input, select, textarea, [data-no-toggle="true"]');

    if (interactive && e.currentTarget.contains(interactive)) {
        e.stopPropagation();

        return;
    }

    onClick?.(e);
    e.stopPropagation();
};

const getHeaderCss = (defaultStyles, customStyles, isExpanded, hasSavedHeaderContent, allowCollapsedAutoHeight) => {
    const headerCss = { ...defaultStyles.headerContainer, ...(customStyles.headerContainer || {}) };

    if (!isExpanded && !hasSavedHeaderContent && !allowCollapsedAutoHeight) {
        headerCss[mediaQueries.smMax] = {
            ...(headerCss[mediaQueries.smMax] || {}),
            maxHeight: '50px'
        };
    }

    // When collapsed and there ARE saved items, reduce SMUI vertical padding to tighten space
    if (!isExpanded && hasSavedHeaderContent) {
        headerCss[mediaQueries.smMax] = {
            ...(headerCss[mediaQueries.smMax] || {}),
            paddingTop: '12px',
            paddingBottom: '12px',
            alignItems: 'center'
        };
    }

    return headerCss;
};

const getDescriptionCss = (defaultStyles, customStyles, isExpanded, hasSavedHeaderContent) => {
    const descriptionCss = { ...defaultStyles.descriptionChildrenContainer, ...(customStyles.descriptionChildrenContainer || {}) };

    if (!isExpanded && hasSavedHeaderContent) {
        descriptionCss[mediaQueries.smMax] = {
            ...(descriptionCss[mediaQueries.smMax] || {}),
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center'
        };
    }

    return descriptionCss;
};

function Accordion({
    id,
    isExpanded,
    title,
    onClick,
    customStyles,
    children,
    descriptionChildren,
    showBottomDivider,
    hasSavedHeaderContent = false,
    allowCollapsedAutoHeight = false
}) {
    const handleHeaderClick = createHeaderClickHandler(onClick);
    const handleHeaderKeyDown = createHeaderKeyDownHandler(onClick);
    const handleDescriptionClick = createDescriptionClickHandler(onClick);

    // Build header styles conditionally so smMax maxHeight only applies when collapsed AND nothing saved,
    // unless allowCollapsedAutoHeight is true (ColorIQ with saved value).
    const headerCss = getHeaderCss(defaultStyles, customStyles, isExpanded, hasSavedHeaderContent, allowCollapsedAutoHeight);

    const descriptionCss = getDescriptionCss(defaultStyles, customStyles, isExpanded, hasSavedHeaderContent);

    return (
        <React.Fragment>
            <Divider />
            <Flex
                data-at={'uncontrolled-accordion'}
                onClick={handleHeaderClick}
                role='button'
                tabIndex={0}
                onKeyDown={handleHeaderKeyDown}
                aria-controls={id}
                aria-expanded={!!isExpanded}
                css={headerCss}
            >
                <Text
                    id={`${id}_heading`}
                    is='h2'
                    children={title}
                    css={{ ...defaultStyles.headerText, ...(customStyles.headerText || {}) }}
                />
                {descriptionChildren && (
                    <Box
                        onClick={handleDescriptionClick}
                        css={descriptionCss}
                    >
                        {descriptionChildren}
                    </Box>
                )}
                <Icon
                    className='Accordion-icon'
                    name={isExpanded ? 'caretUp' : 'caretDown'}
                    size={24}
                    css={{ ...(customStyles.caret || {}) }}
                />
            </Flex>

            <div
                id={id}
                aria-labelledby={`${id}_heading`}
                css={{
                    transition: 'height .3s',
                    overflow: 'hidden'
                }}
                style={{
                    height: isExpanded ? 'auto' : 0
                }}
            >
                {/* Only render the content container when expanded AND there are children to show.
                    This avoids rendering an empty Box (with padding) that creates extra whitespace
                    when a section like ColorIQ is expanded but empty. */}
                {isExpanded && React.Children.count(children) > 0 && (
                    <Box
                        paddingBottom={[5, 7]}
                        css={{ ...defaultStyles.contentContainer, ...(customStyles.contentContainer || {}) }}
                    >
                        {children}
                    </Box>
                )}
            </div>

            {showBottomDivider && <Divider />}
        </React.Fragment>
    );
}

const defaultStyles = {
    headerContainer: {
        width: '100%',
        alignItems: 'flex-start',
        outline: 0,
        paddingTop: space[4],
        paddingBottom: space[4],
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        cursor: 'pointer'
    },
    descriptionChildrenContainer: {
        width: '71%',
        [mediaQueries.smMax]: {
            paddingTop: space[4],
            order: '6',
            width: '100%'
        }
    },
    contentContainer: {
        width: '69%',
        marginLeft: '26%',
        marginRight: '5%',
        [mediaQueries.smMax]: {
            width: '100%',
            marginLeft: '0',
            marginRight: '0'
        }
    },
    headerText: {
        width: '25%',
        lineHeight: lineHeights.tight,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        [mediaQueries.smMax]: {
            fontSize: fontSizes.base,
            width: '50%'
        }
    }
};

Accordion.defaultProps = {
    customStyles: {},
    showBottomDivider: false
};

export default wrapFunctionalComponent(Accordion, 'Accordion');
