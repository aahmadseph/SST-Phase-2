import React from 'react';
import framework from 'utils/framework';
import { Container } from 'components/ui';
import RelatedContent from 'components/RelatedContent';
const { wrapFunctionalComponent } = framework;

function decodeBase64(content) {
    if (!content) {
        return '';
    }

    try {
        if (typeof window === 'undefined') {
            return Buffer.from(content, 'base64').toString('utf-8');
        }

        return window.atob ? window.atob(content) : '';
    } catch (error) {
        return ''; // Fallback to empty content on failure
    }
}

const NewRwdBuyPage = props => {
    const { buy } = props;
    const { content = [], linkEquityBlock } = buy;
    const decoded = decodeBase64(content);

    return (
        <Container>
            <div
                dangerouslySetInnerHTML={{
                    __html: decoded
                }}
            />
            <RelatedContent
                hasDivider={content?.length > 0}
                links={linkEquityBlock?.links}
            />
        </Container>
    );
};

export default wrapFunctionalComponent(NewRwdBuyPage, 'NewRwdBuyPage');
