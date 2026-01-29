import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { Module } from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';

export const IORedisKey = 'IORedis'; // Key to identify the Redis client provider

// Options for configuring the Redis module
type RedisModuleOptions = {
  connectionOptions: RedisOptions;        // ioredis connection options like port, host, password, etc.
  onClientReady?: (client: Redis) => void; // Optional callback when the client is ready like redis connected.
};

// Asynchronous options for configuring the Redis module like imports and injects for dependencies in the factory function. 
type RedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions; // Factory function to return RedisModuleOptions/Redis Configuration .
} & Pick<ModuleMetadata, 'imports'> & //This will allow us to import other modules if needed.
  Pick<FactoryProvider, 'inject'>; //This will allow us to inject dependencies into the factory function.

// RedisModule definition which register the Redis client asynchronously, for use in other parts of the application.
@Module({}) 
export class RedisModule { 
  static async registerAsync({                                                // Method to register the Redis module asynchronously
    useFactory,               
    imports,                   
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {                       // Returns a promise that resolves to a DynamicModule
    const redisProvider = {                                                   // Provider definition for the Redis client
      provide: IORedisKey,                                                    // Use the defined key to provide the Redis client
      useFactory: async (...args) => {                                       // Factory function to create and return the Redis client
        const { connectionOptions, onClientReady } = await useFactory(...args); // Get the Redis module options from the factory function

        const client = await new IORedis(connectionOptions);                  // Create a new ioredis client with the provided connection options

        onClientReady?.(client);                                                // Call the onClientReady callback if provided

        return client;
      },
      inject,                                                                  // Inject dependencies into the factory function
    };

// Return the dynamic module with the provider and exports
    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}