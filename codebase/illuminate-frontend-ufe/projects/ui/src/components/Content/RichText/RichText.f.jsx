import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import typography from 'style/typography';
import Location from 'utils/Location';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import contentConstants from 'constants/content';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Link } from 'components/ui';
import Anchor from 'components/Content/Anchor';
import StyleWrap from 'components/Content/StyleWrap';
import Action from 'components/Content/Action';
import { Text } from 'components/ui';
import { fontWeights } from 'style/config';

const ActionLink = Action(Link);
const { COMPONENT_TYPES } = contentConstants;

function getTextFromChildren(children) {
    if (typeof children === 'string' || typeof children === 'number') {
        return children;
    }

    if (Array.isArray(children)) {
        return children.map(getTextFromChildren).join('');
    }

    if (React.isValidElement(children) && children.props && children.props.children) {
        return getTextFromChildren(children.props.children);
    }

    return '';
}

function renderOptions({
    links, showContentModal, linkColor, isPrescreenModal, renderText
}) {
    return {
        renderNode: {
            [BLOCKS.HEADING_1]: (node, children) => (
                <Text
                    is='h1'
                    lineHeight='tight'
                    fontWeight='bold'
                    fontSize={['lg', 'xl']}
                >
                    {children}
                </Text>
            ),
            [BLOCKS.HEADING_2]: (node, children) => (
                <h2>
                    <span>{children}</span>
                </h2>
            ),
            [BLOCKS.HEADING_3]: (node, children) => (
                <h3>
                    <span>{children}</span>
                </h3>
            ),
            [BLOCKS.HEADING_4]: (node, children) => (
                <h4>
                    <span>{children}</span>
                </h4>
            ),
            [BLOCKS.HEADING_5]: (node, children) => (
                <h5>
                    <span>{children}</span>
                </h5>
            ),
            [BLOCKS.HEADING_6]: (node, children) => (
                <h6>
                    <span>{children}</span>
                </h6>
            ),
            [BLOCKS.PARAGRAPH]: (node, children) =>
                // do not render empty paragraphs
                children.length === 1 && children[0] === '' ? null : (
                    <p
                        aria-label={getTextFromChildren(children)}
                        tabIndex='0'
                    >
                        <span>{children}</span>
                    </p>
                ),
            [BLOCKS.LIST_ITEM]: (node, children) => (
                <li>
                    <span>{children}</span>
                </li>
            ),
            [BLOCKS.EMBEDDED_ENTRY]: node => {
                const entry = links?.entries?.block.find(e => e.sys.id === node.data.target.sys.id);

                if (!entry) {
                    return null;
                }

                if (entry.type === COMPONENT_TYPES.ANCHOR) {
                    return <Anchor sid={entry.sid} />;
                }

                if (entry.type === COMPONENT_TYPES.BLOCK_ENTRY_STYLE) {
                    const {
                        element,
                        sid,
                        text,
                        style, // DEPRECATED
                        ...styleProps
                    } = entry;

                    return (
                        <StyleWrap
                            sid={sid}
                            is={element}
                            style={style || styleProps}
                        >
                            <span>{text}</span>
                        </StyleWrap>
                    );
                }

                return null;
            },
            [INLINES.EMBEDDED_ENTRY]: node => {
                const entry = links?.entries?.inline.find(e => e.sys.id === node.data.target.sys.id);

                if (!entry) {
                    return null;
                }

                switch (entry.type) {
                    case COMPONENT_TYPES.INLINE_ENTRY_STYLE: {
                        const {
                            element, sid, type, text, action, ...styleProps
                        } = entry;

                        styleProps.style = {};

                        if (action && !styleProps.color) {
                            styleProps.color = linkColor;
                        }

                        // Non styled system props; apply as inline style

                        if (styleProps.fontStyle) {
                            styleProps.style.fontStyle = styleProps.fontStyle;
                            delete styleProps.fontStyle;
                        }

                        if (styleProps.textDecoration) {
                            styleProps.style.textDecoration = styleProps.textDecoration;
                            delete styleProps.textDecoration;
                        }

                        const elType = !element || element === 'normal' ? 'span' : element;

                        return (
                            <StyleWrap
                                sid={sid}
                                is={elType}
                                isInline={true}
                                action={action}
                                children={text}
                                style={styleProps}
                            />
                        );
                    }
                    case COMPONENT_TYPES.DYNAMIC_DATA_ATTRIBUTE: {
                        const { sid, text, ...styleProps } = entry;

                        styleProps.style = {};
                        styleProps.style.fontWeight = fontWeights.bold;

                        return (
                            <StyleWrap
                                sid={sid}
                                is={'span'}
                                isInline={true}
                                children={text}
                                style={styleProps}
                            />
                        );
                    }
                    default:
                }

                return null;
            },
            [INLINES.HYPERLINK]: ({ data }, children) => (
                <ActionLink
                    action={{
                        targetUrl: data.uri,
                        newWindow: isPrescreenModal ?? false
                    }}
                    children={children}
                    // in spa case, close cms modal when clicked within one, unless modal is from RTPS prescreen
                    onClick={isPrescreenModal ? undefined : () => showContentModal({ isOpen: false })}
                    display='inline'
                    underline={true}
                    color={linkColor}
                />
            ),
            [INLINES.ENTRY_HYPERLINK]: (node, children) => {
                const entry = links?.entries?.hyperlink.find(e => e.sys?.id === node.data.target.sys.id);

                if (!entry) {
                    return null;
                }

                const trackingEvent = () => {
                    if (Location.isExperienceDetailsPage() && entry.targetUrl === '/beauty/beauty-services-faq') {
                        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                            data: {
                                linkData: 'happening at sephora:beauty services faq'
                            }
                        });
                    }
                };

                return (
                    <ActionLink
                        // use `span` and `inline` to allow for wrapping link text
                        is={entry.page || entry.targetUrl ? 'a' : 'span'}
                        action={entry}
                        children={children}
                        onClick={() => {
                            trackingEvent();
                        }}
                        display='inline'
                        underline={true}
                        color={linkColor}
                    />
                );
            }
        },
        ...(renderText && { renderText })
    };
}

const RichText = ({
    content, style, showContentModal, linkColor, isPrescreenModal, renderText
}) => {
    if (!content) {
        return null;
    }

    const options = renderOptions({
        links: content.links,
        showContentModal,
        linkColor,
        isPrescreenModal,
        renderText
    });

    return <div css={[typography, styles, style]}>{documentToReactComponents(content.json, options)}</div>;
};

const styles = {
    /* For skeleton rendering */
    '& h1, & h2, & h3, & h4, & h5, & h6, & p, & li': {
        '& > span': {
            display: 'contents'
        }
    },
    /* No top margin on first element */
    '& > :where(:first-child)': {
        marginTop: 0
    },
    /* No bottom margin on last element */
    '& > :where(:last-child)': {
        marginBottom: 0
    },
    /* Break at newline characters */
    '& > :where(h1, h2, h3, h4, h5, h6, li, p)': {
        whiteSpace: 'pre-wrap'
    },
    '& :where(table)': {
        borderCollapse: 'collapse',
        marginBottom: '1em'
    },
    '& :where(th, td)': {
        padding: '.75em 1em',
        borderColor: 'var(--color-darken2)',
        borderWidth: 1,
        lineHeight: 'var(--leading-tight)',
        '& :where(p:only-child)': {
            marginBottom: 0
        }
    },
    '& :where(td)': {
        verticalAlign: 'top'
    },
    '& :where(th)': {
        fontWeight: 'var(--font-weight-bold)',
        backgroundColor: 'var(--color-nearWhite)',
        verticalAlign: 'bottom'
    }
};

RichText.propTypes = {
    content: PropTypes.shape({
        json: PropTypes.shape({
            content: PropTypes.array,
            data: PropTypes.object,
            nodeType: PropTypes.string
        }),
        links: PropTypes.object
    }),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    showContentModal: PropTypes.func,
    linkColor: PropTypes.string,
    renderText: PropTypes.func
};

RichText.defaultProps = {
    style: null,
    showContentModal: null,
    linkColor: 'link'
};

export default wrapFunctionalComponent(RichText, 'RichText');
