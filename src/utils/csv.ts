export type CsvRow = Record<string, string | number | boolean | null | undefined>;

export function toCsv(rows: CsvRow[], headers?: string[]): string {
    if (rows.length === 0) return '';
    const headerList = headers ?? Array.from(new Set(rows.flatMap(r => Object.keys(r))));
    const escape = (val: unknown) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
        return str;
    };
    const lines = [headerList.join(',')];
    for (const row of rows) {
        lines.push(headerList.map(h => escape(row[h])).join(','));
    }
    return lines.join('\n');
}

export function parseCsv(content: string): CsvRow[] {
    const lines = content.split(/\r?\n/).filter(l => l.length > 0);
    if (lines.length === 0) return [];
    const headers = splitCsvLine(lines[0]);
    const out: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = splitCsvLine(lines[i]);
        const row: CsvRow = {};
        headers.forEach((h, idx) => {
            row[h] = cols[idx] ?? '';
        });
        out.push(row);
    }
    return out;
}

function splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += ch;
            }
        } else {
            if (ch === ',') {
                result.push(current);
                current = '';
            } else if (ch === '"') {
                inQuotes = true;
            } else {
                current += ch;
            }
        }
    }
    result.push(current);
    return result;
}

export function downloadCsv(filename: string, csv: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    URL.revokeObjectURL(url);
}


