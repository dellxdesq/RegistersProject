import { authFetch } from "../authFetch";
import {ToastProvider} from "../../Context/ToastContext";

export async function requestRegistryAccess(registryId, message = "����� ������") {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("��� ������. �������������.");
    }

    const response = await authFetch(`/registries/${registryId}/request-access`, {
        method: "POST",
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "������ ������� �������");
    }

    return await response.text();
}
