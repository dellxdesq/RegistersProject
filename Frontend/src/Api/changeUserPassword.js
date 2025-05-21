import { getAuthHeaders } from "../Utils/getAuthHeaders";
import { authFetch } from "./authFetch";

export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await authFetch("/auth/change-password", {
            method: "POST",
            body: JSON.stringify({
                CurrentPassword: currentPassword,
                NewPassword: newPassword,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `������: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        console.error("������ ��� ����� ������:", error);
        return { success: false, error: error.message };
    }
}
