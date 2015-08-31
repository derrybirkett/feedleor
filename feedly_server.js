Feedly = {};

OAuth.registerService('feedly', 2, null, function(query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  // https://developer.feedly.com/v3/profile/
  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      givenName: identity.givenName,
      familyName: identity.familyName,
      email: identity.email,
      picture: identity.picture,
      twitter: identity.twitter,
      google: identity.google,
      facebook: identity.facebook,
      gender: identity.gender,
      locale: identity.locale      
    },
    options: {profile: {name: identity.givenName}}
  };
});

// http://developer.feedly.com/v3/#user-agent-required
var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'feedly'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://sandbox.feedly.com/v3/auth/token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('feedly', config),
          response_type: "code",
          scope: "https://cloud.feedly.com/subscriptions",
          grant_type: "authorization_code",
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Feedly. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Feedly. " + response.data.error);
  } else {
    console.log(response);
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "http://sandbox.feedly.com/v3/profile", {
        headers: {
            "User-Agent": userAgent,
            "Authorization": accessToken,
        }, // http://developer.feedly.com/v3/#user-agent-required
        params: {access_token: accessToken}
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from feedly. " + err.message),
                   {response: err.response});
  }
};


Feedly.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
