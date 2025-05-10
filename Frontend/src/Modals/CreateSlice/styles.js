const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    modal: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "12px",
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    },
    label: {
        display: "block",
        marginTop: "15px",
        marginBottom: "5px",
        fontWeight: "bold"
    },
    input: {
        width: "287px",
        padding: "8px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "4px"
    },
    selectMultiple: {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginBottom: "15px",
        height: "100px"
    },
    conditionsWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "20px"
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between"
    },
    createButton: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    closeButton: {
        padding: "10px 20px",
        backgroundColor: "#aaa",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default styles;
