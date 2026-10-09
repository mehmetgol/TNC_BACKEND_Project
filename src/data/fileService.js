import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modüllerinde __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// database.json dosyasının tam dosya yolu
const dbPath = path.join(__dirname, 'database.json');

// Dosyayı oku ve JavaScript nesnesine çevir
export const readData = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Dosya okuma hatası:', error.message);
        throw new Error('Veri tabanı okunamadı.');
    }
};

// JavaScript nesnesini JSON formatında dosyaya kaydet
export const writeData = async (data) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Dosya yazma hatası:', error.message);
        throw new Error('Veri tabanına kaydedilemedi.');
    }
};