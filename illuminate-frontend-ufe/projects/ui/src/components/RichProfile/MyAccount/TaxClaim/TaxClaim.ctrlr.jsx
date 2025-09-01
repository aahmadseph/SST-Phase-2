/* eslint-disable class-methods-use-this */
import React from 'react';
import MediaUtils from 'utils/Media';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Button, Container, Divider, Text, Flex
} from 'components/ui';
import Logo from 'components/Logo/Logo';
import Copy from 'components/Content/Copy';
import {
    borders, colors, fontSizes, fontWeights, lineHeights, shadows, mediaQueries
} from 'style/config';
import { withEnsureUserIsSignedIn } from 'hocs/withEnsureUserIsSignedIn';
import WizardForm from 'components/RichProfile/MyAccount/TaxClaim/WizardForm';
import TaxClaimErrorBanner from 'components/RichProfile/MyAccount/TaxClaim/TaxClaimErrorBanner';

const { Media } = MediaUtils;

class TaxClaim extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            applicationStarted: false
        };
    }

    handleStartApplication = async () => {
        const { initTaxFlow } = this.props;
        const initResponse = await initTaxFlow();

        if (initResponse) {
            this.setState({ applicationStarted: true });
        }
    };

    render() {
        const {
            title,
            subTitle,
            content,
            addWizardFormData,
            wizardFormData,
            wizardFormErrors,
            getOrderDetails,
            userGeneralData,
            startAppText,
            userIsLoggedIn,
            updateStep4Data,
            submitFinalTaxForm,
            step4VariationData,
            categoryTypes,
            replaceLocation,
            taxSubmitApiResponses,
            handleApiSubmitError,
            initAppErrorText,
            addShippingAddress,
            setDefaultShippingAddress
        } = this.props;

        const { applicationStarted } = this.state;
        const displayWizardForm = userIsLoggedIn && applicationStarted;
        const StartButton = () => (
            <Button
                block={true}
                variant='primary'
                onClick={this.handleStartApplication}
            >
                {startAppText}
            </Button>
        );

        return (
            <Box>
                <Flex
                    flex='none'
                    justifyContent='center'
                    paddingY={[4, 6]}
                    boxShadow='0 1px 4px 0 var(--color-darken2)'
                >
                    <Logo />
                </Flex>
                <Container
                    paddingBottom={5}
                    hasLegacyWidth={true}
                >
                    <Box paddingY={5}>
                        {initAppErrorText ? <TaxClaimErrorBanner message={initAppErrorText} /> : null}
                        <Flex gap='16px'>
                            <Box flexGrow={1}>
                                <Text
                                    is='h1'
                                    css={styles.subhead}
                                >
                                    {title}
                                </Text>
                            </Box>
                            <Media greaterThan='xs'>
                                <Box>
                                    {/* Show button only if user is logged in and application has not started */}
                                    {userIsLoggedIn && !applicationStarted && <StartButton />}
                                </Box>
                            </Media>
                        </Flex>
                        <Divider
                            marginY='24px'
                            borderColor={colors.black}
                            borderBottom={borders[2]}
                        />

                        {!applicationStarted && subTitle && (
                            <Text
                                is='h2'
                                css={styles.subtitle}
                            >
                                {subTitle}
                            </Text>
                        )}
                    </Box>

                    {!applicationStarted && (
                        <Box css={styles.content}>
                            <Copy content={content} />
                        </Box>
                    )}

                    {displayWizardForm ? (
                        <WizardForm
                            addWizardFormData={addWizardFormData}
                            wizardFormData={wizardFormData}
                            wizardFormErrors={wizardFormErrors}
                            getOrderDetails={getOrderDetails}
                            userGeneralData={userGeneralData}
                            updateStep4Data={updateStep4Data}
                            submitFinalTaxForm={submitFinalTaxForm}
                            step4VariationData={step4VariationData}
                            categoryTypes={categoryTypes}
                            replaceLocation={replaceLocation}
                            taxSubmitApiResponses={taxSubmitApiResponses}
                            handleApiSubmitError={handleApiSubmitError}
                            selectedCategory={wizardFormData.currentCategory}
                            addShippingAddress={addShippingAddress}
                            setDefaultShippingAddress={setDefaultShippingAddress}
                        />
                    ) : null}

                    <Media lessThan='sm'>
                        {/* Show button only if user is logged in and application has not started */}
                        {userIsLoggedIn && !applicationStarted && (
                            <div css={styles.mobileButtonContainer}>
                                <StartButton />
                            </div>
                        )}
                    </Media>
                </Container>
            </Box>
        );
    }
}

const styles = {
    subhead: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold
    },
    subtitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold
    },
    content: {
        lineHeight: lineHeights.tight,
        [mediaQueries.xsMax]: {
            marginBottom: '60px'
        }
    },
    mobileButtonContainer: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 16px',
        boxShadow: shadows.light,
        backgroundColor: 'white'
    }
};

const TaxClaimComponent = wrapComponent(TaxClaim, 'TaxClaim', true);

export default withEnsureUserIsSignedIn(TaxClaimComponent);
