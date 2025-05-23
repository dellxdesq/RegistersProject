import { authFetch } from "../authFetch";

export async function fetchUserRegistries(userId) {
    const url = `/registries/user/${userId}`;

    try {
        const response = await authFetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`������ ��� ��������� ��������: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("������ �������:", error);
        throw error;
    }
}
