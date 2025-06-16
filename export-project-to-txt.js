const fs = require("fs");
const path = require("path");

// Extensões de arquivos que queremos incluir
const EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".css", ".env", ".yml"
];

// Diretórios que não queremos exportar
const IGNORED_DIRS = ["node_modules", "dist", "build", ".git", ".vscode"];

// Função para pular arquivos de teste
function isTestFile(file) {
  return file.endsWith(".spec.ts") || file.endsWith(".spec.tsx");
}

// Caminhada recursiva
function walk(dir, depth = 0) {
  const files = fs.readdirSync(dir);
  let output = "";

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (IGNORED_DIRS.includes(file)) continue;

      output += `${"  ".repeat(depth)}- ${file}/\n`;
      output += walk(fullPath, depth + 1);
    } else {
      const ext = path.extname(file);
      if (!EXTENSIONS.includes(ext)) continue;
      if (file === "package-lock.json") continue;
      if (isTestFile(file)) continue;

      const indent = "  ".repeat(depth);
      const content = fs.readFileSync(fullPath, "utf-8");
      output += `${indent}- ${file}\n`;
      output += `${indent}  \`\`\`${ext.substring(1)}\n${content}\n${indent}  \`\`\`\n`;
    }
  }

  return output;
}

// Caminho base (pasta raiz do projeto)
const root = path.resolve(".");
const output = walk(root);
fs.writeFileSync("project-export.txt", output);

console.log("✅ Arquivo 'project-export.txt' criado com sucesso!");
