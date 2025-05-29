export async function viewSlice(filename) {
    try {
        const token = localStorage.getItem("access_token")
        const response = await fetch(`https://localhost:8081/api/v1/file-preview/${filename}/slice/view`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        
        if (!response.ok) throw new Error("Ошибка при получении предпросмотра среза");

        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}
