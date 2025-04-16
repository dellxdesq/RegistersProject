import { useState } from "react";
import Navbar from "../../Components/Navbar";
import SearchList from "../../Components/SearchList";
import styles from "./styles";
import RegistersList from "../../Components/RegistersList";

const mockData = Array.from({ length: 15 }, (_, i) => `Реестр ${i + 1}`);

export default function MainPage() {
    
    const [search, setSearch] = useState("");

    const filteredList = mockData.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <SearchList value={search} onChange={setSearch} />
                <RegistersList items={filteredList} />
            </div>
        </div>
    );
}
