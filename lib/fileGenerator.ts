import JSZip from 'jszip';

export function downloadTextFile(word: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${word}-prompt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export async function downloadZipFile(words: string[], prompts: string[]): Promise<void> {
    const zip = new JSZip();

    // Add each prompt as a text file
    words.forEach((word, index) => {
        zip.file(`${word}-prompt.txt`, prompts[index]);
    });

    // Generate ZIP file
    const blob = await zip.generateAsync({ type: 'blob' });

    // Download ZIP
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompts.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
