import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { mediaQueries } from 'style/config';
import Modal from 'components/Modal/Modal';
import { Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';
import store from 'store/Store';
import actions from 'Actions';
import wizardActions from 'actions/WizardActions';

const { Media } = mediaUtils;

const BACK_BUTTON_HEIGHT = 60;

const Wizard = props => {
    const getText = localeUtils.getLocaleResourceFile('components/Wizard/locales', 'Wizard');

    const dismissModal = () => {
        store.dispatch(actions.showWizard(false));

        if (props.resetOnClose) {
            store.dispatch(wizardActions.changeCurrentPage(0));
        }
    };

    const goToPreviousPage = () => {
        store.dispatch(wizardActions.goToPreviousPage());
    };

    const { modalTitle, currentPage, isOpen, content } = props;

    const isFirstScreen = currentPage === 0;

    return (
        <Modal
            isOpen={isOpen}
            width={4}
            onDismiss={dismissModal}
            noScroll={true}
            customStyle={
                isFirstScreen && {
                    /* vertically align the steps when height differs */
                    inner: {
                        [mediaQueries.sm]: {
                            marginBottom: BACK_BUTTON_HEIGHT
                        }
                    }
                }
            }
        >
            <Modal.Header>
                {isFirstScreen || <Modal.Back onClick={goToPreviousPage} />}
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body
                paddingX={null}
                paddingTop={null}
                paddingBottom={null}
                height={472}
                display='flex'
                flexDirection='column'
                overflow='hidden'
            >
                {content[currentPage]}
            </Modal.Body>
            {isFirstScreen || (
                <Media greaterThan='xs'>
                    <Modal.Footer
                        hasBorder={true}
                        paddingY={[0, 0]}
                    >
                        <Link
                            color='blue'
                            height={BACK_BUTTON_HEIGHT}
                            paddingX={4}
                            marginX={-4}
                            onClick={goToPreviousPage}
                            children={getText('back')}
                        />
                    </Modal.Footer>
                </Media>
            )}
        </Modal>
    );
};

export default wrapFunctionalComponent(Wizard, 'Wizard');
