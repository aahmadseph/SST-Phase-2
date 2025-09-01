import React from 'react';
import { useAgentAwareContext } from 'hooks';
import { MODAL_NAMES } from 'constants/Modals';

//This components shows the AgentAwareBanner with all the information about the user that is logged in
//You can find information in localStorage.getItem('UserData')
const Customer = () => {
    const { showModal, dispatch, state, changeNoteType } = useAgentAwareContext();
    const { user = {} } = state;
    const userData = { ...user };

    const customerStyles = {
        display: 'flex',
        height: '55px',
        padding: '0 15px',
        background: '#FFF9E6',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '700',
        gap: '10px'
    };

    const logoutStyles = {
        color: '#136BEA',
        textDecoration: 'underline'
    };

    const flagStyles = {
        width: '24px',
        height: '18px'
    };

    const notesStyles = {
        position: 'absolute',
        right: '15px',
        padding: '5px 20px',
        border: '2px solid #000000',
        borderRadius: '25px'
    };

    if (!userData?.data) {
        return null;
    }

    return (
        <>
            <div style={customerStyles}>
                {userData && userData.data && userData.data.profile && (
                    <img
                        style={flagStyles}
                        src={userData.data.profile.profileLocale === 'US' ? '/img/ufe/flags/us.svg' : '/img/ufe/flags/ca.svg'}
                        alt='Flag'
                    />
                )}
                {userData && userData.data && userData.data.profile.login ? (
                    <>
                        <p>
                            {`You are viewing ${userData.data.profile.firstName} ${userData.data.profile.lastName}'s 
                            (${userData.data.profile.login}) account.`}
                        </p>
                        <button
                            style={logoutStyles}
                            onClick={() => showModal(MODAL_NAMES.LOGOUT)}
                        >
                            Sign out and exit Sephora.com
                        </button>
                        <button
                            style={notesStyles}
                            onClick={() => {
                                dispatch(changeNoteType('profile'));
                                showModal(MODAL_NAMES.ADD_NOTE);
                            }}
                        >
                            Add Account Notes
                        </button>
                    </>
                ) : (
                    <p>Log in to start.</p>
                )}
            </div>
        </>
    );
};

export default Customer;
