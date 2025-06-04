export async function getSlicesByRegistry(registryId, token) {
    try {
        const response = await fetch(`https://localhost:8081/api/v1/registries/${registryId}/slices`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`������ ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("������ ��� ��������� ������ �� �������:", error);
        throw error;
    }
}
