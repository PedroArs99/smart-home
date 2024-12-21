import { AlexaRequestEnvelope } from './lib/types';
import { getRequestName, getRequestType } from './lib/util';

function handleAuthorization(request: AlexaRequestEnvelope, context: any) {
    // Send the AcceptGrant response
    const payload = {};
    const header = request.directive.header;
    header.name = 'AcceptGrant.Response';
    console.debug('AcceptGrant Response: ', JSON.stringify({ header: header, payload: payload }));
    context.succeed({ event: { header: header, payload: payload } });
}

function handleDiscovery(request: AlexaRequestEnvelope, context) {
    // Send the discovery response
    const payload = {
        endpoints: [
            {
                endpointId: 'sample-bulb-01',
                manufacturerName: 'Smart Device Company',
                friendlyName: 'Livingroom lamp',
                description: 'Virtual smart light bulb',
                displayCategories: ['LIGHT'],
                additionalAttributes: {
                    manufacturer: 'Sample Manufacturer',
                    model: 'Sample Model',
                    serialNumber: 'U11112233456',
                    firmwareVersion: '1.24.2546',
                    softwareVersion: '1.036',
                    customIdentifier: 'Sample custom ID',
                },
                cookie: {
                    key1: 'arbitrary key/value pairs for skill to reference this endpoint.',
                    key2: 'There can be multiple entries',
                    key3: 'but they should only be used for reference purposes.',
                    key4: 'This is not a suitable place to maintain current endpoint state.',
                },
                capabilities: [
                    {
                        interface: 'Alexa.PowerController',
                        version: '3',
                        type: 'AlexaInterface',
                        properties: {
                            supported: [
                                {
                                    name: 'powerState',
                                },
                            ],
                            retrievable: true,
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa.EndpointHealth',
                        version: '3.2',
                        properties: {
                            supported: [
                                {
                                    name: 'connectivity',
                                },
                            ],
                            retrievable: true,
                        },
                    },
                    {
                        type: 'AlexaInterface',
                        interface: 'Alexa',
                        version: '3',
                    },
                ],
            },
        ],
    };
    const header = request.directive.header;
    header.name = 'Discover.Response';
    console.debug('Discovery Response: ', JSON.stringify({ header: header, payload: payload }));
    context.succeed({ event: { header: header, payload: payload } });
}

function handlePowerControl(request, context) {
    // get device ID passed in during discovery
    const requestMethod = request.directive.header.name;
    const responseHeader = request.directive.header;
    responseHeader.namespace = 'Alexa';
    responseHeader.name = 'Response';
    responseHeader.messageId = responseHeader.messageId + '-R';
    // get user token pass in request
    const requestToken = request.directive.endpoint.scope.token;
    let powerResult;

    if (requestMethod === 'TurnOn') {
        // Make the call to your device cloud for control
        // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
        powerResult = 'ON';
    } else if (requestMethod === 'TurnOff') {
        // Make the call to your device cloud for control and check for success
        // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
        powerResult = 'OFF';
    }
    // Return the updated powerState.  Always include EndpointHealth in your Alexa.Response
    // Datetime format for timeOfSample is ISO 8601, `YYYY-MM-DDThh:mm:ssZ`.
    const contextResult = {
        properties: [
            {
                namespace: 'Alexa.PowerController',
                name: 'powerState',
                value: powerResult,
                timeOfSample: '2022-09-03T16:20:50.52Z', //retrieve from result.
                uncertaintyInMilliseconds: 50,
            },
            {
                namespace: 'Alexa.EndpointHealth',
                name: 'connectivity',
                value: {
                    value: 'OK',
                },
                timeOfSample: '2022-09-03T22:43:17.877738+00:00',
                uncertaintyInMilliseconds: 0,
            },
        ],
    };
    const response = {
        context: contextResult,
        event: {
            header: responseHeader,
            endpoint: {
                scope: {
                    type: 'BearerToken',
                    token: requestToken,
                },
                endpointId: 'sample-bulb-01',
            },
            payload: {},
        },
    };
    log('DEBUG', 'Alexa.PowerController ', JSON.stringify(response));
    context.succeed(response);
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (request: AlexaRequestEnvelope, context: any): Promise<void> => {
    if (getRequestType(request) === 'Alexa.Discovery' && getRequestName(request) === 'Discover') {
        console.debug('Discover request', JSON.stringify(request));
        handleDiscovery(request, context);
    } else if (getRequestType(request) === 'Alexa.PowerController') {
        if (getRequestName(request) === 'TurnOn' || getRequestName(request) === 'TurnOff') {
            console.debug('Power request', JSON.stringify(request));
            handlePowerControl(request, context);
        }
    } else if (getRequestType(request) === 'Alexa.Authorization' && getRequestName(request) === 'AcceptGrant') {
        handleAuthorization(request, context);
    }
};
