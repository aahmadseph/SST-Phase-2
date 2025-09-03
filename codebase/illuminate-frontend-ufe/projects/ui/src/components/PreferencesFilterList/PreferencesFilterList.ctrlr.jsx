import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';
import { Flex, Grid, Text } from 'components/ui';
import { fontSizes } from 'style/config';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';

const { getCategoryName } = BeautyPreferencesUtils;

class PreferencesFilterList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            updatedPreferences: {}
        };
    }

    componentDidMount() {
        if (this.props.selectAll) {
            this.setState({
                updatedPreferences: this.props.filterPreferences
            });
        }
    }

    updatePreferences = (pref, prefType) => {
        const currentPrefs = { ...this.state.updatedPreferences };
        const isSelected = currentPrefs[prefType].some(option => option.key === pref.key);

        if (isSelected) {
            currentPrefs[prefType] = currentPrefs[prefType].filter(item => !(item.key === pref.key));
        } else {
            currentPrefs[prefType] = [...currentPrefs[prefType], pref];
        }

        this.setState({ updatedPreferences: currentPrefs }, () => {
            this.props.onUpdatePreferences(this.state.updatedPreferences);
        });
    };

    render() {
        const { filterPreferences, columns } = this.props;
        const { updatedPreferences } = this.state;

        return (
            <>
                {Object.keys(filterPreferences).map(filterType => (
                    <Flex
                        flexDirection='column'
                        marginBottom={4}
                        key={filterType}
                    >
                        <Text
                            fontWeight='bold'
                            fontSize={fontSizes.sm}
                            css={{ textTransform: 'capitalize' }}
                            children={getCategoryName(filterType)}
                        />
                        <Grid
                            columns={columns}
                            marginTop={2}
                        >
                            {filterPreferences[filterType].map(beautyPreference => {
                                const isSelected = updatedPreferences[filterType]?.some(option => option.key === beautyPreference.key);

                                return (
                                    <Checkbox
                                        alignItems={'center'}
                                        checked={isSelected}
                                        onClick={() => this.updatePreferences(beautyPreference, filterType)}
                                        value={beautyPreference.key}
                                        fontWeight={isSelected && 'bold'}
                                        width='100%'
                                        children={beautyPreference.value}
                                    />
                                );
                            })}
                        </Grid>
                    </Flex>
                ))}
            </>
        );
    }
}

PreferencesFilterList.defaultProps = {
    selectAll: false,
    columns: 1
};
PreferencesFilterList.propTypes = {
    filterPreferences: PropTypes.object.isRequired,
    columns: PropTypes.number,
    selectAll: PropTypes.bool,
    onUpdatePreferences: PropTypes.func.isRequired
};

export default wrapComponent(PreferencesFilterList, 'PreferencesFilterList', true);
