const styles = {
    overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 0.3s ease-in-out',
    zIndex: 999,
    },
    modal: {
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        animation: 'scaleIn 0.3s ease-in-out',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontFamily: 'inherit',
    },
    textarea: {
        width: '100%',
        height: '100px',
        padding: '1px',
        resize: 'none',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontFamily: 'inherit',
    },
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        marginTop: '10px',
    },
    upload: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    cancel: {
        backgroundColor: '#ccc',
        color: '#333',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    addButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },

    userList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '10px',
    },

    userItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '14px',
    },

    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        fontSize: '12px',
    },

};

export default styles;
