import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import localeUtils from 'utils/LanguageLocale';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Copy from 'components/Content/Copy';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';
import FormValidator from 'utils/FormValidator';
import ErrorsUtils from 'utils/Errors';
import Empty from 'constants/empty';
import {
    Button, Text, Divider, Flex
} from 'components/ui';
import { borders, colors } from 'style/config';
import Debounce from 'utils/Debounce';
import TaxClaimUtils from 'utils/TaxClaim';
import TaxClaimErrorBanner from 'components/RichProfile/MyAccount/TaxClaim/TaxClaimErrorBanner';

const DEBOUNCE_DELAY = 200;

class OrderNumberInputStepEdit extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            visibleOrders: [],
            showMoreButton: false,
            showMoreOrders: false,
            maxOrdersError: false
        };
        this.inputRef = React.createRef();
        // Initialize the debounced function
        this.handleInputChangeDebounced = Debounce.debounce(this.handleInputChange, DEBOUNCE_DELAY);
    }

    componentDidMount() {
        if (TaxClaimUtils.isTaxExemptionEnabled()) {
            this.props.fetchEligibleOrders().then(() => {
                const { eligibleOrders } = this.props;

                if (eligibleOrders.length > 15) {
                    this.setState({
                        visibleOrders: eligibleOrders.slice(0, 15),
                        showMoreButton: true
                    });
                } else {
                    this.setState({ visibleOrders: eligibleOrders });
                }
            });
        }
    }

    handleInputChange = value => {
        this.props.handleOrderNumberChange(value);
        this.props.clearOrderNumberError();

        // Validate the order number to check for errors
        const orderNumberError = TaxFormValidator.validateOrderNumber(value, null, TaxClaimUtils.isTaxExemptionEnabled());

        if (!orderNumberError) {
            this.props.clearOrderNumberError();
        }
    };

    handleAddOrderSelection = value => {
        const { selectedOrders } = this.props.wizardFormData;

        if (selectedOrders.length === 10) {
            if (!this.state.maxOrdersError) {
                this.setState({ maxOrdersError: true });
            }

            return;
        }

        if (this.props?.formErrors?.orderNumberErrors?.length) {
            this.props.clearOrderNumberError();
        }

        this.props.updateSelectedOrders([...selectedOrders, value]);
    };

    handleRemoveOrderSelection = value => {
        if (this.state.maxOrdersError) {
            this.setState({ maxOrdersError: false });
        }

        this.props.updateSelectedOrders([...this.props.wizardFormData.selectedOrders].filter(order => order !== value));
    };

    handleChange = e => {
        // Call the debounced function with the new value
        this.handleInputChangeDebounced(e.target.value);
    };

    handleShwoMore = () => {
        this.setState({
            showMoreOrders: true,
            visibleOrders: this.props.eligibleOrders
        });
    };

    handleShowLess = () => {
        this.setState({
            showMoreOrders: false,
            visibleOrders: this.props.eligibleOrders.slice(0, 15)
        });
    };

    render() {
        const { wizardFormData, wizardFormErrors, nextStep, taxClaimGetText } = this.props;
        const { genericOrderNumberErrorExists = false, orderNumberErrors = null } = wizardFormErrors.formErrors || Empty.Object;
        const getResource = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');
        const labelText = getResource('orderNumberInputStepPlaceholder');
        const orderNumber = wizardFormData?.orderNumber;
        const selectedOrdersLabel = `${this.props.selectedHeader}: ${wizardFormData?.selectedOrders?.length}`;

        // Check if there's an error for the order number
        const hasError = Boolean(orderNumberErrors) || genericOrderNumberErrorExists;
        const hasEligibleOrdersError = this.props.eligibleOrdersError;

        // Extract error message properly: handle (Array || String)
        const errorMessage = Array.isArray(orderNumberErrors)
            ? ErrorsUtils.getMessage(orderNumberErrors[0])
            : ErrorsUtils.getMessage(orderNumberErrors);

        return (
            <>
                <Copy content={this.props.wizardFormData.ordersCopy} />
                {TaxClaimUtils.isTaxExemptionEnabled() && (
                    <>
                        {hasEligibleOrdersError ? (
                            <Text
                                is='p'
                                color='red'
                                css={styles.errorMessage}
                            >
                                {this.props.genericError}
                            </Text>
                        ) : (
                            <div position='relarive'>
                                <Divider
                                    css={styles.headerDivider}
                                    marginY={6}
                                />
                                <Flex gap='0px 24px'>
                                    <Text
                                        css={styles.dateColumn}
                                        fontWeight='bold'
                                    >
                                        {this.props.orderDateHeader}
                                    </Text>
                                    <Text
                                        css={styles.flexGrow}
                                        fontWeight='bold'
                                    >
                                        {this.props.orderNumberHeader}
                                    </Text>
                                    <Text>{selectedOrdersLabel}</Text>
                                </Flex>
                                {this.state.maxOrdersError && (
                                    <TaxClaimErrorBanner
                                        message={this.props.selectionError}
                                        sticky
                                    />
                                )}
                                <Divider
                                    css={styles.tableDivider}
                                    marginTop={2}
                                />
                                {this.state.visibleOrders.map(order => (
                                    <div key={order.orderNumber}>
                                        <Flex
                                            gap='0px 24px'
                                            paddingY={4}
                                            alignItems='center'
                                        >
                                            <Text css={styles.dateColumn}>{order.orderDate}</Text>
                                            <Text css={styles.flexGrow}>{order.orderNumber}</Text>
                                            {wizardFormData.selectedOrders.includes(order.orderNumber) ? (
                                                <Button
                                                    onClick={() => this.handleRemoveOrderSelection(order.orderNumber)}
                                                    variant='link'
                                                >
                                                    {this.props.deselect}
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => this.handleAddOrderSelection(order.orderNumber)}
                                                    variant='secondary'
                                                >
                                                    {this.props.select}
                                                </Button>
                                            )}
                                        </Flex>
                                        <Divider css={styles.tableDivider} />
                                    </div>
                                ))}
                                {this.state.showMoreButton && (
                                    <Button
                                        padding={0}
                                        marginTop={4}
                                        variant='link'
                                        onClick={this.state.showMoreOrders ? this.handleShowLess : this.handleShwoMore}
                                    >
                                        {this.state.showMoreOrders ? this.props.viewLess : this.props.viewMore}
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
                {!TaxClaimUtils.isTaxExemptionEnabled() && (
                    <>
                        <div style={styles.container}>
                            <TextInput
                                ref={this.inputRef}
                                placeholder={labelText}
                                value={orderNumber}
                                onChange={this.handleChange}
                                maxLength={TaxFormValidator.FIELD_LENGTHS.taxOrderId}
                                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                validateError={TaxFormValidator.validateOrderNumber}
                                invalid={hasError}
                                message={hasError ? errorMessage : ''}
                                type='number'
                            />
                        </div>
                    </>
                )}

                <Flex
                    justifyContent='flex-start'
                    alignItems='center'
                    marginTop={4}
                    gap={4}
                >
                    <Button
                        variant='primary'
                        onClick={nextStep}
                        width='177px'
                        disabled={hasEligibleOrdersError}
                    >
                        {taxClaimGetText('nextAction')}
                    </Button>
                    {TaxClaimUtils.isTaxExemptionEnabled() && !hasEligibleOrdersError && <Text>{selectedOrdersLabel}</Text>}
                </Flex>
            </>
        );
    }
}

class OrderNumberInputStepView extends BaseClass {
    render() {
        const { wizardFormErrors, taxClaimGetText, wizardFormData, eligibleOrders } = this.props;
        const hasError = Boolean(wizardFormErrors?.formErrors?.orderNumberErrors);
        const orderDate = wizardFormData?.orderDate;
        const selectedOrders = eligibleOrders.filter(order => wizardFormData.selectedOrders.includes(order.orderNumber));

        return (
            <div style={styles.container}>
                <div style={styles.grid}>
                    <div style={styles.column}>
                        <Text
                            is='p'
                            css={styles.title}
                        >
                            {taxClaimGetText('dateColumnTitle')}
                        </Text>
                        <Text
                            is='p'
                            css={styles.title}
                        >
                            {taxClaimGetText('orderNumberInputStepPlaceholder')}
                        </Text>
                    </div>
                    <Divider
                        style={styles.divider}
                        marginY={3}
                    />
                    {TaxClaimUtils.isTaxExemptionEnabled() &&
                        selectedOrders.map(order => (
                            <div
                                style={styles.column}
                                key={order.orderNumber}
                            >
                                <Text
                                    is='p'
                                    css={styles.value}
                                >
                                    {order.orderDate}
                                </Text>
                                <Text
                                    is='p'
                                    css={styles.value}
                                >
                                    {order.orderNumber}
                                </Text>
                            </div>
                        ))}

                    {!TaxClaimUtils.isTaxExemptionEnabled() && (
                        <div style={styles.column}>
                            <Text
                                is='p'
                                css={styles.value}
                            >
                                {orderDate}
                            </Text>
                            <Text
                                is='p'
                                css={styles.value}
                            >
                                {wizardFormData?.orderNumber}
                            </Text>
                        </div>
                    )}
                </div>

                {hasError && (
                    <Text
                        is='p'
                        color='red'
                        css={styles.errorMessage}
                    >
                        {ErrorsUtils.getMessage(wizardFormErrors.formErrors.orderNumberErrors[0])}
                    </Text>
                )}
            </div>
        );
    }
}

const styles = {
    container: {
        marginTop: '1rem'
    },
    grid: {
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        width: '100%'
    },
    column: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: 'max-content'
    },
    title: {
        marginBottom: '0.5rem',
        marginRight: '7rem'
    },
    value: {
        marginBottom: '0.5rem',
        marginRight: '3rem'
    },
    divider: {
        gridColumn: '1 / 4', // Span all three columns
        width: '100%', // Ensure it spans the full width
        color: '#D9D9D9' // From Figma
    },
    errorMessage: {
        marginTop: '1rem'
    },
    headerDivider: {
        border: borders[2],
        borderColor: colors.lightGray
    },
    tableDivider: {
        gridColumn: 'span 3',
        borderBottom: borders[1],
        borderColor: colors.lightGray
    },
    dateColumn: {
        display: 'block',
        width: '110px'
    },
    flexGrow: {
        flexGrow: 1
    }
};

const OrderNumberInputStepEditWrapped = wrapComponent(OrderNumberInputStepEdit, 'OrderNumberInputStepEdit');
const OrderNumberInputStepViewWrapped = wrapComponent(OrderNumberInputStepView, 'OrderNumberInputStepView');

export {
    OrderNumberInputStepEditWrapped, OrderNumberInputStepViewWrapped
};
