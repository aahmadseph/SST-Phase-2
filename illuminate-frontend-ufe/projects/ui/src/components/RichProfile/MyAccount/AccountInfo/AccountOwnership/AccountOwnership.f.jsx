import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import { Text, Link } from 'components/ui';

const AccountOwnership = ({ localization, checkAccountClosure }) => {
    return (
        <>
            <LegacyGrid
                gutter={3}
                alignItems='baseline'
            >
                <LegacyGrid.Cell
                    width={Sephora.isMobile() ? 85 : 1 / 4}
                    fontWeight='bold'
                >
                    {localization.accountOwnership}
                </LegacyGrid.Cell>
                <LegacyGrid.Cell width='fill'>
                    <Text is='p'>{localization.accountIsOpen}</Text>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell width='fit'>
                    <Link
                        color='blue'
                        paddingY={2}
                        marginY={-2}
                        onClick={checkAccountClosure}
                    >
                        {localization.closeAccount}
                    </Link>
                </LegacyGrid.Cell>
            </LegacyGrid>
        </>
    );
};

AccountOwnership.propTypes = {
    localization: PropTypes.object.isRequired,
    checkAccountClosure: PropTypes.func.isRequired
};

AccountOwnership.defaultProps = {
    checkAccountClosure: () => {}
};

export default wrapFunctionalComponent(AccountOwnership, 'AccountOwnership');
