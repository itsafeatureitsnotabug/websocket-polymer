# websocket-polymer
A chat webcomponent build using Redux, Immutable, and of course Polymer. 

## \<ws-poly\>

### Description
This is the webcomponent build using basic polymer framework with native websockets. This component comprises of a simple chat application. The chat connects to the server whose URL is mentioend on the textbox. 

The 'Send' button sends the message that was entered in the adjcent textbox. The payload sent to user is shown on the textbox below. To make the interaction more verbose, a time stamp is added to each message sent. 

Once message is received by the client, it is again displayed in the same text box. 

For usability, the text box refreshes after every 20 messages. And an optional feature to disconnect from the websocket server is also given to the client ( using the 'Disconnect' button ).


## Installation

### Installing Polymer CLI
Make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. 

### Installing Other Dependencies
Navigate to '/test/Websocket-Server-Test' and install all necessary modules by issuing command.
```
$ npm install 
$ bower install
$ gulp crisp
```


## Demo

### Start WebSocket Server
First, start the bundled websocket server. 
Step 1 : Navigate to  directory 'Websocket-Server-Test/' 

Step 2 : Install all required modules by issuing command :
```
$ npm install
```

Step 3 : Start websocket server using following command :
```
$ node app.js
```

### Launch the WebComponent
In new terminal tab, go to 'ws-poly' home directory. Start component using following command.
```
$ polymer serve
```

On browser, navigate to : "http://localhost:8080/components/ws-poly/demo/index.html"

Enjoy !! 




## Running Tests

Run the test using command : 

```
$ polymer test
```



## Useful References for your development : 

1. Polymer.org starter kit.

2. Patterns in polymers by chris strom. And this link : 
http://japhr.blogspot.com/2015/04/the-debugger-and-breakpoints-with-web.html

3. Redux / Immutable Starter kit.

4. Google code labs : 
https://codelabs.developers.google.com/codelabs/polymer-es2015/index.html?index=..%2F..%2Findex#0


## Usage 
Add the component using bower : 
'''
$ bower install --save https://github.com/itsafeatureitsnotabug/websocket-polymer.git
'''

Import and use component in your markup :
'''
<link rel="import" href="../v-ws-poly.html">
...
<ws-poly></ws-poly>
...
'''

