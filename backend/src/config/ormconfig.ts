import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const db = configService.get('database');
  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.pass,
    database: db.name,
    autoLoadEntities: true,
    synchronize: true,
    logging: false
  };
};

