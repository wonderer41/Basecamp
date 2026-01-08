import express from 'express';
import path from 'path';

const app = express();
const PORT= process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString()});

});

app.listen(PORT, () => {
    console.log(`Dashboard runiing at http://localhost:${PORT}`);

});
