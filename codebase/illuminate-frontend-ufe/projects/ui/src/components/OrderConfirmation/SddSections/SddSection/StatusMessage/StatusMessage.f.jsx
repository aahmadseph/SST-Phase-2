import { colors, fontSizes } from 'style/config';
import { Link, Text } from 'components/ui';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

const StatusMessage = ({
    tracking, faqText, messageText, hrefForFaq, onFAQLinkClicked
}) => (
    <Text
        is='p'
        css={styles.text}
    >
        {messageText && `${messageText} `}
        {tracking && (
            <>
                <Link
                    href={tracking.URL}
                    css={styles.link}
                >
                    {tracking.text}
                </Link>
                <span css={styles.divider} />
            </>
        )}
        {faqText && (
            <Link
                onClick={!hrefForFaq ? onFAQLinkClicked : undefined}
                href={hrefForFaq}
                css={styles.link}
            >
                {faqText}
            </Link>
        )}
    </Text>
);

const styles = {
    text: {
        fontSize: fontSizes.sm,
        lineHeight: '14px'
    },
    link: { color: colors.blue },
    divider: {
        borderLeft: `1px solid ${colors.midGray}`,
        marginLeft: '8px',
        marginRight: '8px'
    }
};

StatusMessage.defaultProps = {};
StatusMessage.propTypes = {
    tracking: PropTypes.shape({
        URL: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    }),
    faqText: PropTypes.string.isRequired,
    messageText: PropTypes.string.isRequired,
    onFAQLinkClicked: PropTypes.func.isRequired,
    hrefForFaq: PropTypes.string
};

export default wrapFunctionalComponent(StatusMessage, 'StatusMessage');
