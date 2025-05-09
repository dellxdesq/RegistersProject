const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        height: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
    },
    search: {
        width: "350px",
        padding: "8px",
        marginBottom: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    listItem: {
        padding: "10px",
        borderBottom: "1px solid #eee",
    },
    closeButton: {
        marginTop: "10px",
        padding: "8px 16px",
        backgroundColor: "#ccc",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

export default modalStyles;
