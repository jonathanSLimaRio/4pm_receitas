echo "📦 Rodando migrate deploy..."
npx prisma migrate deploy

echo "🚀 Iniciando servidor de desenvolvimento..."
npm run start:dev
