import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Button } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Radio from 'components/Inputs/Radio/Radio';
import { forms, mediaQueries } from 'style/config';
import catalogUtils from 'utils/Catalog';
import { PRICE_KEYS, PRICE_VALUES, MANUAL_PTYPE } from 'utils/CatalogConstants';
import analyticsUtils from 'analytics/utils';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/Filters/locales', 'Filters');

const MAX_DIGITS = 4;
const MAX_SYMBOLS = MAX_DIGITS + 1;
const CURRENCY_SYMBOL = localeUtils.CURRENCY_SYMBOLS.US;
class CustomRange extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            min: '',
            max: '',
            prevContextId: null
        };

        this.minRef = React.createRef();
        this.maxRef = React.createRef();
    }

    static getDerivedStateFromProps(props, state) {
        const { checked, value, contextId } = props;

        if (checked === state.wasChecked && contextId === state.prevContextId) {
            return null;
        }

        const newState = {};

        if (checked !== state.wasChecked) {
            newState.wasChecked = checked;
        }

        if (contextId !== state.prevContextId) {
            newState.prevContextId = contextId;
        }

        if (contextId !== state.prevContextId) {
            const values = catalogUtils.parseCustomRangeValues(value);
            newState.min = catalogUtils.emptyByPattern(values[PRICE_KEYS.PL], PRICE_VALUES.MIN);
            newState.max = catalogUtils.emptyByPattern(values[PRICE_KEYS.PH], PRICE_VALUES.MAX);
        }

        if (state.wasChecked && !checked) {
            newState.min = '';
            newState.max = '';
        }

        return newState;
    }

    handleClick = e => {
        const { min, max } = this.state;

        if (!this.isValid()) {
            this.minRef.focus();

            return;
        }

        const numberMin = parseInt(min.replace(/\$/g, ''));
        const numberMax = parseInt(max.replace(/\$/g, ''));

        if (!isNaN(numberMin) && !isNaN(numberMax) && numberMin > numberMax) {
            this.setState(
                {
                    min: max,
                    max: min
                },
                () => this.applyNewParams(e, max, min)
            );
        } else {
            this.applyNewParams(e, min, max);
        }
    };

    applyNewParams = (e, min, max) => {
        const { onClick, valueStatus } = this.props;
        const plParam = this.createParam(PRICE_KEYS.PL, min, PRICE_VALUES.MIN);
        const phParam = this.createParam(PRICE_KEYS.PH, max, PRICE_VALUES.MAX);
        const newRefinement = {
            refinementValue: `${plParam}&${phParam}&${MANUAL_PTYPE}`,
            refinementValueDisplayName: `${analyticsUtils.removeCurrencySymbol(min)}-${analyticsUtils.removeCurrencySymbol(max)}`,
            refinementValueStatus: valueStatus
        };

        onClick(e, newRefinement);
    };

    onMinChange = e => {
        const newVal = this.formatValue(e.target.value, this.state.min);
        this.setState({ min: newVal }, () => this.adjustCursorPosition(this.minRef, newVal));
    };

    onMaxChange = e => {
        const newVal = this.formatValue(e.target.value, this.state.max);
        this.setState({ max: newVal }, () => this.adjustCursorPosition(this.maxRef, newVal));
    };

    formatValue = (value, prev) => {
        if (value === '' || value === CURRENCY_SYMBOL) {
            return '';
        }

        // delete last digit instead of CURRENCY_SYMBOL
        const adjustedValue = `${value}${CURRENCY_SYMBOL}` === prev ? value.substring(0, value.length - 1) : value;

        const number = parseInt(adjustedValue.replace(/\$/g, '').replace(/\-/g, ''));
        const newVal = isNaN(number) ? prev : catalogUtils.addLocalizedCurrencySign(number);

        return newVal;
    };

    isValid = () => {
        const { min, max } = this.state;

        return min !== '' || max !== '';
    };

    createParam = (key, value, fallBack) => {
        const valueOrFallback = value === '' ? fallBack : value;

        return `${key}=${valueOrFallback.replace(/\$/g, '')}`;
    };

    adjustCursorPosition = (input, newVal) => {
        if (localeUtils.isFRCanada() && newVal.length > 0 && input.inputElementRef.selectionEnd === newVal.length) {
            input.inputElementRef.selectionStart = newVal.length - 1;
            input.inputElementRef.selectionEnd = newVal.length - 1;
        }
    };

    render() {
        const { isModal, checked, value, name } = this.props;
        const radioOffset = ((isModal ? forms.HEIGHT : forms.HEIGHT_SM) - forms.RADIO_SIZE) / 2;
        const isValid = this.isValid();

        return (
            <Radio
                checked={checked}
                onClick={e => this.handleClick(e)}
                value={value}
                name={name}
                paddingY={null}
                marginTop={1}
                dotOffset={radioOffset}
                css={
                    isModal && {
                        [mediaQueries.xsMax]: {
                            gridColumn: '1 / -1'
                        }
                    }
                }
            >
                <Grid
                    gap={2}
                    alignItems='center'
                    columns={isModal ? '1fr 1fr auto' : 2}
                >
                    <TextInput
                        ref={x => (this.minRef = x)}
                        pattern='\d*'
                        inputMode='numeric'
                        maxLength={MAX_SYMBOLS}
                        value={this.state.min}
                        onChange={this.onMinChange}
                        isControlled={true}
                        isSmall={!isModal}
                        marginBottom={null}
                        placeholder={catalogUtils.addLocalizedCurrencySign('Min', ' ')}
                    />
                    <TextInput
                        ref={x => (this.maxRef = x)}
                        pattern='\d*'
                        inputMode='numeric'
                        maxLength={MAX_SYMBOLS}
                        value={this.state.max}
                        onChange={this.onMaxChange}
                        isControlled={true}
                        isSmall={!isModal}
                        marginBottom={null}
                        placeholder={catalogUtils.addLocalizedCurrencySign('Max', ' ')}
                    />
                    <div>
                        <Button
                            // iOS Safari 14.5+ intermittently neglects to update the button text color
                            // when the disabled prop is changed; force a re-render
                            key={`rangeApplyButton${isValid}`}
                            disabled={!isValid}
                            onClick={this.handleClick}
                            size='sm'
                            variant='primary'
                            children={getText('apply')}
                        />
                    </div>
                </Grid>
            </Radio>
        );
    }
}

export default wrapComponent(CustomRange, 'CustomRange');
