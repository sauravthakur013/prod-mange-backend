const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require('./src/routes/authRoutes');
const productionOrderRoutes = require('./src/routes/productionOrderRoutes');
const materialRoutes = require('./src/routes/materialRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware'); // Import 

const app = express()

app.use(cors());

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', productionOrderRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = {app}