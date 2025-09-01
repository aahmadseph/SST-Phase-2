import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link, Box } from 'components/ui';
import { radii } from 'style/config';

const PADDING_X = '.625em';

const SummaryLayoutWrapper = ({ variant, isMyOffersLink, isBlock, ...props }) =>
    variant === 'Card' ? (
        <Box
            boxShadow='light'
            padding={[2, null, 4]}
            width='100%'
            height='100%'
            position='relative'
            borderRadius='4px'
        >
            <Link
                display='flex'
                flexDirection={['row', null, 'column']}
                alignItems={['center', null, 'start']}
                width='100%'
                height='100%'
                lineHeight='tight'
                {...props}
            />
        </Box>
    ) : (
        <Link
            display='flex'
            alignItems='center'
            marginBottom={3}
            {...(isMyOffersLink && {
                backgroundColor: 'lightBlue',
                paddingX: PADDING_X,
                paddingY: '.25em',
                lineHeight: 'tight'
            })}
            baseCss={
                isMyOffersLink && {
                    position: 'relative',
                    borderRadius: radii[2]
                }
            }
            {...(isMyOffersLink &&
                isBlock && {
                display: 'block',
                hasFloatingArrow: true,
                arrowDirection: 'right',
                marginX: `-${PADDING_X}`
            })}
            {...props}
        />
    );

export default wrapFunctionalComponent(SummaryLayoutWrapper, 'SummaryLayoutWrapper');
