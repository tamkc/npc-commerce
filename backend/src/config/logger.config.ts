import { format, transports } from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.colorize(),
        format.printf((info) => {
          const { timestamp, level, message, context, ms } = info as any;
          return `[Nest] - ${timestamp} ${level} [${context || 'App'}] ${message} ${ms || ''}`;
        }),
      ),
    }),
    // You can add more transports here, like file transports or external services
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
