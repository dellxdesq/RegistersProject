import styles from "./styles";
import { useNavigate } from "react-router-dom";

export default function RegistersList({ items }) {
    const navigate = useNavigate();

    const handleClick = (item) => {
        navigate(`/registry/${item.id}`);
    };

    return (
        <div style={styles.listContainer}>
            {items.map((item) => (
                <div key={item.id} onClick={() => handleClick(item)} style={styles.listItem}>
                    {item.name}
                </div>
            ))}
        </div>
    );
}
