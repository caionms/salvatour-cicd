import connectDB from "./src/database/configdb.js";
import express from "express";
import userRoute from "./src/routes/user.route.js";
import adminRoute from "./src/routes/admin.route.js";
import rootRoute from "./src/routes/root.route.js";
import authRoute from "./src/routes/auth.route.js";
import reviewRoute from "./src/routes/review.route.js";
import touristAttractionRoute from "./src/routes/touristAttraction.route.js";
import cors from 'cors';
import swaggerRoute from "./src/routes/swagger/swagger.route.js";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

// Conectar ao banco de dados
connectDB();

const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PATCH',
        'DELETE'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],
};

app.use(cors(corsOpts));
app.use(express.json());

app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/reviews", reviewRoute);
app.use("/touristAttraction", touristAttractionRoute);
app.use("/", rootRoute);
app.use("/docs", swaggerRoute);

const PORT = process.env.PORT || 3000; // Adicionado valor padrão
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
