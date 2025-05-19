import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function getUploadedAccessRegistries() {
    const url = "https://localhost:8081/api/v1/registries/list/uploaded/acces-level/2-3";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`������ ��� ��������� ��������: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("������ ��� ������� ����������� �������� � �������� 2 � 3:", error);
        return { success: false, error: error.message };
    }
}
