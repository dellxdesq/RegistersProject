import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#8884d8"];

export default function ChartViewer() {
    const chartParams = JSON.parse(localStorage.getItem("chartData") || "{}");
    const { type, xAxis, yAxis, data } = chartParams;
    const yTicks = Array.from(
        new Set(
            data
                .map(item => parseFloat(item[yAxis]))
                .filter(v => !isNaN(v))
        )
    ).sort((a, b) => a - b);
    if (!data || !xAxis || !yAxis) return <p>Недостаточно данных для отображения графика</p>;

    return (
        <div style={{ width: "1100", height: "90vh", padding: 20 }}>
            <h2>График: {type}</h2>
            <ResponsiveContainer width="100%" height="90%">
                {type === "line" && (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxis} />
                        <YAxis
                            dataKey={yAxis}
                            type="number"
                            ticks={yTicks}
                            domain={[Math.min(...yTicks), Math.max(...yTicks)]}
                            tickFormatter={(value) =>
                                value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M`
                                    : value >= 1_000 ? `${(value / 1_000).toFixed(1)}K`
                                        : value
                            }
                        />


                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
                    </LineChart>
                )}

                {type === "bar" && (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={yAxis} fill="#82ca9d" />
                    </BarChart>
                )}

                {type === "pie" && (
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            data={data}
                            dataKey={yAxis}
                            nameKey={xAxis}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
