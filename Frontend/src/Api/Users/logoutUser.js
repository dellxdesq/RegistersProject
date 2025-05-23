import { authFetch } from "../authFetch";

export async function logout() {
    try {
        const response = await authFetch("/auth/logout", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Не удалось выполнить выход");
        }
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return { success: true };
    } catch (error) {
        console.error("Ошибка при выходе:", error);
        return { success: false, error: error.message };
    }
}
