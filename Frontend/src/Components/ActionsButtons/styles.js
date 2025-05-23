const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Consolas",
    },
    
    actionsWrapper: {
        marginTop: "12px",
    },
    statusWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "10px",
    },
    status: {
        fontWeight: "bold",
        marginBottom: "12px",
        fontSize: "14px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
    },
    button: {
        flex: 1,
        padding: "12px",
        border: "none",
        background: "#61bbfb",
        color: "black",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background 0.3s",
    },
    buttonHover: {
        background: "#2c3e9c",
    },

    deleteRequestButton: {
        padding: "6px 12px",
        backgroundColor: "#ff4d4f",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default styles;
