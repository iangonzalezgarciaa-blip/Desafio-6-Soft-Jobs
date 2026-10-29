import 'dotenv/config';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('Debo configurar JWT_SECRET con al menos 24 caracteres en .env');
  process.exit(1);
}
const { app } = await import('./app.js');
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API Soft Jobs disponible en http://localhost:${port}`));