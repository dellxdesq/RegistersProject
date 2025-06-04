export async function saveSliceToDB(registerId, sliceData) {
    try {
        const token = localStorage.getItem("access_token")
        const response = await fetch(`https://localhost:8081/api/v1/registries/${registerId}/slice/add`, {
            method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            body: JSON.stringify(sliceData)
        });

        if (!response.ok) throw new Error("Ошибка при сохранении среза");

        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}
