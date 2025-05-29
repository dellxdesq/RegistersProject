export async function confirmSlice(filename) {
    try {
        const token = localStorage.getItem("access_token")
        const response = await fetch(`https://localhost:8081/api/v1/file-preview/${filename}/slice/confirm`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error("Ошибка при подтверждении среза");

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
