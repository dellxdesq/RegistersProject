const sliceStyles = {
    page :{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Consolas",
    },
    container: {
        padding: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    },
    th: {
        border: "1px solid #ccc",
        padding: "8px",
        backgroundColor: "#f5f5f5",
        textAlign: "left",
    },
    td: {
        border: "1px solid #ddd",
        padding: "8px",
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
    },
    backButton: {
        padding: "10px 20px",
        backgroundColor: "#ccc",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    downloadButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default sliceStyles;
