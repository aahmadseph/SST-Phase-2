import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, radii, borders, fontWeights
} from 'style/config';
import { Flex, Box } from 'components/ui';
import UI from 'utils/UI';
import paginationUtils from 'utils/Pagination';
import languageLocale from 'utils/LanguageLocale';
const getText = languageLocale.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/locales', 'RatingsAndReviews');

function setPagesArray(currentPage, totalPages, dividerIndex) {
    const pagesMapped = [];

    // If dividerIndex > 0, non-targeted items are present - show only 4 pages at a time
    if (dividerIndex > 0) {
        // Calculate which 4 pages to show based on current page
        let startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, startPage + 3);

        // Adjust start page if we're near the end
        if (endPage - startPage < 3) {
            startPage = Math.max(1, endPage - 3);
        }

        for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
            pagesMapped.push(pageIndex);
        }

        return pagesMapped;
    }

    if (totalPages <= 7) {
        for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
            pagesMapped.push(pageIndex);
        }
    } else if (totalPages === 8) {
        if (currentPage < 5) {
            for (let pageIndex = 1; pageIndex <= 5; pageIndex++) {
                pagesMapped.push(pageIndex);
            }

            pagesMapped.push(null);
            pagesMapped.push(totalPages);
        } else {
            pagesMapped.push(1);
            pagesMapped.push(null);

            for (let pageIndex = 4; pageIndex <= totalPages; pageIndex++) {
                pagesMapped.push(pageIndex);
            }
        }
    } else if (totalPages >= 9) {
        if (currentPage <= 3) {
            for (let pageIndex = 1; pageIndex <= 5; pageIndex++) {
                pagesMapped.push(pageIndex);
            }

            pagesMapped.push(null);
            pagesMapped.push(totalPages);
        }

        if (currentPage >= 4 && totalPages - currentPage >= 4) {
            pagesMapped.push(1);
            pagesMapped.push(null);

            for (let pageIndex = currentPage - 1; pageIndex <= currentPage + 1; pageIndex++) {
                pagesMapped.push(pageIndex);
            }

            pagesMapped.push(null);
            pagesMapped.push(totalPages);
        }

        if (totalPages - currentPage < 4) {
            pagesMapped.push(1);
            pagesMapped.push(null);

            for (let pageIndex = totalPages - 4; pageIndex <= totalPages; pageIndex++) {
                pagesMapped.push(pageIndex);
            }
        }
    }

    return pagesMapped;
}

function scrollToReviews(elementId) {
    UI.scrollTo({ elementId: elementId });
}

const ARROW = (
    <svg
        width='12'
        height='24'
        fill='currentColor'
    >
        <path d='M.41.248a1.023 1.023 0 00-.146 1.504L9.377 12 .264 22.248A1.022 1.022 0 00.41 23.75a1.191 1.191 0 001.605-.136l9.72-10.93c.177-.199.265-.442.265-.686 0-.242-.088-.486-.265-.685L2.015.385A1.164 1.164 0 001.14 0C.883 0 .624.08.411.248z' />
    </svg>
);

function Pagination({
    totalPages, currentPage = 1, handlePageClick, scrollElementId, minNumberOfPages = 1, dividerIndex = 0, ...props
}) {
    this.filterRef = React.createRef();

    if (totalPages <= minNumberOfPages) {
        return null;
    }

    return (
        <Flex
            is='ul'
            ref={this.filterRef}
            {...props}
            style={{ marginTop: dividerIndex > 0 ? '60px' : 'inherit' }}
        >
            <li css={styles.item}>
                <button
                    css={[styles.button, styles.chevron, styles.previous]}
                    aria-label={getText('previousPage')}
                    title={getText('previousPage')}
                    disabled={currentPage === 1 || currentPage === minNumberOfPages}
                    onClick={() => {
                        scrollToReviews(scrollElementId);
                        handlePageClick(currentPage - 1, paginationUtils.BUTTON_TYPES.LEFT);
                    }}
                    children={ARROW}
                />
            </li>
            {setPagesArray(currentPage, totalPages, dividerIndex).map((page, index) => {
                let element;

                if (page) {
                    const isActive = currentPage === page;
                    element = (
                        <button
                            css={[styles.button, isActive && styles.active, !isActive && props.customPageNumberStyle]}
                            aria-label={`${getText('page')} ${page}`}
                            aria-current={isActive ? 'page' : null}
                            data-at={Sephora.debug.dataAt('pagination_page')}
                            onClick={() => {
                                scrollToReviews(scrollElementId);
                                handlePageClick(page, paginationUtils.BUTTON_TYPES.NUMBER);
                            }}
                            children={page}
                        />
                    );
                } else {
                    element = (
                        <span
                            css={styles.button}
                            aria-hidden
                            children='...'
                        />
                    );
                }

                return (
                    <>
                        <li
                            key={index.toString()}
                            css={styles.item}
                            children={
                                <span style={{ position: 'relative' }}>
                                    {element}
                                    {dividerIndex > 0 && page > dividerIndex && page === currentPage && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '-50px',
                                                background: colors.black,
                                                color: '#FFF',
                                                padding: '9px 8px',
                                                borderRadius: '4px',
                                                fontWeight: fontWeights.bold
                                            }}
                                        >
                                            Targeted
                                        </span>
                                    )}
                                </span>
                            }
                        />
                        {dividerIndex > 0 && page === dividerIndex && (
                            <li
                                key={'divider'}
                                aria-hidden
                            >
                                <Box
                                    borderLeft={`${borders[1]} ${colors.black}`}
                                    height='85px'
                                    marginX={2}
                                    style={{ transform: 'translateY(-48px)', position: 'absolute' }}
                                />
                            </li>
                        )}
                    </>
                );
            })}
            <li css={styles.item}>
                <button
                    css={[styles.button, styles.chevron]}
                    aria-label={getText('nextPage')}
                    title={getText('nextPage')}
                    disabled={currentPage === totalPages}
                    onClick={() => {
                        scrollToReviews(scrollElementId);
                        handlePageClick(currentPage + 1, paginationUtils.BUTTON_TYPES.RIGHT);
                    }}
                    children={ARROW}
                />
            </li>
        </Flex>
    );
}

const styles = {
    item: {
        lineHeight: 1,
        fontWeight: 'var(--font-weight-bold)',
        marginLeft: 3,
        marginRight: 3,
        ':first-child': {
            marginLeft: -12,
            marginRight: 1
        },
        ':last-child': {
            marginRight: -12,
            marginLeft: 1
        }
    },
    chevron: {
        ':disabled': {
            color: colors.midGray
        }
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: radii[2],
        'button&:not([aria-current]):not(:disabled):hover': {
            backgroundColor: colors.nearWhite,
            textDecoration: 'underline'
        }
    },
    active: {
        backgroundColor: colors.black,
        color: colors.white,
        cursor: 'default'
    },
    previous: {
        transform: 'scaleX(-1)'
    }
};

export default wrapFunctionalComponent(Pagination, 'Pagination');
