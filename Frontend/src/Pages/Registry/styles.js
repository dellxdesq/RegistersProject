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
        marginTop: "1px",
        marginBottom: "20px",
        textAlign: "left",
        marginLeft: "16px",
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
    
};

export default styles;
