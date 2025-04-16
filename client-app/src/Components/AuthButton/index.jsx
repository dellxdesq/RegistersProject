import styles from "../AuthButton/styles";
import { useNavigate } from "react-router-dom";

export default function Index({ text = "Кнопка", onClick, type = "button" }) {
    return (
        <button type={type} style={styles.Button} onClick={onClick}>
            {text}
        </button>
    );
}