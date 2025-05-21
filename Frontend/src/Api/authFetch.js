const API_BASE = "https://localhost:8081/api/v1";

export async function authFetch(url, options = {}) {
    let accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    
    options.headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(API_BASE + url, options);

    if (response.status === 401 && refreshToken) {
        const refreshResponse = await fetch(API_BASE + "/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            
            options.headers.Authorization = `Bearer ${data.accessToken}`;
            response = await fetch(API_BASE + url, options);
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
        }
    }

    return response;
}
