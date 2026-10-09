import { randomUUID } from 'crypto';
import { readData, writeData } from '../data/fileService.js';

// 1. Tüm Görevleri Listele
export const getAllTasks = async (req, res) => {
    try {
        const db = await readData();
        const { status, projectId } = req.query;
        let result = db.tasks;

        if (status) {
            result = result.filter(t => t.status === status);
        }
        if (projectId) {
            result = result.filter(t => t.projectId === projectId);
        }

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. ID ile Tekil Görev Getir
export const getTaskById = async (req, res) => {
    try {
        const db = await readData();
        const { id } = req.params;
        const task = db.tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `ID: ${id} olan görev bulunamadı.`
            });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Yeni Görev Ekle ve Dosyaya Kaydet
export const createTask = async (req, res) => {
    try {
        const { title, projectId, assignedTo, priority } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Görev başlığı (title) ve proje ID (projectId) zorunludur.'
            });
        }

        const db = await readData();

        const newTask = {
            id: randomUUID(),
            title,
            projectId,
            assignedTo: assignedTo || null,
            status: 'todo',
            priority: priority || 'medium',
            createdAt: new Date().toISOString()
        };

        db.tasks.push(newTask);
        await writeData(db); // database.json dosyasına yaz

        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Görevi Güncelle ve Dosyaya Kaydet
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, title, priority, assignedTo } = req.body;

        const db = await readData();
        const taskIndex = db.tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `ID: ${id} olan görev bulunamadı.`
            });
        }

        if (status) db.tasks[taskIndex].status = status;
        if (title) db.tasks[taskIndex].title = title;
        if (priority) db.tasks[taskIndex].priority = priority;
        if (assignedTo !== undefined) db.tasks[taskIndex].assignedTo = assignedTo;

        await writeData(db);

        res.status(200).json({
            success: true,
            message: 'Görev güncellendi.',
            data: db.tasks[taskIndex]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Görevi Sil ve Dosyayı Güncelle
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readData();

        const taskIndex = db.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `ID: ${id} olan görev bulunamadı.`
            });
        }

        db.tasks.splice(taskIndex, 1);
        await writeData(db);

        res.status(200).json({
            success: true,
            message: 'Görev başarıyla silindi.'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};