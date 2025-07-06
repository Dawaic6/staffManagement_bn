import express from "express";
import { login, register,getUsers,
    getUserById,
    updateUser,
    deleteUser,} from "../controllers/authController";
import { validateRegister } from "../middleware/authValidation";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/users", getUsers);

// Get user by ID
router.get("/users/:id", getUserById);

router.put("/users/:id", updateUser);

// Delete a user
router.delete("/users/:id", deleteUser);


export default router;