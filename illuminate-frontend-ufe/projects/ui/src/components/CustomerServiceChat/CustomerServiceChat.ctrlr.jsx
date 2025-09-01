/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, fontSizes, space } from 'style/config';
import buttonStyles from 'components/Button/styles';
import Arrow from 'components/Arrow/Arrow';
import { Button } from 'components/ui';
import IconChatAlt from 'components/LegacyIcon/IconChatAlt';
import LanguageLocale from 'utils/LanguageLocale';
import store from 'store/Store';
import LoadScripts from 'utils/LoadScripts';
import { PostLoad } from 'constants/events';

const { getLocaleResourceFile } = LanguageLocale;
const ICON_SIZE = 48;

class CustomerServiceChat extends BaseClass {
    componentDidMount() {
        if (Sephora.configurationSettings.enableOSCLiveChat) {
            LoadScripts.loadScripts(['//static.atgsvcs.com/js/atgsvcs.js'], () => {
                window.ATGSvcs.setEEID('200106308507');
            });
            Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
                const element = document.getElementById('BCCBREADCRUMBS');
                element && element.children && this.setGlobalBreadcrumbs(element.children);

                store.setAndWatch('user', null, userData => {
                    const user = userData.user;
                    window.first = user.firstName;
                    window.last = user.lastName;
                    window.email = user.login;
                    window.pageURL = window.location.href;
                });

                LoadScripts.loadScripts(['//sephorausa.custhelp.com/rnt/rnw/javascript/vs/1/vsapi.js', '//sephorausa.custhelp.com/vs/1/vsopts.js']);
            });
        }
    }

    setGlobalBreadcrumbs = children => {
        const breadcrumbs = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].innerText) {
                breadcrumbs[i] = children[i].innerText;
            }
        }

        window.breadcrumbs = breadcrumbs.toString();
    };

    render() {
        const getText = getLocaleResourceFile('components/CustomerServiceChat/locales', 'CustomerServiceChat');

        return (
            <React.Fragment>
                {Sephora.configurationSettings.enableOSCLiveChat && (
                    <div
                        id='myChatLinkContainer'
                        css={this.props.isFixed && styles.rootFixed}
                    >
                        <div
                            id='myChatLink'
                            css={styles.chatLink}
                        >
                            <Button
                                tabIndex='0'
                                variant='secondary'
                                id='chatBtn'
                                is='span'
                                style={styles.chatBtn}
                            >
                                <span css={styles.chatBtnIcon}>
                                    <IconChatAlt />
                                </span>
                                <span
                                    css={styles.chatBtnTxt}
                                    children={getText('liveChat')}
                                />
                                <Arrow direction='right' />
                            </Button>
                            <div
                                id='myChatLinkInfo'
                                css={styles.chatInfoTxt}
                            />
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const styles = {
    rootFixed: {
        position: 'fixed',
        bottom: space[3],
        right: space[3],
        backfaceVisibility: 'hidden'
    },
    chatLink: {
        '&:not(.rn_ChatAvailable) #chatBtn': buttonStyles.disabled
    },
    chatBtn: {
        position: 'relative',
        backgroundColor: colors.white,
        marginLeft: ICON_SIZE / 2,
        paddingLeft: ICON_SIZE / 2
    },
    chatBtnIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: -(ICON_SIZE / 2),
        marginTop: -(ICON_SIZE / 2),
        width: ICON_SIZE,
        height: ICON_SIZE,
        fontSize: 18,
        backgroundColor: colors.black,
        color: colors.white,
        borderRadius: 99999
    },
    chatBtnTxt: {
        marginLeft: space[2],
        marginRight: space[1]
    },
    chatInfoTxt: {
        fontSize: fontSizes.xs,
        marginTop: space[2],
        '&:empty': {
            marginTop: 0
        }
    }
};

export default wrapComponent(CustomerServiceChat, 'CustomerServiceChat', true);
