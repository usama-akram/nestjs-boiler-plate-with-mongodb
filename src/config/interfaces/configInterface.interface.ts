import * as Joi from 'joi';

export interface ConfigInterface {
  NODE_ENV: string;
  SERVER_PORT: number;
  MONGO_URI: string;
}
