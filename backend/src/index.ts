import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./config/swagger";
import AuthRoutes from "./modules/user/AuthController";
import RecipeRoutes from "./modules/recipe/RecipeController";
import CategoryRoutes from "./modules/category/CategoryController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use(AuthRoutes);
app.use(RecipeRoutes);
app.use(CategoryRoutes);


app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Swagger docs at http://localhost:3000/api-docs");
});
