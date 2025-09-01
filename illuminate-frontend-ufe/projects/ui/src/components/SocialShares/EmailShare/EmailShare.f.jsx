import React from 'react';
import { Image } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function EmailShare({ body = '', subject = '', recipientEmail = '' }) {
    return (
        <a href={`mailto:${recipientEmail}?subject=${subject}&body=${body}`}>
            <Image
                display='block'
                src='/img/ufe/icons/messages.svg'
                disableLazyLoad={true}
            />
        </a>
    );
}

export default wrapFunctionalComponent(EmailShare, 'EmailShare');
