import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";


ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const config = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: config.get('DATABASE_HOST'),
  port: config.get('DATABASE_PORT'),
  username: config.get('DATABASE_USERNAME'),
  password: config.get('DATABASE_PASSWORD'),
  database: config.get('DATABASE_NAME'),
  synchronize: true, // @todo quitar luego
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  logger: 'debug',
  debug: true
};

export const AppDataSource = new DataSource(DataSourceConfig);
