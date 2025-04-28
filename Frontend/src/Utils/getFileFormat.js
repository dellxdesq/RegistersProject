export function getFileFormat(file) {
    if (!file) return "";

    const mimeType = file.type; 
    const name = file.name;
    
    if (mimeType.includes('csv')) return 'csv';
    if (mimeType.includes('json')) return 'json';
    if (mimeType.includes('xml')) return 'xml';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheetml')) return 'xlsx';
    
    const extension = name.split('.').pop().toLowerCase();

    switch (extension) {
        case 'csv':
            return 'csv';
        case 'json':
            return 'json';
        case 'xml':
            return 'xml';
        case 'xlsx':
        case 'xls':
            return 'xlsx';
        default:
            return 'unknown';
    }
}
