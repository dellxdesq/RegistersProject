const styles = {
    container: {
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        fontSize: 14,
    },
    infoRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
    },
    infoItem: {
        whiteSpace: "nowrap",
    },
    descriptionRow: {
        marginTop: "10px",
        maxWidth: "650px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "#333",
    },
    descriptionText: {
        marginLeft: "5px",
    },
    buttonRow: {
        marginTop: "10px",
    },
    fullViewButton: {
        padding: "6px 12px",
        backgroundColor: "#61bbfb",
        color: "black",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    },
    closeButton: {
        marginTop: "10px",
        padding: "6px 12px",
        backgroundColor: "#ff4d4f",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
    },
};

export default styles;
