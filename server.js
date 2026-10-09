import express from 'express';
import taskRoutes from './src/routes/taskRoutes.js';

const app = express();
const PORT = 3000;

// Body parser (JSON gövdelerini okumak için şart)
app.use(express.json());

// Görev rotalarını Express'e bağla
app.use('/api/tasks', taskRoutes);

// Kök karşılama rotası
app.get('/', (req, res) => {
    res.json({ message: 'Görev ve Proje Yönetim API çalışıyor!' });
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde aktif.`);
});