import { getAuthHeaders } from "../Utils/getAuthHeaders";

export async function updateProfile(profileData) {
    try {
        const response = await fetch("https://localhost:8081/api/v1/auth/profile", {
            method: "PUT",
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
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
