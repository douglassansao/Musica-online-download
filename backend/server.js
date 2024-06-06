const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const formidable = require('formidable');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'YOUR_STRONG_SECRET_KEY';
const dbUser = 'faturame';
const dbPassword = 'faturame872420201';
const dbName = 'faturame';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@faturamecluster.0vbmrv8.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Models
const User = require('./models/user');
const Recibo = require('./models/recibo');
const Cotacao = require('./models/cotacao');

// Routes
app.post('/register', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'uploads');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err.message);
            return res.status(500).send('Error uploading file');
        }

        const { name, email, password } = fields;
        const photo = files.photo ? files.photo.path : '';

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashedPassword, photo });
            await user.save();
            res.status(201).send('User registered successfully');
        } catch (error) {
            console.error('Error registering user:', error.message);
            res.status(500).send('Error registering user');
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).send('Error logging in');
    }
});

app.post('/recibo', authenticateToken, async (req, res) => {
    const { cliente, produtos, valor } = req.body;

    try {
        const recibo = new Recibo({ cliente, produtos, valor, user: req.user.userId });
        await recibo.save();
        res.status(201).send('Recibo created successfully');
    } catch (error) {
        console.error('Error creating recibo:', error.message);
        res.status(500).send('Error creating recibo');
    }
});

app.post('/cotacao', authenticateToken, async (req, res) => {
    const { cliente, produtos, preco, validade } = req.body;

    try {
        const cotacao = new Cotacao({ cliente, produtos, preco, validade, user: req.user.userId });
        await cotacao.save();
        res.status(201).send('Cotacao created successfully');
    } catch (error) {
        console.error('Error creating cotacao:', error.message);
        res.status(500).send('Error creating cotacao');
    }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send('Token required');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Invalid token:', err.message);
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Adicione estas linhas no topo
const genreRouter = require('./routes/genres');

// Adicione esta linha para usar a nova rota
app.use('/genres', genreRouter);
