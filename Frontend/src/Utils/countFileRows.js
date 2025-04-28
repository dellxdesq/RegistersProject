export async function countFileRows(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const text = event.target.result;
            const lines = text.split(/\r\n|\n/);
            const nonEmptyLines = lines.filter(line => line.trim() !== "");
            resolve(nonEmptyLines.length);
        };

        reader.onerror = function(event) {
            reject(new Error("Ошибка чтения файла: " + event.target.error));
        };

        reader.readAsText(file);
    });
}
