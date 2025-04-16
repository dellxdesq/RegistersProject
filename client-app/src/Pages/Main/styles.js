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
};

export default styles;
