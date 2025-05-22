import { authFetch } from "./authFetch";

export async function registerUser({ username, email, password }) {
    const response = await fetch("https://localhost:8081/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const result = {
        success: false,
        data: null,
        error: null,
    };

    if (!response.ok) {
        const errorText = await response.text();
        result.error = errorText || "Ошибка регистрации";
        return result;
    }

    const data = await response.json();
    result.success = true;
    result.data = data;
    return result;
}
