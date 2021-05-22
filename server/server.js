const app = require('./app');

const port = 8000;
const server = app.listen(port, () => {
  console.log(`Server listening on Port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION: Shutting down the Application');
  console.log(err.name, ' : ', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: Shutting down the Application');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});