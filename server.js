const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes")
const employeeRoutes = require('./routes/employeeRoutes')

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB Error:", err));

app.use("/api/auth", authRoutes);
app.use('/api/candidate',candidateRoutes)
app.use('/api/employee',employeeRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
