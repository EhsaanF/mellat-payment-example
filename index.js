const express = require( 'express' ),
      bodyParser = require( 'body-parser' ),
      port = 9898,
      mellat = require( './mellat' ),
      app = express();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.listen( port, () => {
    console.log( `Listening on ${port}` );
} );

var terminal = '';
var username = '';
var password = '';

app.get( '/', ( req, resp ) => {
    resp.sendFile( `${process.cwd()}/form.html` );
} );

app.post( '/', ( req, resp ) => {
    mellat.Request( terminal, username, password, req.body.amount, req.body.return ).then( ( data ) => {
        resp.send( '<form method="post" action="https://bpm.shaparak.ir/pgwchannel/startpay.mellat"><input type"hidden" name="RefId" value="' + data.refId + '"><input type="submit"></form>' ).end();
    } ).catch( ( data ) => {
        resp.send( 'error code: ' + err.errorCode ).end(); 
    } );
} );

app.post( '/callback', ( req, resp ) => {
    mellat.Verify( terminal, username, password, req.body.SaleOrderId, req.body.ResCode, req.body.SaleReferenceId ).then( ( data ) => {
        if ( data.err ) {
            resp.send( 'error: ' + data.reason ).end();
        } else {
            resp.send( 'That was successful!' ).end();
        }
    } ).catch( ( e ) => {
        resp.send( 'error : ' + e ).end();
    } );
} );