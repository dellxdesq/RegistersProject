const styles = {
    registerPage: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f2f2f2",
    },
    registerContainer: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
    },
    registerTitle: {
        fontSize: "28px",
        marginBottom: "20px",
        fontWeight: "bold",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
        textAlign: "left",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderBottom: "1px solid #ccc",
        outline: "none",
    },
    registerButton: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        border: "none",
        borderRadius: "25px",
        background: "linear-gradient(to right, #00c6ff, #7f00ff)",
        color: "#fff",
        cursor: "pointer",
        marginTop: "10px",
    },
};

export default styles;
