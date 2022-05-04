import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { ConfigInterface } from './interfaces/configInterface.interface';

export class ConfigService {
  private readonly envConfig: ConfigInterface;

  constructor() {
    dotenv.config();
    const config: { [name: string]: string } = process.env;
    const parsedConfig = JSON.parse(JSON.stringify(config));
    this.envConfig = this.validateInput(parsedConfig);
  }
  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput = (envConfig): ConfigInterface => {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .required()
        .valid(
          'development',
          'production',
          'staging',
          'provision',
          'inspection',
        )
        .default('development'),
      SERVER_PORT: Joi.number().required(),
      MONGO_URI: Joi.string().required(), // if the selected database is mongodb
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        abortEarly: false,
        allowUnknown: true,
      },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  };

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get serverPort(): number {
    return this.envConfig.SERVER_PORT;
  }

  get mongoUri(): string {
    return this.envConfig.MONGO_URI;
  }
}
