import React from 'react';
import InputSwitch from 'components/Inputs/InputSwitch/InputSwitch';
import { Box, Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import BaseClass from 'components/BaseClass';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { RUPEX_FORM_RESPONSE_TYPES } from 'constants/personalization';
import Empty from 'constants/empty';
import { isUfeEnvProduction } from 'utils/Env';

const {
    ERROR, RESPONSE, RESIZE, READY, SUBMIT
} = RUPEX_FORM_RESPONSE_TYPES;

const getText = localeUtils.getLocaleResourceFile('components/Preview/locales', 'Preview');

class ProfileAttributes extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showIframe: false,
            isReadyStateFired: false
        };

        this.iFrameRef = React.createRef();
    }

    saveRupexData = event => {
        if (event?.data?.type === RESPONSE) {
            this.props.disableSubmitBtn(false);
            this.props.setErrorMessage(Empty.String);
            Storage.session.setItem(LOCAL_STORAGE.RUPEX_PREVIEW_DATA, event?.data?.data?.data);
        }

        if (event.data.type === RESIZE && event.data.data.height) {
            this.iFrameRef.current.style.height = `${event.data.data.height}px`;
        }

        if (event.data.type === READY) {
            this.setState({
                isReadyStateFired: true
            });
            this.handleOnLoad();
        }

        if (event.data.type === ERROR) {
            this.props.disableSubmitBtn(true);
            this.state.isReadyStateFired && this.state.showIframe && this.props.setErrorMessage(getText('selectionErrors'));
        }
    };

    componentDidMount() {
        window.addEventListener('message', this.saveRupexData);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.saveRupexData);
    }

    handleProfileAttributes = () => {
        this.setState(
            prevState => ({
                showIframe: !prevState.showIframe
            }),
            () => {
                this.props.handlePreviewWithProfileAttr(this.state.showIframe);
            }
        );
    };

    handleOnLoad = () => {
        const rupexData = Storage.session.getItem(LOCAL_STORAGE.RUPEX_PREVIEW_DATA);

        if (rupexData) {
            this.iFrameRef.current?.contentWindow?.postMessage(
                {
                    type: 'rupex_request',
                    data: rupexData
                },
                '*'
            );
            this.setState(
                {
                    showIframe: true
                },
                () => {
                    this.props.handlePreviewWithProfileAttr(this.state.showIframe);
                }
            );
        }
    };

    handleSubmit = () => {
        this.iFrameRef.current?.contentWindow?.postMessage({ type: SUBMIT, data: true }, '*');
    };

    render() {
        const iFrameStyles = {
            width: '100%',
            border: 'none'
        };

        iFrameStyles.display = this.state.showIframe ? 'block' : 'none';

        return (
            <Box
                marginBottom={3}
                marginX={!this.props.isModal && [4, 9]}
                data-at={Sephora.debug.dataAt('profile-attribute-container')}
            >
                <Box
                    display='flex'
                    maxWidth={!this.props.isModal && 320}
                    justifyContent='space-between'
                >
                    <Text
                        is='h4'
                        fontWeight='bold'
                        marginBottom={4}
                    >
                        {getText('profileAttributes')}
                    </Text>
                    <InputSwitch
                        name='profile_attributes'
                        id='profile_attributes'
                        checked={this.state.showIframe}
                        onClick={this.handleProfileAttributes}
                    />
                </Box>
                <iframe
                    style={iFrameStyles}
                    src={`https://appscms-${isUfeEnvProduction ? 'preview' : 'qa'}.sephora.com/p13nrulesui/widget/preview/?ch=rwd&bg=`}
                    ref={this.iFrameRef}
                ></iframe>
            </Box>
        );
    }
}

export default ProfileAttributes;
