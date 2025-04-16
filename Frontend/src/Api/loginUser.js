export async function loginUser({ username, password }) {
    try {
        const response = await fetch("https://localhost:8081/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            let errorText = "Неверный логин или пароль";

            if (response.status === 404 || response.status === 401) {
                errorText = "Пользователь не найден или данные неверны";
            } else {
                try {
                    errorText = await response.text();
                } catch {
                    
                }
            }

            return { success: false, error: errorText };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (err) {
        console.error("Ошибка при логине:", err);
        return { success: false, error: "Ошибка подключения к серверу" };
    }
}
