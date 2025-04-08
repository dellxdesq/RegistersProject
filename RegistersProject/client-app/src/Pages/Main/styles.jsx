const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Consolas",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#282c34",
    },
    navButton: {
        backgroundColor: "#61bbfb",
        border: "none",
        color: "#000",
        padding: "10px 16px",
        fontSize: "16px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    content: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    searchInput: {
        width: "300px",
        padding: "10px",
        fontSize: "16px",
        marginBottom: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
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
};

export default styles;
