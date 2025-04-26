export async function fetchRegistryById(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://localhost:8081/api/v1/registries/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 403) {
        throw new Error("��� ������� � �������");
    }

    if (!response.ok) {
        throw new Error("������ �������� �������");
    }

    const data = await response.json();
    return data;
}