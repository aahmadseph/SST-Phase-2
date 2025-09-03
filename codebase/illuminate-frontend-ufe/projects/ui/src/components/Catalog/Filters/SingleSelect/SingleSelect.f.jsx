import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Radio from 'components/Inputs/Radio/Radio';
import StarRating from 'components/StarRating/StarRating';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog');

function SingleSelect({
    value, name, title, label, disabled, isDefault, onClick, checked
}) {
    const text = isDefault ? `${label} (${getText('default')})` : label;
    const isRating = title === 'Rating' || title === 'Cote';

    return (
        <Radio
            name={name}
            onClick={onClick}
            value={value}
            checked={checked}
            disabled={disabled}
            hasHover={true}
            paddingY={2}
            fontWeight={checked && 'bold'}
            {...(isRating && {
                dotOffset: 0,
                alignItems: 'center'
            })}
        >
            {isRating ? (
                <span css={styles.ratingWrap}>
                    <StarRating
                        size='1em'
                        rating={parseInt(label?.slice(0, 1))}
                    />
                    <span
                        css={styles.ratingLabel}
                        children={text.replace('and', '&')}
                    />
                </span>
            ) : (
                <span
                    css={styles.label}
                    children={text}
                />
            )}
        </Radio>
    );
}

const styles = {
    label: {
        display: 'block',
        ':first-letter': {
            textTransform: 'uppercase'
        }
    },
    ratingWrap: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1
    },
    ratingLabel: {
        marginLeft: '.375em',
        flex: 1
    }
};

export default wrapFunctionalComponent(SingleSelect, 'SingleSelect');
