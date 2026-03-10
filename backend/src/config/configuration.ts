export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  database: {
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'pc_user',
    pass: process.env.DB_PASS || 'pc_pass',
    name: process.env.DB_NAME || 'pc_hardware'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretjwt',
    expiresIn: '7d'
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  },
  elastic: {
    node: process.env.ES_NODE || 'http://elasticsearch:9200',
    index: process.env.ES_INDEX || 'products'
  }
});

