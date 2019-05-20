//setup project
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

//define errors
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

//send ready message to console
client.on("ready", () => {
    console.log("I am ready!");
});

  try{
    client.on("message", async message => {
    //will not respond to bots
    if(message.author.bot) return;
    //only messages starting with the prefix will be run
    if(message.content.indexOf(config.prefix) !== 0) return;
    //formats the command for you
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    //ping server for latency
      if(command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        }

    //set a role for a period of time
      if(command === "timeout") {
        //check if user calling this command has the proper permission level
        if(message.member.hasPermission('MANAGE_ROLES')){
          //define how to differentiate arguments passed in the message
          //will take the message and slice it into multiple args at each " "
          const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
          //sets all args to lowercase
          const command = args.shift().toLowerCase();
          //set arg values to variables
          let userNameArg = args[0];
          let roleNameArg = args[1];
          let timeArg = args[2];
          //get guild so that you know which discord server to search
          var server = message.guild.id;
          const guild = client.guilds.get(server);
          //try catch in case role isn't in server
          try{
            //set the role based on the role arg passed in
            const role = guild.roles.find("name", roleNameArg.toString());
            //try catch in case user isn't in server
            try{
              //find and set the member based on the username arg passed in
              let member = message.guild.members.find('displayName', userNameArg.toString());
              //await function that will last until the timeout period.
              //will set the role on the user, await until the timeArg timeout is finished, and then remove the role
                await member.addRole(role).then(() => {
                  setTimeout(() => {
                    member.removeRole(role);
                  }, timeArg*1000*60);
                });
                //send a direct message stating that the user has been allocated that role
                message.member.sendMessage(`${member.displayName} has been given ${role.name} for ${timeArg} minute(s)`)
            }catch (err){
              //if the user doesn't exist on the server, send a DM saying so
              message.member.sendMessage("User does not exist in server. Please make sure that the username is correctly spelled.");
            }
          }catch (err) {
            //if the role doesn't exist on the server, send a DM saying so
            message.member.sendMessage("Role does not exist in server. Please make sure that role has no spaces or symbols and is correctly spelled.");
          }
        }else{
        //if you don't have the proper user permissions, send a DM saying so
        message.member.sendMessage("You do not have permissions to use this bot. Please contact your server administrator if you feel this is incorrect.");
        }
      }
    });

    //login to the discord
      client.login(config.token);

  }catch (err) {
      console.log(err.name); // ReferenceError
      console.log(err.message); // is not defined
      console.log(err.stack); // ReferenceError: is not defined at ...
      // Can also show an error as a whole
      // The error is converted to string as "name: message"
      console.log(err); // ReferenceError: is not defined
  };
