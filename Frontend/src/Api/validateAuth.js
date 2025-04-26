export async function validateToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return { isValid: false, error: "����� �����������" };
    }

    try {
        const response = await fetch("https://localhost:8081/api/v1/auth/validate", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes("Invalid token")) {
                return { isValid: false, error: "Invalid token" };
            } else {
                throw new Error("������ �������: " + response.status);
            }
        }

        const data = await response.json();
        return {
            isValid: data.isValid,
            userId: data.userId,
        };

    } catch (error) {
        console.error("������ ��� ��������� ������:", error);
        return { isValid: false, error: error.message };
    }
}
