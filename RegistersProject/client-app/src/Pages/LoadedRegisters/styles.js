const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Consolas",
    },

    content: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    listContainer: {
        width: "100%",
        maxWidth: "500px",
        height: "500px",
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
    },
    listItem: {
        padding: "10px",
        marginBottom: "6px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    },

    uploadWrapper: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },

    uploadButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 24px",
        border: "none",
        borderRadius: "25px",
        cursor: "pointer",
        fontSize: "16px",
        fontFamily: "Consolas",
        transition: "background-color 0.3s ease",
    },
};

export default styles;