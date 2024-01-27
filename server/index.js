import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';
import { Redis } from "ioredis";

export const handler = async (event) => {

  const connectionId = event.requestContext.connectionId;
  const route = event.requestContext.routeKey;
  const response = { statusCode: 200, body: '' };
  const redisClient = new Redis(process.env.REDIS_URL);

  if (route === '$connect') {
    // Store connectionId in Redis on connection
    await redisClient.sadd('connected_clients', connectionId);
    response.body = 'Connected';
    return response;
  }

  if (route === '$disconnect') {
    // Delete connectionId from Redis on disconnection
    await redisClient.srem('connected_clients', connectionId);
    response.body = 'Disconnected';
    return response;
  }

  if (route === '$default') {

    const client = new ApiGatewayManagementApi({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
    });

    // Get all connected connectionIds from Redis
    const connectedClients = await redisClient.smembers('connected_clients');

    // Send the message to all connected clients
    const sendMessagePromises = connectedClients.map(async (clientId) => {
      await client.postToConnection({
        ConnectionId: clientId,
        Data: event.body,
      });
    });

    // Wait for all messages to be sent before returning the response
    await Promise.all(sendMessagePromises);

    return response;
  }
};
