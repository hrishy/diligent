import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// const config: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: 'mysecretpassword',
//   database: 'product_db',
//   autoLoadEntities: true,
//   synchronize: true,
//   logging: true,
// };

// export default config;
export default (): { database: TypeOrmModuleOptions; apiKey: string } => ({
  database: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'myapp',
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  },
  apiKey: process.env.CURRENCY_API_KEY || 'my-secret-api-key',
});
