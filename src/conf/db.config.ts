import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm";

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
        type: "mysql",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        logging: true,
        synchronize: true
    };
  }
}