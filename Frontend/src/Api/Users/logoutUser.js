import { authFetch } from "../authFetch";

export async function logout() {
    try {
        const response = await authFetch("/auth/logout", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("�� ������� ��������� �����");
        }
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return { success: true };
    } catch (error) {
        console.error("������ ��� ������:", error);
        return { success: false, error: error.message };
    }
}
