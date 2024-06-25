const cluster = require('cluster');
const os = require('os');
const { Sequelize } = require('sequelize')
const app = require('./app');

const port = 4000
const sequelize = new Sequelize(
     process.env.DATABASE,
     process.env.DATABASE_USER,
     process.env.DATABASE_PASSWORD, {
     host: process.env.DATABASE_HOST,
     logging: false,
     dialect: 'mysql',
     timezone: '+07:00',
},
)

if (cluster.isMaster) {
     const numCPUs = os.cpus().length;
     console.log(`Master process is running. Forking for ${numCPUs} CPUs.`);

     for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
     }

     cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
          cluster.fork();
     });
} else {
     app.listen(port, async () => {
          try {
               await sequelize.sync()
          } catch (err) {
               console.error(err);
               console.log("!!!!WARNING!!!!");
               console.log(` - Check database connection`);
          } finally {
               console.log(`Server is listening on port ${port}`)
          }
     })
}
