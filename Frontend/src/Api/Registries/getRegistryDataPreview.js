export async function getFilePreview(fileName, token) {
    const response = await fetch(`https://localhost:8081/api/v1/file-preview/${fileName}/preview`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Ошибка получения превью файла: ${text}`);
    }

    return await response.json();
}
