/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import anaUtils from 'analytics/utils';
import BaseClass from 'components/BaseClass';
// Global launcher promise to be reused across the SPA
let launcherPromise = null;

// ROKT Web SDK Component - SPA Implementation (Recommended Approach)
class RoktAdPlacement extends BaseClass {
    constructor(props) {
        super(props);

        const { identifier, accountId } = props;

        this.accountId = accountId;
        this.identifier = identifier;
        this.selection = null;
        this.roktContainerRef = React.createRef();
    }

    shouldComponentUpdate() {
        return false; // Prevent Component from re-rendering
    }

    componentDidMount() {
        this.initializeRoktAndShowPlacement();
    }

    componentWillUnmount() {
        // Clean up placement when leaving the page
        if (this.selection) {
            this.selection.close();
        }
    }

    // Initialize Rokt SDK if not already done, then show placement
    initializeRoktAndShowPlacement = async () => {
        try {
            // Create launcher promise if it doesn't exist
            if (!launcherPromise) {
                launcherPromise = this.createLauncherPromise();
            }

            // Wait for launcher to be ready
            const launcher = await launcherPromise;

            // Trigger placement selection
            await this.showPlacement(launcher);
        } catch (error) {
            // Error handling - log but don't break the page
            throw error;
        }
    };

    // Create the launcher promise (only done once per SPA session)
    createLauncherPromise = () => {
        return new Promise((resolve, reject) => {
            // Check if Rokt is already loaded
            if (window.Rokt) {
                const { orderDetails } = this.props;
                const attributes = this.buildAttributes(orderDetails);
                resolve(
                    window.Rokt.createLauncher({
                        accountId: this.accountId,
                        sandbox: this.isQAEnvironment(),
                        attributes: attributes
                    })
                );

                return;
            }

            // Load Rokt script if not already loaded
            const existingScript = document.getElementById('rokt-launcher');

            if (existingScript) {
                // Script exists, wait for it to load
                existingScript.onload = () => {
                    const { orderDetails } = this.props;
                    const attributes = this.buildAttributes(orderDetails);
                    resolve(
                        window.Rokt.createLauncher({
                            accountId: this.accountId,
                            sandbox: this.isQAEnvironment(),
                            attributes: attributes
                        })
                    );
                };
                existingScript.onerror = reject;

                return;
            }

            // Create and load the script
            const target = document.head || document.body;
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://apps.rokt.com/wsdk/integrations/launcher.js';
            script.fetchPriority = 'high';
            script.crossOrigin = 'anonymous';
            script.async = true;
            script.id = 'rokt-launcher';

            script.onload = () => {
                const { orderDetails } = this.props;
                const attributes = this.buildAttributes(orderDetails);

                resolve(
                    window.Rokt.createLauncher({
                        accountId: this.accountId,
                        sandbox: this.isQAEnvironment(),
                        attributes: attributes
                    })
                );
            };
            script.onerror = reject;

            target.appendChild(script);
        });
    };

    // Trigger placement selection
    showPlacement = async launcher => {
        try {
            const { orderDetails } = this.props;
            const attributes = await this.buildAttributes(orderDetails);

            this.selection = await launcher.selectPlacements({
                identifier: this.identifier,
                attributes
            });
        } catch (error) {
            // Error handling - log but don't break the page
            throw error;
        }
    };

    isQAEnvironment = () => {
        const isQA = Sephora.UFE_ENV !== 'PROD';

        return isQA;
    };

    buildAttributes = async orderDetails => {
        const { header, shippingGroups, paymentGroups } = orderDetails;

        // Extract addresses
        const shippingAddress = shippingGroups?.shippingGroupsEntries?.[0]?.shippingGroup?.address;
        const billingAddress = paymentGroups?.paymentGroupsEntries?.[0]?.paymentGroup?.address;
        const email = await anaUtils.hashString(header.profile.login ?? billingAddress?.email);
        const firstname = header.profile.firstName ?? billingAddress?.firstName;
        const lastname = header.profile.lastName ?? billingAddress?.lastName;
        const billingzipcode = billingAddress?.postalCode || shippingAddress?.postalCode || '';
        const country = this.isQAEnvironment() ? header.profile.profileLocale : undefined;
        const language = this.isQAEnvironment() ? header.profile.language : undefined;

        return {
            emailsha256: email,
            firstname,
            lastname,
            billingzipcode,
            country,
            language
        };
    };

    render() {
        return (
            <div
                id='rokt-container'
                ref={this.roktContainerRef}
            ></div>
        );
    }
}

RoktAdPlacement.propTypes = {
    orderDetails: PropTypes.shape({
        header: PropTypes.shape({
            orderId: PropTypes.string,
            orderLocale: PropTypes.string,
            isGuestOrder: PropTypes.bool,
            isRopisOrder: PropTypes.bool,
            isBopisOrder: PropTypes.bool,
            isSameDayOrder: PropTypes.bool,
            profile: PropTypes.shape({
                email: PropTypes.string,
                beautyInsiderAccount: PropTypes.shape({
                    biAccountId: PropTypes.string
                })
            }),
            guestProfile: PropTypes.shape({
                email: PropTypes.string
            })
        }),
        shippingGroups: PropTypes.shape({
            shippingGroupsEntries: PropTypes.arrayOf(
                PropTypes.shape({
                    shippingGroup: PropTypes.shape({
                        address: PropTypes.shape({
                            firstName: PropTypes.string,
                            lastName: PropTypes.string,
                            postalCode: PropTypes.string
                        })
                    })
                })
            )
        }),
        paymentGroups: PropTypes.shape({
            paymentGroupsEntries: PropTypes.arrayOf(
                PropTypes.shape({
                    paymentGroup: PropTypes.shape({
                        address: PropTypes.shape({
                            firstName: PropTypes.string,
                            lastName: PropTypes.string,
                            postalCode: PropTypes.string
                        })
                    })
                })
            )
        }),
        priceInfo: PropTypes.shape({
            orderTotal: PropTypes.string,
            merchandiseSubtotal: PropTypes.string
        }),
        items: PropTypes.shape({
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    sku: PropTypes.shape({
                        categoryName: PropTypes.string,
                        brandName: PropTypes.string
                    })
                })
            ),
            earnedPoints: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            redeemedPoints: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            netBeautyBankPointsAvailable: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    })
};

RoktAdPlacement.defaultProps = {
    orderDetails: null
};

export default RoktAdPlacement;
