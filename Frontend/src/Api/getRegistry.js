export async function fetchRegistries() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("����� �����������");
    }

    try {
        const response = await fetch("https://localhost:8081/api/v1/registries", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`������ �������� ��������: ${response.status}`);
        }

        const data = await response.json();
        return data; // ��� ����� ������ ��������

    } catch (error) {
        console.error("������ ��� ��������� ��������:", error);
        throw error;
    }
}
