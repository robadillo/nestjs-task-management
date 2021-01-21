import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres', // This will tell typeorm which driver use
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // Typeorm translate the entities into tables in the db and this are saved in files
  synchronize: true // in production, is not recommended to leave it in true
}