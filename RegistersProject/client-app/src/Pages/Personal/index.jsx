import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import Navbar from "../../Components/Navbar";

export default function PersonalPage() {

    return (
        <div style={styles.container}>
            <Navbar />
        </div>
    );
}
