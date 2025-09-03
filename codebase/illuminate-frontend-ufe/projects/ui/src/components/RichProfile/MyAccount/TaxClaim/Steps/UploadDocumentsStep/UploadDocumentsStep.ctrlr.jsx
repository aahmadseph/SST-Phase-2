import React, { createRef } from 'react';
import {
    Box, Button, Grid, Icon, Text
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import Copy from 'components/Content/Copy';
import Radio from 'components/Inputs/Radio/Radio';
import { wrapComponent } from 'utils/framework';
import {
    colors, fontSizes, fontWeights, space
} from 'style/config';
import Empty from 'constants/empty';
import UploadDocumentsUtils from 'utils/taxExemption/uploadDocumentsUtils';

class UploadDocumentsStepEdit extends BaseClass {
    constructor(props) {
        super(props);
        this.fileInputRef = createRef();
        this.state = {
            uploadDocuments: this.props?.uploadedTaxDocuments,
            currentFileTotalSize: 0,
            isNextClicked: false,
            documentDescCode: null,
            freightForwarder: null,
            formErrors: {
                invalidFile: null,
                missingFreightForwarder: null
            }
        };
    }

    triggerFileInput = () => {
        this.fileInputRef.current?.click();
    };

    componentWillUnmount() {
        // Preserve existing files and clear errors
        this.updateStepDataWithErrors(this.props.wizardFormData.uploadedTaxDocuments, {
            invalidFile: null
        });
    }

    updateStepDataWithErrors = (filesToUpdate, formErrors = {}) => {
        this.setState(prevState => ({ ...prevState, uploadDocuments: filesToUpdate, formErrors }));
    };

    handleFileChange = event => {
        const files = this.state?.uploadDocuments || Empty.Array;
        const file = event.target.files[0];

        const {
            isValid,
            errors,
            newFiles,
            newSize: currentFileTotalSize
        } = UploadDocumentsUtils.validateFileChange(file, files, this.state.currentFileTotalSize);

        if (isValid) {
            this.updateStepDataWithErrors(newFiles);
            this.setState({ currentFileTotalSize });
        } else {
            this.updateStepDataWithErrors(files, errors);
        }

        this.fileInputRef.current.value = '';
    };

    handleFileDelete = (fileToDelete, index) => {
        if (fileToDelete) {
            const files = [...this.state.uploadDocuments];
            files.splice(index, 1);
            this.updateStepDataWithErrors(files);

            this.setState({
                currentFileTotalSize: files.reduce((totalSize, file) => totalSize + file.size, 0)
            });

            this.fileInputRef.current.value = '';
        }
    };

    updateDocumentDescCode = value => {
        const documentDescCodeMap = {
            ZIP_CODE: 'ESFFF_A',
            FLORIDA: 'ESFFF_B',
            CERTIFICATE: 'ESFFF_C'
        };
        const documentDescCode = documentDescCodeMap[value];

        if (documentDescCode) {
            this.setState({ documentDescCode });
        }
    };

    handleRadioChange = () => event => {
        const { value } = event.target;
        this.setState({ freightForwarder: value });
        this.updateDocumentDescCode(value);

        const formErrors = value ? { missingFreightForwarder: null } : { missingFreightForwarder: this.props.missingFreightForwarder };

        this.updateStepDataWithErrors(this.state.uploadDocuments, formErrors);
    };

    submit = async () => {
        const { isValid, errors } = UploadDocumentsUtils.validateStep({
            uploadDocuments: this.state.uploadDocuments,
            freightForwarder: this.state.freightForwarder,
            validateFreightForwarder: this.props.isFreightForwarderSelected
        });

        const { freightForwarder, documentDescCode, uploadDocuments } = this.state;
        this.setState({ isNextClicked: true });

        if (!isValid) {
            this.setState(prevState => ({ ...prevState, formErrors: errors }));
        } else {
            this.props.handleFreightForwarderChange(freightForwarder);
            this.props.updateStep4Data('esfff', 'documentDescCode', documentDescCode);
            this.props.addWizardFormData(this.props.currentCategory, {
                stepData: [
                    {
                        currentStep: 1,
                        formData: {
                            uploadDocuments: uploadDocuments,
                            selectedFreightForwarderType: freightForwarder
                        }
                    }
                ]
            });

            await this.props.nextStep();
        }
    };

    render() {
        const { uploadDocuments, freightForwarder } = this.state;
        const { items, uploadCopy, isFreightForwarderSelected } = this.props;
        const { invalidFile, missingFreightForwarder } = this.state.formErrors;
        const uploadedDocumentsLength = uploadDocuments?.length;

        return (
            <Grid>
                <Copy
                    content={uploadCopy}
                    marginTop={3}
                    marginBottom={2}
                />
                {isFreightForwarderSelected ? (
                    <Box>
                        {this.state.isNextClicked && missingFreightForwarder && (
                            <Text
                                css={styles.error}
                                role='alert'
                                aria-live='assertive'
                            >
                                {this.props.missingFreightForwarder}
                            </Text>
                        )}

                        <Grid gap={[0, 3, 3]}>
                            {items.map(([key, value]) => (
                                <Grid
                                    item
                                    key={key}
                                >
                                    <Radio
                                        name='freightForwarderType'
                                        value={key}
                                        checked={key === freightForwarder}
                                        onChange={this.handleRadioChange(key)}
                                        aria-labelledby={`freightForwarder-${key}`}
                                        css={styles.radioStyles}
                                    >
                                        <Text
                                            id={`freightForwarder-${key}`}
                                            children={value}
                                        />
                                    </Radio>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : null}

                <Box>
                    <Box marginBottom='8px'>
                        <Text css={styles.hint}>{this.props.maxDocumentsHint}</Text>
                    </Box>

                    <Box>
                        <Text>{this.props.documentLabel}</Text>
                    </Box>

                    {uploadDocuments && uploadDocuments.length
                        ? uploadDocuments.map((file, index) => (
                            <Grid
                                key={`${file.name}-${index}`}
                                columns='auto 1fr auto'
                                marginY='8px'
                                alignItems='center'
                            >
                                <Icon
                                    name='files'
                                    aria-hidden={true}
                                />{' '}
                                {/* Decorative icon */}
                                <p css={styles.documentLabel}>{file.name}</p>
                                <Box
                                    width={12}
                                    height={12}
                                >
                                    <Icon
                                        css={styles.trash}
                                        name={'trash'}
                                        onClick={() => this.handleFileDelete(file, index)}
                                        size={40}
                                        aria-label={`Delete ${file.name}`}
                                    />
                                </Box>
                            </Grid>
                        ))
                        : null}
                </Box>

                {invalidFile && (
                    <Text
                        css={styles.error}
                        role='alert'
                        aria-live='assertive'
                    >
                        {this.props.taxClaimGetText('invalidFile')}
                    </Text>
                )}

                <input
                    accept='.jpeg,.jpg,.png,.img,.pdf'
                    type='file'
                    hidden
                    ref={this.fileInputRef}
                    onChange={this.handleFileChange}
                    aria-label={this.props.taxClaimGetText('fileUpload')}
                />
                <div css={styles.buttonContainer}>
                    <Button
                        variant='secondary'
                        width='177px'
                        onClick={this.triggerFileInput}
                        disabled={uploadedDocumentsLength >= UploadDocumentsUtils.MAX_FILES_ALLOWED}
                    >
                        {this.props.taxClaimGetText('uploadAction')}
                    </Button>
                    {uploadedDocumentsLength || isFreightForwarderSelected ? (
                        <Button
                            css={styles.nextButton}
                            variant='primary'
                            onClick={this.submit}
                            width='177px'
                        >
                            {this.props.taxClaimGetText('nextAction')}
                        </Button>
                    ) : null}
                </div>
            </Grid>
        );
    }
}

class UploadDocumentsStepView extends BaseClass {
    render() {
        const { uploadedTaxDocuments, emptyText } = this.props;

        return (
            <Grid marginTop='24px'>
                {uploadedTaxDocuments && uploadedTaxDocuments.length ? (
                    uploadedTaxDocuments.map((file, index) => (
                        <Grid
                            key={`${file.name}-${index}`}
                            columns='auto 1fr'
                            alignItems='center'
                        >
                            <Icon
                                name='files'
                                aria-hidden={true}
                            />{' '}
                            {/* Decorative icon */}
                            <p>{file.name}</p>
                        </Grid>
                    ))
                ) : (
                    <Text>{emptyText}</Text>
                )}
            </Grid>
        );
    }
}

const styles = {
    text: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal
    },
    hint: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red
    },
    trash: {
        cursor: 'pointer'
    },
    buttonContainer: {
        display: 'flex',
        padding: `0 ${space[4]}`
    },
    nextButton: {
        marginLeft: space[4]
    },
    documentLabel: {
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'normal'
    },
    radioStyles: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row'
    }
};

const UploadDocumentsStepEditWrapped = wrapComponent(UploadDocumentsStepEdit, 'UploadDocumentsStepEdit', true);
const UploadDocumentsStepViewWrapped = wrapComponent(UploadDocumentsStepView, 'UploadDocumentsStepView', true);

export {
    UploadDocumentsStepEditWrapped, UploadDocumentsStepViewWrapped
};
