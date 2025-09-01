import BaseClass from 'components/BaseClass';
import Interstice from 'components/Interstice/Interstice';
import Preview from 'components/Preview';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import WelcomePopup from 'components/WelcomePopup';
import PageTemplateType from 'constants/PageTemplateType';
import React from 'react';
import { wrapComponent } from 'utils/framework';
import ChatEntry from 'components/Content/CustomerService/ChatWithUs/ChatEntry';
import SidModalDropdown from 'components/PersonalizedPreviewPlacements/SidModalDropdown';
import SuperChat from 'ai/components/SuperChat';
import MinimizedSuperChat from 'ai/components/MinimizedSuperChat';
import { CHAT_ENTRY } from 'constants/chat';
class GlobalContent extends BaseClass {
    render() {
        const { template } = this.props;
        const shouldSeePreview = template !== PageTemplateType.PreviewSettings;
        const { isGenAIChatEnabledUFE } = Sephora.configurationSettings;

        return (
            <React.Fragment>
                <ReCaptcha />

                <Interstice />

                <WelcomePopup />

                <ChatEntry type={CHAT_ENTRY.global} />

                {isGenAIChatEnabledUFE && (
                    <>
                        <SuperChat />
                        <MinimizedSuperChat />
                    </>
                )}

                {!!shouldSeePreview && <SidModalDropdown />}

                {!!shouldSeePreview && <Preview />}
            </React.Fragment>
        );
    }
}

export default wrapComponent(GlobalContent, 'GlobalContent');
