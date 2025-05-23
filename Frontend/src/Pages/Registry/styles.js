const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Consolas",
    },
    container: {
        flex: 1,
        padding: "20px 40px",
        overflow: "hidden",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "auto",
        paddingRight: "10px",
    },

    tableWrapper: {
        position: "relative",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
    },
    fullViewButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "6px 12px",
        fontSize: "14px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default styles;
