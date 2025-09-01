import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'store/Store';
import { mediaQueries } from 'style/config';
import { Link, Icon, Image } from 'components/ui';
import Actions from 'Actions';
import UserActions from 'actions/UserActions';

// utils
import localeUtils from 'utils/LanguageLocale';

// Format: country - language
const languageData = ['US-EN', 'CA-EN', 'CA-FR'];

const open = (ctry, lang) => {
    const desiredCountry = ctry === localeUtils.COUNTRIES.US ? localeUtils.COUNTRIES.US : localeUtils.COUNTRIES.CA;
    const desiredLang = lang === localeUtils.LANGUAGES.FR ? localeUtils.LANGUAGES.FR : localeUtils.LANGUAGES.EN;
    const switchCountryName = ctry === localeUtils.COUNTRIES.US ? 'United States' : 'Canada';
    store.dispatch(Actions.showCountrySwitcherModal(true, desiredCountry, desiredLang, switchCountryName));
};

const switchCountry = (ctry, lang) => {
    store.dispatch(UserActions.switchCountry(ctry, lang));
};

class CountrySwitcher extends BaseClass {
    state = {
        currCtry: localeUtils.COUNTRIES.US,
        currLang: localeUtils.LANGUAGES.EN
    };

    render() {
        const { currCtry, currLang } = this.state;
        const selectedLanguage = (currCtry && currLang && `${currCtry}-${currLang}`) || '';

        return (
            <div
                role='group'
                aria-labelledby='regionAndLanguage'
            >
                {languageData.map(languageOption => {
                    const selected = selectedLanguage && languageOption === selectedLanguage;
                    const [country, lang] = languageOption.split('-');

                    return (
                        <Link
                            key={languageOption}
                            display='flex'
                            alignItems='center'
                            width='100%'
                            fontSize='sm'
                            paddingY={2}
                            aria-label={`${selected ? 'Current Language Selected, ' : 'Change Language to'} ${
                                localeUtils.COUNTRY_LONG_NAMES[country]
                            } - ${localeUtils.LANGUAGES[languageOption]}`}
                            css={{ position: 'relative' }}
                            {...(selected
                                ? {
                                    ['data-at']: Sephora.debug.dataAt('current_country'),
                                    'aria-current': true,
                                    'aria-disabled': true,
                                    disable: true,
                                    type: 'button'
                                }
                                : {
                                    onClick: () => (country && country === this.state.currCtry ? switchCountry(country, lang) : open(country, lang))
                                })}
                        >
                            <Image
                                aria-hidden
                                width={24}
                                height={16}
                                marginRight={3}
                                css={{ flexShrink: 0 }}
                                src={localeUtils.getCountryFlagImage(country)}
                                data-at={Sephora.debug.dataAt(`country_flag_${country.toLowerCase()}`)}
                                disableLazyLoad={true}
                            />
                            <span data-at={Sephora.debug.dataAt(`country_${country.toLowerCase()}`)}>
                                {`${localeUtils.COUNTRY_LONG_NAMES[country]} - ${localeUtils.LANGUAGES[languageOption]}`}
                            </span>
                            {selected && (
                                <Icon
                                    data-at={Sephora.debug.dataAt('checkmark_icon')}
                                    name='checkmark'
                                    size={10}
                                    marginLeft={[2, null, 0]}
                                    css={{
                                        [mediaQueries.md]: {
                                            position: 'absolute',
                                            left: -18
                                        }
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            currCtry: localeUtils.getCurrentCountry().toUpperCase(),
            currLang: localeUtils.getCurrentLanguage().toUpperCase()
        });
    }
}

export default wrapComponent(CountrySwitcher, 'CountrySwitcher', true);
