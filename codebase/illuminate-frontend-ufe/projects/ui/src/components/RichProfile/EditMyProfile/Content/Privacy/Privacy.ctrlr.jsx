import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import userUtils from 'utils/User';
import decorators from 'utils/decorators';
import profileApi from 'services/api/profile';

import { Text, Box } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import localeUtils from 'utils/LanguageLocale';
import typography from 'style/typography';

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/Privacy/locales', 'Privacy');

class Privacy extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            biPrivate: false,
            isProfilePrivate: false,
            isUserReady: false
        };
    }

    componentDidMount() {
        const { biPrivate = {} } = this.props.socialProfile || {};
        decorators
            .withInterstice(profileApi.getPublicProfileByNickname)(userUtils.getNickname())
            .then(data => {
                this.setState({
                    biPrivate: biPrivate.biPrivate || data.biPrivate,
                    isProfilePrivate: data.isPrivate,
                    isUserReady: true,
                    personalizedInformation: this.props.biAccount?.personalizedInformation || {}
                });
            });
    }

    getData = () => {
        return { biPrivate: { biPrivate: this.state.biPrivate } };
    };

    getAttributes = () => {
        const { beautyPreference } = this.props;
        const prefList = ['skinTone', 'skinType', 'hairColor', 'eyeColor'];

        return beautyPreference && Object.keys(beautyPreference).length > 0
            ? prefList.map(key => {
                return beautyPreference[key]?.length && ['noPreference', 'notSure'].indexOf(beautyPreference[key][0]?.value) === -1 ? (
                    <li key={key}>{getText(key)}</li>
                ) : null;
            })
            : null;
    };

    handleBiPrivateTrue = () => {
        this.setState({ biPrivate: true });
    };

    handleBiPrivateFalse = () => {
        this.setState({ biPrivate: false });
    };

    render() {
        return (
            <div css={typography}>
                <Text
                    is='p'
                    marginBottom={1}
                >
                    {getText('beautyPreferencesInclude')}
                </Text>
                <ul>{this.getAttributes()}</ul>
                <Box
                    is='fieldset'
                    marginY={4}
                >
                    <Text
                        is='legend'
                        marginBottom={2}
                    >
                        {getText('beautyPreferencesVisible')}
                    </Text>
                    <Radio
                        checked={this.state.isUserReady && !this.state.biPrivate}
                        onChange={this.handleBiPrivateFalse}
                        paddingY={2}
                    >
                        {getText('everyone')}
                    </Radio>
                    <Radio
                        checked={this.state.isUserReady && this.state.biPrivate}
                        onChange={this.handleBiPrivateTrue}
                        paddingY={2}
                    >
                        {getText('justMe')}
                    </Radio>
                </Box>
                <Box
                    fontSize='sm'
                    color='gray'
                    lineHeight='tight'
                >
                    <p>{getText('yourSkincareConcerns')}</p>
                    <p>{getText('yourBeautyInsider')}</p>
                    <Text
                        is='p'
                        marginBottom={0}
                    >
                        {getText('forMoreInformation')}{' '}
                        <a
                            href='/terms-of-use'
                            children={getText('termsOfUse')}
                        />
                    </Text>
                </Box>
            </div>
        );
    }
}

export default wrapComponent(Privacy, 'Privacy');
