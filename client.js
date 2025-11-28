import WebSocket from 'ws';
import readline from 'readline';
import { clearLine, cursorTo } from 'readline';

const startClient = () => {
  //cli setup
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Creates a new WebSocket connection to the specified URL.
  const client = new WebSocket('ws://localhost:8080');

  //open connection
  client.on('open', function open() {
    console.log('Connected to the server');

    //user input
    rl.setPrompt('Enter a message: ');
    rl.prompt();  

    rl.on('line', (line) => {
      client.send(line);
      rl.prompt();
    });
  });

  //receive messages from server
  client.on('message', function message(data) {
    //just to clean up the output a bit
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    console.log(`${data}`);
    rl.prompt();
  });

  
  //handle errors
  client.on("error", (error) => {
    console.error("Websocket error:", error);
  });

  //close connection
  client.on("close", () => {
    console.log("\n The server has been closed.");
    // closes the cli
    rl.close();
  });

};

export { startClient };