export async function getFullRegistryFile(fileName, token) {
    const response = await fetch(`https://localhost:8081/api/v1/file-preview/${fileName}/full`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Ошибка при получении полного файла");
    }

    return await response.json();
}
