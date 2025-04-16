import React from "react";
import styles from "./styles";

export default function InputField({ id, label, type, value, onChange, placeholder, required = true }) {
    return (
        <div style={styles.formGroup}>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                style={styles.input}
            />
        </div>
    );
}

