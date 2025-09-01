import React from 'react';
import { mediaQueries } from 'style/config';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function StickyFooter({ accountForBottomNav, children, ...props }) {
    return (
        <div
            css={[
                styles.base,
                accountForBottomNav
                    ? [
                        styles.bottomPad,
                        {
                            [mediaQueries.smMax]: {
                                bottom: 'var(--bottomNavHeight)',
                                paddingBottom: 0
                            }
                        }
                    ]
                    : styles.bottomPad
            ]}
            data-height='bottomStickyHeight'
            {...props}
        >
            <div css={styles.inner}>{children}</div>
        </div>
    );
}

const styles = {
    base: {
        backgroundColor: 'var(--color-white)',
        position: 'fixed',
        zIndex: 'var(--layer-fixedBar)',
        right: 0,
        left: 0,
        bottom: 0,
        boxShadow: '0 -4px 8px 0 var(--color-darken2)'
    },
    bottomPad: {
        ['@supports (bottom: env(safe-area-inset-bottom))']: {
            paddingBottom: 'env(safe-area-inset-bottom)'
        }
    },
    inner: {
        padding: 'var(--space-2) var(--space-container)'
    }
};

StickyFooter.defaultProps = {
    accountForBottomNav: true
};

export default wrapFunctionalComponent(StickyFooter, 'StickyFooter');
