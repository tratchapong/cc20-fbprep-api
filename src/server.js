import dotenv from 'dotenv'
import app from './app.js'
import shutdown from './utils/shutdown.util.js'

dotenv.config()

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))

// Listen for termination signals
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // kill command or Docker stop


// Catch unhandled errors
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled Rejection:', reason);
  await gracefulShutdown('unhandledRejection');
});
