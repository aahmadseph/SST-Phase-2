import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import ErrorMsg from 'components/ErrorMsg';

import PropTypes from 'prop-types';

function DeliveryIssueChoiceScreen({
    deliveryIssues, updateIssue, selectedDeliveryIssue, pleaseSelect, pleaseMakeSelection, isDeliveryIssueError
}) {
    return (
        <fieldset>
            <Text
                is='legend'
                lineHeight='tight'
                marginBottom={4}
                fontWeight='bold'
            >
                {pleaseSelect}
            </Text>
            {isDeliveryIssueError && <ErrorMsg children={pleaseMakeSelection} />}
            {deliveryIssues.map(item => (
                <Radio
                    key={item.code}
                    fontWeight='normal'
                    paddingY={2}
                    checked={selectedDeliveryIssue?.code === item.code}
                    value={6}
                    onChange={() => {
                        updateIssue(item);
                    }}
                >
                    {item.description}
                </Radio>
            ))}
        </fieldset>
    );
}

DeliveryIssueChoiceScreen.propTypes = {
    deliveryIssues: PropTypes.array.isRequired,
    updateIssue: PropTypes.func.isRequired,
    selectedDeliveryIssue: PropTypes.object,
    pleaseSelect: PropTypes.string,
    isDeliveryIssueError: PropTypes.bool
};

export default wrapFunctionalComponent(DeliveryIssueChoiceScreen, 'DeliveryIssueChoiceScreen');
