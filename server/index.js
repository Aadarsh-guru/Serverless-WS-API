import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';

export const handler = async (event) => {

  const connectionId = event.requestContext.connectionId;
  const route = event.requestContext.routeKey;
  const response = { statusCode: 200, body: '' };

  if (route === '$connect') {
    console.log(`Client connected: ${connectionId}`);
    return response;
  }

  if (route === '$disconnect') {
    console.log(`Client disconnected: ${connectionId}`);
    return response;
  }

  if (route === '$default') {

    const client = new ApiGatewayManagementApi({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
    });

    await client.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify({ message: event.body }),
    });

    return response;
  }
};

