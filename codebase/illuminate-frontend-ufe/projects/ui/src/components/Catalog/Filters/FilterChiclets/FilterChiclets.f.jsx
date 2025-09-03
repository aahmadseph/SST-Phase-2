/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { mediaQueries, space, modal } from 'style/config';
import { Link, Divider } from 'components/ui';
import StarRating from 'components/StarRating/StarRating';
import Chiclet from 'components/Chiclet';
import UpperFunnelChiclet from 'components/Catalog/UpperFunnel/UpperFunnelChiclet';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog');
import catalogUtils from 'utils/Catalog';
import { UPPER_FUNNEL_REFINEMENTS } from 'constants/UpperFunnel';

function FilterChiclets({ isModal, filters = {}, refinements, onRemoveChiclet, onClearAllFilters, isHappening, showUpperFunnelChiclets }) {
    const chiclets = Object.keys(filters)
        .filter(filterName => filterName !== getText('sort') && filterName !== getText('yourBeautyPreferences'))
        .reduce(
            (prev, filterName) =>
                prev.concat(
                    filters[filterName].map(selectedValue => {
                        const currentRef = refinements.find(ref => ref.displayName === filterName);
                        const { values } = currentRef;
                        const currentValue = values.find(val => {
                            return val.refinementValue === selectedValue;
                        });

                        return {
                            refinement: currentValue,
                            filterName: filterName,
                            optionValue: selectedValue,
                            optionDisplayName: catalogUtils.isCustomRange(selectedValue)
                                ? catalogUtils.createCustomRangeDisplayName(selectedValue)
                                : currentValue?.refinementDisplayNameAndValue || currentValue?.refinementValueDisplayName
                        };
                    })
                ),
            []
        )
        .filter(item => item.optionDisplayName);

    const clearAllLink = (
        <Link
            data-at={Sephora.debug.dataAt('clear_all_link')}
            onClick={() => onClearAllFilters(true)}
            color='blue'
            fontSize={['sm', 'base']}
            padding={2}
            marginX={isHappening ? 2 : -2}
            marginY={isHappening ? 0 : -2}
        >
            {getText('clearAll')}
        </Link>
    );

    return chiclets?.length > 0 ? (
        <div css={isHappening && styles.listVariant.container}>
            <ul css={isHappening ? styles.listVariant.list : [styles.list, styles.list[isModal ? 'modal' : 'inline']]}>
                {chiclets.map(chiclet => {
                    const { optionValue, optionDisplayName, filterName, refinement } = chiclet;
                    const label = filterName === 'Rating' ? <StarRating rating={parseInt(optionDisplayName.slice(0, 1))} /> : `${optionDisplayName}`;
                    const isUpperFunnelChiclet = UPPER_FUNNEL_REFINEMENTS.includes(refinement?.filterKey);
                    const ChicletComponent = showUpperFunnelChiclets && isUpperFunnelChiclet ? UpperFunnelChiclet : Chiclet;

                    return (
                        <li
                            key={`${filterName}_${optionValue}`}
                            css={isHappening && styles.listVariant.chiclet}
                        >
                            <ChicletComponent
                                refinement={refinement}
                                data-at={Sephora.debug.dataAt('filter_chiclet')}
                                onClick={() => onRemoveChiclet(filterName, optionValue, !isModal)}
                                showX={true}
                                variant='fill'
                                maxWidth='32ch'
                                children={label}
                            />
                        </li>
                    );
                })}
                {isModal || (!isHappening && <li children={clearAllLink} />)}
            </ul>
            {isModal ||
                (isHappening && (
                    <div
                        css={styles.listVariant.clearAllContainer}
                        children={clearAllLink}
                    />
                ))}
            {isModal && (
                <Divider
                    marginY={2}
                    marginX={modal.outdentX}
                />
            )}
        </div>
    ) : null;
}

const styles = {
    list: {
        marginTop: -space[4],
        marginBottom: -space[2],
        paddingTop: space[2],
        paddingBottom: space[2],
        fontSize: 0,
        overflowX: 'auto',
        li: {
            display: 'inline-block',
            verticalAlign: 'middle',
            marginTop: space[2],
            ':not(:last-child)': {
                marginRight: space[2]
            }
        },
        modal: {
            whiteSpace: 'nowrap',
            marginLeft: -modal.paddingX[0],
            marginRight: -modal.paddingX[0],
            paddingLeft: modal.paddingX[0],
            paddingRight: modal.paddingX[0],
            [mediaQueries.sm]: {
                marginLeft: -modal.paddingX[1],
                marginRight: -modal.paddingX[1],
                paddingLeft: modal.paddingX[1],
                paddingRight: modal.paddingX[1]
            }
        },
        inline: {
            [mediaQueries.smMax]: {
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                marginLeft: -space.container,
                marginRight: -space.container,
                paddingLeft: space.container,
                paddingRight: space.container
            }
        }
    },
    listVariant: {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
            [mediaQueries.smMax]: {
                justifyContent: 'space-between'
            }
        },
        list: {
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            padding: 0,
            margin: 0,
            listStyleType: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            '& li:first-child': {
                paddingLeft: 0
            }
        },
        chiclet: {
            padding: '0px 5px',
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            overflow: 'visible',
            textOverflow: 'clip',
            flexShrink: 0,
            flexGrow: 0
        },
        clearAllContainer: {
            flexShrink: 0,
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            [mediaQueries.smMax]: {
                marginLeft: '10px',
                paddingLeft: '10px'
            }
        }
    }
};

export default wrapFunctionalComponent(FilterChiclets, 'FilterChiclets');
