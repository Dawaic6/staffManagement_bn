import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/authRoutes";

const app = express();


// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },// Allow cross-origin resource sharing
  }),
)
app.use(morgan("dev"))
app.use(express.json())

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://staff-management-one.vercel.app" // your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true
}));
// Single CORS configuration

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true)
//       return callback(null, true)
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//     exposedHeaders: ["Content-Length", "Content-Type", "Authorization"],
//   }),
// )

// Make sure your static file serving has proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin',);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'uploads')));


// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
 
// Routes
app.use("/api", authRoutes);

export default app;