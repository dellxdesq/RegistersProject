import { authFetch } from "../authFetch";
export async function getRequestedAccess() {
    try {
        const response = await authFetch("/registries/requests-access", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("������ ��� ��������� ��������");
        }

        const data = await response.json();
        return data.map(({ username, userId, registryName, requestId, registryId }) => ({
            username,
            userId,
            registryName,
            requestId,
            registryId
        }));
    } catch (error) {
        console.error("������:", error);
        return [];
    }
}
