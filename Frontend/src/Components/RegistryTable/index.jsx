import styles from "./styles";

export default function RegistryTable({ data }) {
    if (!data || !data.headers || data.headers.length === 0) {
        return <div style={styles.message}>Нет данных для отображения</div>;
    }

    return (
        <div style={styles.scrollWrapper}>
            <table style={styles.table}>
                <thead>
                <tr>
                    {data.headers.map((header, index) => (
                        <th key={index} style={styles.th}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.top.map((row, rowIndex) => (
                    <tr key={`top-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={styles.td}>{cell}</td>
                        ))}
                    </tr>
                ))}

                <tr>
                    <td colSpan={data.headers.length} style={styles.skipRow}>...</td>
                </tr>

                {data.bottom.map((row, rowIndex) => (
                    <tr key={`bottom-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={styles.td}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
