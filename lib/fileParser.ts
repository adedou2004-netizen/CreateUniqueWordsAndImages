import * as XLSX from 'xlsx';

export async function parseTextFile(file: File): Promise<string[]> {
    const text = await file.text();
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

export async function parseCsvFile(file: File): Promise<string[]> {
    const text = await file.text();
    const lines = text.split('\n');
    const words: string[] = [];

    for (const line of lines) {
        const firstColumn = line.split(',')[0]?.trim();
        if (firstColumn && firstColumn.length > 0) {
            words.push(firstColumn);
        }
    }

    return words;
}

export async function parseExcelFile(file: File): Promise<string[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Extract first column
    const words: string[] = [];
    for (const row of data) {
        if (row[0]) {
            const word = String(row[0]).trim();
            if (word.length > 0) {
                words.push(word);
            }
        }
    }

    return words;
}

export async function parseFile(file: File): Promise<string[]> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'txt':
            return parseTextFile(file);
        case 'csv':
            return parseCsvFile(file);
        case 'xlsx':
        case 'xls':
            return parseExcelFile(file);
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}
