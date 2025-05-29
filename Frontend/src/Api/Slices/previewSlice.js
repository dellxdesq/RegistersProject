export async function previewSlice(filename, body) {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`https://localhost:8081/api/v1/file-preview/${filename}/slice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error("Ошибка при предпросмотре среза");

        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}
