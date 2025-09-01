import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Image, Text } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

const CustomBulletList = ({ bullets }) => (
    <Flex
        flexWrap='wrap'
        gap={2}
    >
        {bullets.map(({ bulletName, bulletFlag }, index) =>
            bulletFlag ? (
                <Flex
                    alignItems='center'
                    key={`bullet-item-${index}`}
                >
                    <Image
                        height={18}
                        src='/img/ufe/checkmark.svg'
                        width={18}
                        marginRight={1}
                    />
                    <Text
                        color='gray'
                        fontSize='base'
                        fontWeight='normal'
                    >
                        {bulletName}
                    </Text>
                </Flex>
            ) : null
        )}
    </Flex>
);

CustomBulletList.propTypes = {
    bullets: PropTypes.arrayOf(
        PropTypes.shape({
            bulletName: PropTypes.string.isRequired,
            bulletFlag: PropTypes.bool
        })
    ).isRequired
};

export default wrapFunctionalComponent(CustomBulletList, 'CustomBulletList');
