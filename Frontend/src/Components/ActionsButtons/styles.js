const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Consolas",
    },
    
    actionsWrapper: {
        
    },
    statusWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        
    },
    status: {
        fontWeight: "bold",
        marginBottom: "12px",
        fontSize: "14px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        marginTop: "-3px",
    },

    disabledButton: {
        color: "#aaa",
        cursor: "not-allowed",
    },
    deleteRequestButton: {
        padding: "6px 12px",
        backgroundColor: "#ff4d4f",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },

    iconButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "15px",
        fontSize: "18px",
        cursor: "pointer",
    }


};

export default styles;
