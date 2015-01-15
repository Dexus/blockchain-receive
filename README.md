#Blockchain Receive
A super simple NodeJS module for interacting with [Blockchain's Receive API](https://blockchain.info/api/api_receive). It depends on being run within the context of Express.

###Documentation
####setup

    blockchain.setup(expressApp, baseURL)

This function only needs to be called once in order to set up the module. The first argument is your Express app instance, and the second is your application's publicly accessible URL.
####onTransactionChange

    blockchain.onTransactionChange(callback);

Add a handler for when the status of one of your Blockchain transactions changes.

####offTransactionChange

    blockchain.offTransactionChange(callback);

Remove a transaction handler

####generateAddress

    blockchain.generateAddress(recipientAddress, customParameters, callback);

Generate a new Bitcoin address which will forward all Bitcoins to the ```recipientAddress``` and alert you of any status changes.

###Example

  var express = require('express');
  var blockchain = require('blockchain-receive');

  var app = express();

  blockchain.setup(app, 'http://example.com');

  blockchain.onTransactionChange(function(info, done) {
    console.log(info);
    done(true);
  });

  blockchain.generateAddress('1FfmbHfnpaZjKFvyi1okTjJJusN455paPH', {
    customParam: 'somevalue123',
    secret: 'secretvalue'
  }, function(address) {
    console.log(address);
  });

  app.listen(80);
