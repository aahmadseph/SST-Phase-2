import React from 'react';
import PropTypes from 'prop-types';
import PersonalizedPlacement from './PersonalizedPlacement/index';
import Location from 'utils/Location';
import cookieUtils from 'utils/Cookies';

/**
 * Higher-Order Component that adds PersonalizedPlacement behavior to any component
 * @param {React.Component} WrappedComponent - The component to wrap with personalization
 * @returns {React.Component} - The wrapped component with personalization capabilities
 */
const withPersonalizedPlacement = WrappedComponent => {
    class WithPersonalizedPlacement extends React.Component {
        constructor(props) {
            super(props);
        }

        /**
         * Determines if PersonalizedPlacement should be rendered
         * @returns {boolean} - Whether to show the personalization overlay
         */
        shouldShowPersonalizedPlacement() {
            const { personalization } = this.props;

            return (
                personalization?.isEnabled &&
                Location.isHomepage() &&
                cookieUtils.read(cookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE) &&
                Sephora?.configurationSettings?.isPreviewPersonalizationEnabled
            );
        }

        /**
         * Renders the PersonalizedPlacement overlay
         * @returns {React.Element|null} - The PersonalizedPlacement component or null
         */
        renderPersonalizedPlacement() {
            if (!this.shouldShowPersonalizedPlacement()) {
                return null;
            }

            // Use the same mergedProps logic as the Banner component to get the correct sid
            const mergedProps =
                this.props.nonTargettedPreviewIndex > -1
                    ? this.props.nonTargettedVariations[this.props.nonTargettedPreviewIndex - 1]
                    : this.props?.personalizedComponent?.variationData || this.props;

            const {
                isNBCEnabled,
                isNBOEnabled,
                isPersistentBanner,
                nonTargettedClick,
                personalization,
                activePage,
                nonTargettedPreviewIndex,
                nonTargettedVariations,
                personalizedComponent
            } = this.props;

            const { sid } = mergedProps;

            return (
                <PersonalizedPlacement
                    isPersistentBanner={isPersistentBanner}
                    nonTargettedClick={nonTargettedClick}
                    contextId={personalization?.context}
                    isNBCEnabled={isNBCEnabled}
                    isNBOEnabled={isNBOEnabled}
                    sid={sid}
                    activePage={activePage}
                    nonTargettedPreviewIndex={nonTargettedPreviewIndex}
                    nonTargettedVariations={nonTargettedVariations}
                    personalizedComponent={personalizedComponent?.p13n}
                    wrappedComponentProps={this.props}
                />
            );
        }

        render() {
            return (
                <div style={{ position: 'relative' }}>
                    {this.renderPersonalizedPlacement()}
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithPersonalizedPlacement.displayName = `withPersonalizedPlacement(${displayName})`;

    //  prop types for the HOC
    WithPersonalizedPlacement.propTypes = {
        // Personalization props
        personalization: PropTypes.object,
        isNBCEnabled: PropTypes.bool,
        isNBOEnabled: PropTypes.bool,
        isPersistentBanner: PropTypes.bool,
        nonTargettedClick: PropTypes.func,
        sid: PropTypes.string,
        activePage: PropTypes.string,
        nonTargettedPreviewIndex: PropTypes.number,
        nonTargettedVariations: PropTypes.array,
        personalizedComponent: PropTypes.object,

        ...WrappedComponent.propTypes
    };

    // default props for the HOC
    WithPersonalizedPlacement.defaultProps = {
        isNBCEnabled: false,
        isNBOEnabled: false,
        isPersistentBanner: false,
        nonTargettedClick: null,
        sid: null,
        activePage: null,
        nonTargettedPreviewIndex: -1,
        nonTargettedVariations: [],
        personalizedComponent: null,

        // Pass through all other default props to the wrapped component
        ...WrappedComponent.defaultProps
    };

    return WithPersonalizedPlacement;
};

export default withPersonalizedPlacement;
