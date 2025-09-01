import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Link, Box, Image, Icon
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import mediaUtils from 'utils/Media';
import Badge from 'components/Badge';
import { colors } from 'style/config';
import Copy from 'components/Content/Copy';
import beautyInsiderPageBindings from 'analytics/bindingMethods/pages/beautyInsider/beautyInsiderPageBindings';

const { Media } = mediaUtils;

const SummaryCard = ({
    dataAt,
    href,
    onClick,
    imgSrc,
    imgDataAt,
    iconName,
    iconDataAt,
    content,
    copyContent,
    contentDataAt,
    text,
    textDataAt,
    rougeBadgeText,
    showRougeBadgeInNextLine,
    disableUnderline = false
}) => {
    const handleClick = e => {
        if (href && href.includes('#') && content) {
            beautyInsiderPageBindings.fireLinkTracking(`jump-link_${content.toLowerCase()}`);
        }

        if (typeof onClick === 'function') {
            onClick(e);
        }
    };
    const RougeBadge = () => (
        <Box
            display='inline'
            is='span'
            marginLeft={showRougeBadgeInNextLine ? 'auto' : 2}
        >
            <Badge
                badge={rougeBadgeText}
                color={colors.red}
            />
        </Box>
    );

    const addRougeBadgeOnPostParse = html => {
        const endOf = html.indexOf('</p>');
        const begin = html.substring(0, endOf);
        const middle = showRougeBadgeInNextLine ? '<br />' : '';
        const end = html.substring(endOf, html.length);

        return `${begin}${middle}${renderToStaticMarkup(<RougeBadge />)}${end}`;
    };

    const CardMarkdown = () => (
        <Box>
            {rougeBadgeText ? (
                <Media lessThan='md'>
                    <Markdown
                        data-at={contentDataAt}
                        css={styles.MARKDOWN_CARD}
                        content={content}
                        onPostParse={addRougeBadgeOnPostParse}
                    />
                </Media>
            ) : null}
            <Media greaterThanOrEqual={rougeBadgeText ? 'md' : undefined}>
                <Markdown
                    data-at={contentDataAt}
                    css={styles.MARKDOWN_CARD}
                    content={content}
                />
            </Media>
        </Box>
    );

    return (
        <Box {...styles.LIST_ITEMS.CARD}>
            <Link
                {...styles.LIST_ITEMS.LINK}
                data-at={dataAt}
                href={href}
                onClick={handleClick}
                disableUnderline={disableUnderline}
            >
                <Box
                    display='flex'
                    alignItems='flex-start'
                    justifyContent='space-between'
                    width={[null, null, '100%']}
                >
                    {imgSrc && (
                        <Image
                            data-at={imgDataAt}
                            src={imgSrc}
                            {...styles.LIST_ITEMS.IMG}
                        />
                    )}

                    {rougeBadgeText && (
                        <Media
                            greaterThan='sm'
                            css={{ lineHeight: '13px' }}
                        >
                            <RougeBadge />
                        </Media>
                    )}
                </Box>

                {iconName && (
                    <Icon
                        data-at={iconDataAt}
                        name={iconName}
                        {...styles.LIST_ITEMS.IMG}
                    />
                )}

                {content && <CardMarkdown />}

                {copyContent && (
                    <Copy
                        content={copyContent}
                        marginTop={0}
                        marginBottom={0}
                        style={{
                            flex: 1
                        }}
                    />
                )}

                {text && (
                    <span
                        data-at={textDataAt}
                        css={{ flex: 1 }}
                        children={text}
                    />
                )}
            </Link>
        </Box>
    );
};

const styles = {
    MARKDOWN_CARD: { flex: 1, '& > :first-child': { marginBottom: 0 } },
    LIST_ITEMS: {
        CARD: {
            boxShadow: 'light',
            width: '100%',
            height: '100%',
            padding: [2, null, 4],
            borderRadius: '4px'
        },
        LINK: {
            display: 'flex',
            flexDirection: ['row', null, 'column'],
            alignItems: ['center', null, 'start'],
            width: '100%',
            height: '100%',
            lineHeight: 'tight'
        },
        IMG: {
            size: [24, null, 32],
            width: [24, null, 32],
            height: [24, null, 32],
            marginRight: [2, null, 0],
            marginBottom: [0, null, 3]
        }
    }
};

export default wrapFunctionalComponent(SummaryCard, 'SummaryCard');
