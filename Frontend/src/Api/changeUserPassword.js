import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await fetch("https://localhost:8081/api/v1/auth/change-password", {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
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
