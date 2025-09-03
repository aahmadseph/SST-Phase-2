import React from 'react';
import { space } from 'style/config';
import { Image } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;
// replace the hardcoded list with the data adjacent to 'results' and send as props

function TrendingSearch({
    styles,
    results,
    highlightedIndex,
    setHighlightedIndex,
    handleItemClick,
    highlight,
    inputRef,
    section,
    trendingCategories,
    zeroStateSearchCount
}) {
    const isEmpty = !inputRef.current || !inputRef.current.getValue() || !trendingCategories.length > 0;

    return !isEmpty ? (
        <>
            <li
                css={[styles.result, styles.resultHeader]}
                children={section}
            />

            {trendingCategories.map((result, index) => {
                const isActive = zeroStateSearchCount + results.length + index === highlightedIndex;

                return (
                    <li
                        key={result.url || results.length + index}
                        role='option'
                        aria-selected={isActive}
                        id={`site_search_result${results.length + index}`}
                        css={[styles.result, isActive && styles.resultHover]}
                        onMouseEnter={() => setHighlightedIndex(results.length + index)}
                        onClick={() => handleItemClick(result, result.url)}
                    >
                        <Image
                            src='/img/ufe/icons/trending.svg'
                            size={16}
                            css={{
                                marginRight: space[3],
                                marginTop: '.25em'
                            }}
                        />
                        <span
                            css={{ flex: 1 }}
                            dangerouslySetInnerHTML={{
                                __html: highlight(result.value)
                            }}
                        />
                    </li>
                );
            })}
        </>
    ) : null;
}

export default wrapFunctionalComponent(TrendingSearch, 'TrendingSearch');
