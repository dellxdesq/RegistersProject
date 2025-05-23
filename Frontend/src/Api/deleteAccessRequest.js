import { authFetch } from "./authFetch";
export async function deleteAccessRequest(requestId) {
    try {
        const response = await authFetch(`/registries/access-requests/${requestId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}