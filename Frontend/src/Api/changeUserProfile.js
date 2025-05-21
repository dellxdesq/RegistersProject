import { authFetch } from "./authFetch";
export async function updateProfile(profileData) {
    try {
        const response = await authFetch("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
        return { success: false, error: error.message };
    }
}
