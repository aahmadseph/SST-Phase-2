import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, modal } from 'style/config';
import Chevron from 'components/Chevron/Chevron';

function ModalBack(props) {
    return (
        <button
            css={styles}
            data-at={Sephora.debug.dataAt('back_btn')}
            onClick={props.onClick}
        >
            <Chevron
                direction='left'
                isThicker={true}
            />
        </button>
    );
}

const styles = {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 16,
    paddingLeft: space[4],
    paddingRight: space[4],
    height: modal.headerHeight,
    lineHeight: 0
};

export default wrapFunctionalComponent(ModalBack, 'ModalBack');
