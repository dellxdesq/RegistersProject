export async function addRegistry(data, token) {
    try {
        const response = await fetch('https://localhost:8081/api/v1/registries/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при добавлении реестра');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка отправки реестра:', error);
        throw error;
    }
}
