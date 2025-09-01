import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { ENDECA_VS_CONSTRUCTOR_COLORS } from 'utils/CatalogConstants';
import { REFINEMENT_TYPES } from 'utils/CatalogConstants';
import { Link, Image } from 'components/ui';

function MultiSelect({
    type, displayName, value, label, disabled, onClick, checked, isHappening
}) {
    if (type === REFINEMENT_TYPES.COLORS) {
        let imageName = value;

        if (Sephora.configurationSettings.isNLPSearchEnabled) {
            imageName = ENDECA_VS_CONSTRUCTOR_COLORS[displayName.toLowerCase()];
        }

        return (
            <Link
                is='div'
                role='checkbox'
                aria-checked={checked}
                onClick={onClick}
                fontWeight={checked && 'bold'}
                display='flex'
                alignItems='center'
                lineHeight='tight'
            >
                <Image
                    display='block'
                    disableLazyLoad={true}
                    borderWidth='2px'
                    borderColor={checked ? 'black' : 'transparent'}
                    borderRadius='full'
                    padding='2px'
                    marginLeft='-4px'
                    marginRight={1}
                    size={38}
                    src={`/img/ufe/catalog-colors/${imageName}.png`}
                    css={{ flexShrink: 0 }}
                />
                {label}
            </Link>
        );
    } else {
        return (
            <Checkbox
                disabled={disabled}
                checked={checked}
                onClick={onClick}
                value={value}
                fontWeight={checked && 'bold'}
                hasHover={true}
                paddingY={2}
                width='100%'
                children={label}
                isHappening={isHappening}
            />
        );
    }
}

export default wrapFunctionalComponent(MultiSelect, 'MultiSelect');
