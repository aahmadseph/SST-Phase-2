import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Text, Box } from 'components/ui';
import { modal, space } from 'style/config';
import Markdown from 'components/Markdown/Markdown';

function BuyNowPayLaterContent({
    title, subtitle, description, instructions, terms, logo
}) {
    return (
        <Modal.Body
            lineHeight='tight'
            paddingX={modal.paddingSm}
            paddingTop={modal.paddingX[1]}
            paddingBottom={space[3]}
            css={{ display: 'flex', flexDirection: 'column', gap: modal.paddingSm }}
        >
            {logo}
            <Text
                is='h3'
                fontSize='lg'
                fontWeight='bold'
            >
                {title}
            </Text>
            {subtitle && (
                <Text
                    is='p'
                    fontSize='base'
                    fontWeight='bold'
                >
                    {subtitle}
                </Text>
            )}
            {description && (
                <Text
                    is='p'
                    marginTop='.25em'
                    fontSize='base'
                >
                    {description}
                </Text>
            )}
            <Box
                is='ul'
                marginLeft='-3px'
            >
                {instructions.map((instruction, index) => (
                    <li key={instruction}>
                        <Text
                            fontSize='md'
                            marginRight='.5em'
                            marginLeft='.25em'
                        >
                            <b>{index + 1}.</b>
                        </Text>
                        <span>
                            <Markdown
                                display='inline'
                                css={{ p: { display: 'inline' } }}
                                content={instruction}
                            ></Markdown>
                        </span>
                    </li>
                ))}
            </Box>
            {terms}
        </Modal.Body>
    );
}

BuyNowPayLaterContent.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
    terms: PropTypes.object.isRequired
};

export default wrapFunctionalComponent(BuyNowPayLaterContent, 'BuyNowPayLaterContent');
