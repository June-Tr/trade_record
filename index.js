// let connector = require("./back-end/model/connector");

/**This is a temporarily version of this, while waiting for the front end HTML to be built
 *  This consist of a application loop
 */
let flag = true;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


let commandController = function(flag){
  
  if(flag){
    readline.question(`Enter command: \n`, command => { 
      // exist command
      if(command.toLocaleLowerCase() == "exist" || command.toLocaleLowerCase() == "out" || command.toLocaleLowerCase() == "destroy"){
        console.log("Process to exist!");
        readline.close()
        flag = false;
        return;
      }

      commandController(flag);
    })
  }
}

// start the first run of the command controller
commandController(flag);