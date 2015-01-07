var request = require('superagent');
var serialize = require('./serialize');

var options = {
  expressApp: null,
  baseURL: null
};

var handlers = [];

module.exports = {
  setup: function(app, url) {
    if(typeof app === 'undefined' || typeof url === 'undefined') {
      throw new Error('Arguments must consist of your Express app, and your app\'s base URL (http://example.com).');
    }
    else if(options.expressApp !== null || options.baseURL !== null) {
      throw new Error('The module can only be set up once.');
    }

    options.expressApp = app;
    options.baseURL = url;

    app.get('/blockchain-receive', function(req, res) {
      var customArguments = {};

      for(var key in req.query) {
        if(req.query.hasOwnProperty(key)) {
          var query = req.query[key];

          if(query.substring(0, 7) === 'custom-') {
            customArguments[key] = query;
          }
        }
      }

      var info = {
        value: req.query['value'],
        inputAddress: req.query['input_address'],
        confirmations: req.query['confirmations'],
        destinationAddress: req.query['destination_address'],
        customArguments: customArguments
      };

      var responseSent = false;

      for(var i = 0, len = handlers.length; i < len; ++i) {
        var handler = handlers[i];

        handler(info, function(noFurtherUpdates) {
          if(!responseSent) {
            res.send(noFurtherUpdates ? '*ok*' : '');
            responseSent = true;
          }
        });
      }
    });
  },
  generateAddress: function(customArguments, callback) {
    if(options.expressApp === null || options.baseURL === null) {
      throw new Error('Module must be set up first.');
    }

    var serializedArgs = [];

    serializedArgs.push(serialize({
      method: 'create',
      address: address,
      callback: callbackUrl
    }));

    serializedArgs.push(serialize(additionalInfo, 'x-'));

    request
    .get(options.baseURL + '/api/receive?' + serializedArgs.join('&'))
    .end(function(err, res) {
      if(err) {
        throw new err;
      }

      var parsed = JSON.parse(res.text);

      callback(parsed['input_address']);
    });
  },
  onTransactionChange: function(handler) {
    handlers.push(handler);
  },
  offTransactionChange: function(handler) {
    for(var i = 0, len = handlers.length; i < len; ++i) {
      if(handler === handlers[i]) {
        handlers.splice(i, 1);
        break;
      }
    }
  }
};
