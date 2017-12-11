const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const blacklist = require('./blacklist.json');
const alist = require('./admins.json');
const util = require('util');
const fs = require('fs');
const afklist = require('./away.json');
const vios = require('./violations.json')

function clean(text) {
  if(typeof(text) === "string")
  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, + String.fromCharCode(8203));
  else
    return text;
}

client.on("ready", () => {
  console.log('Wack\'s Bot is online');
  console.log(`${client.user.id}`);
  client.user.setGame(`https://www.youtube.com/channel/UCQvsvKGIxKryvu8CXQaG0lg`)
  console.log(`in ${client.guilds.size} servers`)
});

client.on('channelCreate', channel => {

});

client.on('voiceStatusUpdate', (oldMember, newMember) => {
  if(!oldMember.guild.id === "148139917975748608") return;

      const embed = new Discord.RichEmbed()
  .setTimestamp()
  .setColor(0x00AE86)
  .setDescription(`
   **Action:** User Moved.
**User:** ${oldMember.author.username}#${oldMember.author.discriminator}.
**Old Channel:** ${oldMember.voiceChannel.name}.
**New Channel:** ${newMember.voiceChannel.name}.
  `)

  client.channels.get('362248697779585024').send({embed});
});

client.on('guildBanAdd', member => {
    member.guild.fetchAuditLogs({user: member.id, type: 'MEMBER_BAN_ADD', limit: 1}).then(logs => {
		      const embed = new Discord.RichEmbed()
  .setTimestamp()
  .setColor(0x00AE86)
  .setDescription(`
   **Action:** User Banned.
**User:** ${member.username}.
**Reason:** ${logs.entry.reason}.
**Moderator**: ${logs.entry.executor}.
  `)
  client.channels.get('362248697779585024').send({embed});
	})
});

client.on('guildBanRemove', member => {

//
});

client.on('messageDelete', message => {
  if(message.author.id === "383376177907105804") return;
  if(message.content.startsWith(";purge") || message.content.startsWith(";prune")) return;
    const embed = new Discord.RichEmbed()
  .setTimestamp()
  .setColor(0x00AE86)
  .setDescription(`
   **Action:** Message Deleted
**User:** ${message.author.username}#${message.author.discriminator}
**Channel:** <#${message.channel.id}>
**Content:** \`${message.content}\`
  `)

  client.channels.get('362248697779585024').send({embed});
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.content.includes('http')) return;
	if(oldMessage.author.id === "383376177907105804") return;
  const embed = new Discord.RichEmbed()
  .setTimestamp()
  .setColor(0x00AE86)
  .setDescription(`
   **Action:** Message Edited
**User:** ${oldMessage.author.username}#${oldMessage.author.discriminator}
**Channel:** <#${oldMessage.channel.id}>
**Message Before:** \`${oldMessage.content}\`
**Message Now:** \`${newMessage.content}\`
  `)

  client.channels.get('362248697779585024').send({embed});
});

client.on('message', message => {
});

client.on('guildMemberAdd', member => {
	if(!member.guild.id === "148139917975748608") return;
  const role = member.guild.roles.find('id', '309825595662139392');
  console.log(`Adding the role to ${member.user.username}#${member.user.discriminator}`)
  member.addRole(role)

  setTimeout(() => {
	if(member.hasRole(role)) {
     member.removeRole(role)
  }
  }, 1200000);

  console.log(`Welcoming ${member.user.username}#${member.user.discriminator}.`);
  const channel = member.guild.channels.find('id', '384027998401069057');

  channel.send(`<@${member.id}>, Welcome to **${member.guild.name}**, You will be able to speak in 20 minutes, We now have **${member.guild.memberCount} members**!`)
});

client.on('guildMemberRemove', member => {
	if(!member.guild.id === "148139917975748608") return;
  const channel = member.guild.channels.find('id', '384027998401069057');
  channel.send(`**${member.user.username}#${member.user.discriminator}** has left the server, we now have **${member.guild.memberCount} members**.`)
});

client.on('message', message => {
    const admin = alist.includes(message.author.id)

 if(!admin) return;

  const args = message.content.split(/[ ]/);

  const command = message.content.split(" ")[0].toLowerCase().slice(config.prefix.length);

  if(!message.content.startsWith(config.prefix) || blacklist.includes(message.author.id)) return;

  	if(command === "guilds") {
	message.channel.send(client.guilds.map(g => {`${g.name} | ${g.memberCount}`}));
	}

  if(command === "hi") {
      message.reply('Hello!')
  }

  if(command === "restart") {
	  message.channel.send(`Restarting! :wave:`).then(() => {
        process.exit();
	  });
  };

  if(command === "eval") {
	try {
	const code = args.slice(1).join(" ");
	var evaled = eval(code);

	if (typeof evaled !== "string")
		evaled = require("util").inspect(evaled);

	message.channel.send(clean(evaled), {code:"xl"});
} catch (err) {
	message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
}
}

   if(command === "bypass") {
	  var role = message.guild.roles.find('id', '309825595662139392');

	  message.channel.send(`${message.author} has bypassed ${message.mentions.users.first()} from the mute, timestamped \`${new Date()}\``).then(() => {
		  message.guild.member(message.mentions.users.first()).removeRole(role);
	  });
  }

if(command === "unafk") {
				fs.readFile("./away.json", (err, data) => {
			if (!err) {
				var away = JSON.parse(data);
						if (away.indexOf(message.author.id) > -1) {
							var removedUser = util.format("%s#%s", message.author.username, message.author.discriminator);
							delete away[message.author.id];
							var newAway = JSON.stringify(away);
							fs.writeFile("./away.json", newAway, (writeErr) => {
								if (!writeErr) {
									message.channel.send(`${removedUser} is now back`);
								}
							});
			} else if (away.infexOf(message.author.id) === -1) {
			    message.channel.send("You arent AFK...")
			}
		}
	})
}


  if(command === "blacklistadd") {
  if(!admin) return message.reply('You are not an bot administrator');

if(blacklist.includes(message.mentions.users.first().id)) return message.reply('That user is already blacklisted ya ejit')

var addedUser = util.format("%s#%s", message.mentions.users.first().username, message.mentions.users.first().discriminator);
							blacklist.push(message.mentions.users.first().id);
							var newBlackList = JSON.stringify(blacklist);
							fs.writeFile("./blackList.json", newBlackList, (writeErr) => {
								if (!writeErr) {
									message.channel.send("Successfully blacklisted " + addedUser);
								}
							});
}

if(command === "alert") {
  var user = message.mentions.users.first()
  var author = message.author

  message.channel.send(`Alerted ${user} with the reason ${args.slice(2).join(" ")}`)
  user.send(`${author} alerted you with the reason ${args.slice(2).join(" ")} in ${message.guild.name}`)
}

if(command === "addadmin") {
  if(!admin) return message.reply('You are not an bot administrator');

if(alist.includes(message.mentions.users.first().id)) return message.reply('That user is already an admin ya ejit')

var addedUser = util.format("%s#%s", message.mentions.users.first().username, message.mentions.users.first().discriminator);
							alist.push(message.mentions.users.first().id);
							var newAdmins = JSON.stringify(alist);
							fs.writeFile("./admins.json", newAdmins, (writeErr) => {
								if (!writeErr) {
									message.channel.send("Successfully added " + addedUser + " to the admin list.");
								}
							});
}

if(command === "afk") {
  if(afklist.includes(message.author.id)) return message.reply('Apparently you\'re already AFK')

  

var addedUser = util.format("%s#%s", message.author.username, message.author.discriminator);
							afklist.push(message.author.id);
							var newAway = JSON.stringify(afklist);
							fs.writeFile("./away.json", newAway, (writeErr) => {
								if (!writeErr) {
									message.channel.send(`${message.author.username}#${message.author.discriminator} is now AFK`);
								}
							});
}

if(command === "food") {
	message.reply("NOM NOM NOM NOM NOM")
}

if(command === "ban") {
	var user = message.mentions.users.first()

	if(!user) return message.reply('I cant ban no-one you idiot');

	message.guild.members.get(user.id).ban().then(() => {
		message.channel.send(`${user} has been kicked`)
})
}

if(command === "fight") {
  var a = message.author
  var u = message.mentions.users.first();
	var winners = [
		`${u}`,
    `${a}`]

	var result = Math.floor((Math.random() * winners.length) + 0 )

  message.channel.send(`${a} slaps ${u}`);
  message.channel.send(`${u} swings a right hook into ${a}'s liver`);
  message.channel.send(`${a} shoulder flips ${u} bruising 3 of ${u}'s ribs`);
  message.channel.send(`${u} gets up and hits ${a} with a folding chair flinging ${a} out of the ring`);
  message.channel.send(`${a} gets back into the ring and punches ${u} in the face 3 times`)
  message.channel.send(`The bell rings and we have a winner! ${winners[result]}`)
}

  if(command === "help") {
      message.reply("Please check your DMs. :incoming_envelope:").then(() => {
          message.author.send(`**Commands** \`\`\`#hi - Says hello\n#ping - Shows the bots ping\n#serverinfo - shows info on the server\n#userinfo - shows info on the mentioned user\n#play - plays the requested song, takes links from youtube and will search youtube if given a query\n#queue - shows the queue\n#leave - leaves the voice channel\n#clearqueue - clears the current queue\n#volume - sets the volume to the specified number between 1 and 200\n#skip - skips the specified ammount of songs, defaults to 1 if non specified\n#roles - shows roles for the guild\`\`\``)
      });
  }

  if(command === "kick") {
	  if(!admin) return message.reply('You are not a bot administrator, you are unable to do this.');

	  var user = message.mentions.users.first();
	  var author = message.author
	  var text = args.slice(2).join(" ");

    if(!user) return message.reply('You must mention a user to kick')
    if(!text) return message.reply('You must supply a reason for the kick')

	  message.guild.members.get(message.mentions.users.first().id).kick().then(() => {
	  message.channel.send(`${author} has kicked ${user} for ${text}`)
	  });
  }

  if(command === "warn") {
	  if(!admin) return message.reply("Nope.")
	  var reason = args.slice(2).join(" ");
	  var user = message.mentions.users.first();
	  var author = message.author

const embed = new Discord.RichEmbed()
  .setTimestamp()
  .setColor(0x00AE86)
  .setDescription(`
   **Action:** User Warned
**Moderator:** ${message.author.username}#${message.author.discriminator}
**User:** ${message.mentions.users.first().username}#${message.mentions.users.first().discriminator}
**Channel:** <#${message.channel.id}>
**Reason:** \`${reason}\`
  `)

	  if(!user) return message.reply(`Who do you want to warn?`);
	  if(!reason) return message.reply(`Why do you want to warn ${user}`)

	  user.send(`You have been warned by **${author}** in **${message.guild.name}** for **${reason}**`).then(() => {
	  message.channel.send(`${author} has warned ${user} for ${reason}`)
	  }).then(() => {
  client.channels.get('362248697779585024').send({embed});
	  }).then(() => {
var addedUser = util.format("%s#%s", message.mentions.users.first().username, message.mentions.users.first().discriminator);
							vios.push("\n" + author.username + "#" + author.discriminator + " warned " + user.username + "#" + user.discriminator + " for " + reason);
							var newWarn = JSON.stringify(vios);
							fs.writeFile("./violations.json", newWarn, (writeErr) => {
								if (!writeErr) {
								}
							});
		  });
};

if(command === "warns") {
    fs.readFile('./violations.json', (err, data) => {

      var list = JSON.parse(data)

      message.channel.send(`\`\`\`${list}\`\`\``)

});
};

  if(command === "purge" || command === "prune") {
    if(!admin) return message.reply('Nope.');
    try {

    //message.reply("Nope.")

    var messages = args.slice(1).join(" ");

    if(!messages) return message.channel.send('You need to specify how many messages you want to delete.');
    


    if(messages > 99) return message.reply('Well, No.. I cant delete anymore than 99 messages at a time')

    message.delete()
    message.channel.fetchMessages({limit: messages}).then(m => {
      message.channel.bulkDelete(m)
    })
  } catch (err) {
    console.log(err)
  }
}

  if(command === "rps") {
    const random = Math.random();
    let botChoice = '';
    const userChoice = message.content.substring((config.prefix + 'rps ').length).toLowerCase();

    if (userChoice === 'rock' || userChoice === 'paper' || userChoice === 'scissors') {
      if (random >= 0 && random < 0.33) {
        botChoice = 'rock';
      } else if (random >= 0.33 && random < 0.66) {
        botChoice = 'paper';
      } else if (random >= 0.66 && random <= 1) {
        botChoice = 'scissors';
      }

      const result = checkWhoWins(botChoice, userChoice);
      const username = message.author.username;
      let winnerString = ``;
      const versusString = `${username} chose **${userChoice}**, I chose **${botChoice}**`;

      if (result === 'bot') {
        winnerString = `**i won!**`;
      } else if (result === 'user') {
        winnerString = `**${username} wins!**`;
      } else if (result === 'draw') {
        winnerString = `**It's a draw!**`;
      }

      message.channel.send(`${versusString}. ${winnerString}`);
    } else {
      message.channel.send(`**${userChoice}** is not a valid RPS choice`);
    }
};

function checkWhoWins(botChoice, userChoice) {
  if (botChoice === 'rock' && userChoice === 'paper') {
    return 'user';
  } else if (botChoice === 'paper' && userChoice === 'scissors') {
    return 'user';
  } else if (botChoice === 'scissors' && userChoice === 'rock') {
    return 'user';
  } else if (botChoice === 'paper' && userChoice === 'rock') {
    return 'bot';
  } else if (botChoice === 'rock' && userChoice === 'scissors') {
    return 'bot';
  } else if (botChoice === 'scissors' && userChoice === 'paper') {
    return 'bot';
  } else { // eslint-disable-line
    return 'draw';
  }
};

if(command === "say") {
  message.delete();
  message.channel.send(args.slice(1).join(" "))
}

if(command === "slap") {
	message.channel.send(`${message.author} slapped ${message.mentions.users.first()}`)
}

if(command === "flip") {
const plates = ["Heads.",
 "Tails.",
 "The coin has landed standing....."
 ];

const result = Math.floor((Math.random() * plates.length) + 0);

message.channel.send(plates[result])
}

if(command === "roleinfo") {
	
}



 if(command === 'serverinfo') {
    message.channel.send({
        embed: {
            color: 3447003,
            author: {
                name: `${message.guild.name}`,
                icon_url: "https://cdn-images-1.medium.com/max/230/1*OoXboCzk0gYvTNwNnV4S9A@2x.png"
            },
            "thumbnail": {
                "url": "https://cdn-images-1.medium.com/max/230/1*OoXboCzk0gYvTNwNnV4S9A@2x.png"
            },
            fields: [{
                    name: "Guild Owner",
                    value: `${message.guild.owner}`
                },
                {
                    name: "Total Amount of Members",
                    value: `${message.guild.members.filter(u => u.user.bot === false).size} Members and ${message.guild.members.filter(m=>m.user.bot).size} bots`
                },
                {
                    name: "Date of the Guild was Created",
                    value: `${message.guild.createdAt.toLocaleString()}`
                },
                {
                    name: "Server Region",
                    value: `${message.guild.region}`
                },
    {
  name: "Number of Roles",
  value: `${message.guild.roles.size} roles`
    }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: message.author.avatarURL,
                text: `${message.guild.name} is kewl`
            }
        }
    })
};

  if(command === "userinfo") {
	         var user = message.mentions.users.first();
	         if (!user) {
	             user = message.author;
	         }
	         var nick = message.guild.members.get(user.id).nickname;
	         if (!nick) {
	             nick = 'No Nicknames';
	         }
	         var status = user.presence.status;
	         if (status === 'online') {
	             status = 'Online';
	         } else if (status === 'idle') {
	             status = 'Idle';
	         } else if (status === 'dnd') {
	             status = 'Do Not Disturb';
	         } else {
	             status = 'Invisible';
	         }
	         var isStream = 'Current Game';
	         if (user.presence.game && user.presence.game.streaming) {
	             isStream = 'Current Stream';
	         }
	         var game;
	         if (user.presence.game === null) {
	             game = 'No Game Displayed';
	         } else if (user.presence.game.streaming) {
	             game = `[${user.presence.game.name}](${user.presence.game.url})`;
	         } else {
	             game = user.presence.game.name;
	         }
	         var roles = message.guild.members.get(user.id).roles.map(r => r.name).slice(1).join('\n');
	         if (roles.length === 0) roles = 'None';

	         message.channel.send({
	             embed: {
	                 color: 10038562,
	                 title: 'User Info',
	                 fields: [{
	                         name: 'Name',
	                         value: `${user.username}#${user.discriminator}`,
	                         inline: true
	                     },
	                     {
	                         name: 'ID',
	                         value: user.id,
	                         inline: true
	                     },
	                     {
	                         name: 'Nickname',
	                         value: nick,
	                         inline: true
	                     },
	                     {
	                         name: 'Roles',
	                         value: roles,
	                         inline: true
	                     },
	                     {
	                         name: 'Joined Server',
	                         value: message.guild.members.get(user.id).joinedAt.toUTCString(),
	                         inline: true
	                     },
	                     {
	                         name: 'Joined Discord',
	                         value: user.createdAt.toUTCString(),
	                         inline: true
	                     },
	                     {
	                         name: 'Status',
	                         value: status,
	                         inline: true
	                     },
	                     {
	                         name: isStream,
	                         value: game,
	                         inline: true
	                     }
	                 ],
	                 thumbnail: {
	                     url: user.displayAvatarURL
	                 }
	             }
	         });
	     };

		 if(command === "") {
			 
		 }

});

client.on('message', message => {

  const admin = alist.includes(message.author.id)

  if(!admin) return;

  const args = message.content.split(/[ ]/);

  const command = message.content.split(" ")[0].toLowerCase();

  if(message.author.bot) return;

  if(blacklist.includes(message.author.id)) return;
/*
  if(message.content.includes("man")) {
	  message.channel.send('dude')
  }

  if(message.content.includes("dude")) {
   message.channel.send("sweet")
  }

  if(message.content.includes("sweet")) {
	  message.channel.send("dude")
  }

  if(message.content.includes("what")) {
	  message.channel.send("huh?")
  }

  if(message.content.includes("STUFFIN!")) {
	  message.channel.send('yes... stuffin')
  }

  if(message.content.includes("idk")) {
	  message.channel.send("me either")
  } */

  if(message.content.includes(message.mentions.users.first())) {
  if(afklist.includes(message.mentions.users.first().id)) {
  message.reply(`${message.mentions.users.first()} is away right now.`);
  };
};

if(message.content.startsWith(`<@${client.user.id}> prefix`)) {
	message.reply(`The prefix for this server is \`${config.prefix}\``)
}

if(command === "@everyone") {
	var user = message.mentions.users.first();
	var author = message.author;

	message.channel.send(`${author} Y U MENTION EVERYONE?!?!?`)
}

});

client.on('message', async (message) => {

	      const admin = alist.includes(message.author.id)
	 if(!admin) return;

    const args = message.content.split(/[ ]/);

  const command = message.content.split(" ")[0].toLowerCase().slice(config.prefix.length);

	  if(!message.content.startsWith(config.prefix)) return;

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
});


const YoutubeDL = require('Youtube-DL');
const ytdl = require("ytdl-core");
const prefix = config.prefix


	let PREFIX = prefix;
	let GLOBAL = false;
	let MAX_QUEUE_SIZE = 1000;
	let DEFAULT_VOLUME = 100;
	let ALLOW_ALL_SKIP = true;
	let CLEAR_INVOKER = false;

	// Create an object of queues.
	let queues = {};

	// Catch message events.
	client.on('message', msg => {
	const isAdmin = alist.includes(msg.author.id)

		const message = msg.content.trim();
		// Check if the message is a command.
		if (message.toLowerCase().startsWith(PREFIX.toLowerCase())) {
			// Get the command and suffix.
			const command = message.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim();
			const suffix = message.substring(PREFIX.length + command.length).trim();

			// Process the commands.
			switch (command) {
				case 'play':
					return play(msg, suffix);
				case 'skip':
					return skip(msg, suffix);
				case 'queue':
					return queue(msg, suffix);
				case 'pause':
					return pause(msg, suffix);
				case 'resume':
					return resume(msg, suffix);
				case 'volume':
					return volume(msg, suffix);
				case 'leave':
					return leave(msg, suffix);
				case 'clearqueue':
					return clearqueue(msg, suffix);
				case 'join':
				    return join(msg)
			}
			if (CLEAR_INVOKER) {
				msg.delete();
			}
		}
	});

	/**
	 * Checks if a user is an admin.
	 *
	 * @param {GuildMember} member - The guild member
	 * @returns {boolean} -
	 */
	function isAdmin(member) {
		    return alist.includes(member.id)
	}

	/**
	 * Checks if the user can skip the song.
	 *
	 * @param {GuildMember} member - The guild member
	 * @param {array} queue - The current queue
	 * @returns {boolean} - If the user can skip
	 */
	function canSkip(member, queue) {
		if (ALLOW_ALL_SKIP) return true;
		else if (queue[0].requester === member.id) return true;
		else if (isAdmin(member)) return true;
		else return false;
	}

	/**
	 * Gets the song queue of the server.
	 *
	 * @param {integer} server - The server id.
	 * @returns {object} - The song queue.
	 */
	function getQueue(server) {
		// Check if global queues are enabled.
		if (GLOBAL) server = '_'; // Change to global queue.

		// Return the queue.
		if (!queues[server]) queues[server] = [];
		return queues[server];
	}

	/**
	 * The command for adding a song to the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response edit.
	 */
	function play(msg, suffix) {
		// Make sure the user is in a voice channel.
		if (msg.member.voiceChannel === undefined) return msg.channel.send( 'You\'re not in a voice channel.');

		// Make sure the suffix exists.
		if (!suffix) return msg.channel.send( 'No video specified!');

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.channel.send( 'Maximum queue size reached!');
		}

		// Get the video information.
		msg.channel.send({embed: {
		color: 3447003,
		author: {
			name: msg.author.user,
			icon_url: msg.author.avatarURL
		},
		title: `${msg.author.username}`,
		description: `has requested a song`,
		fields: [{
				name: "Searching for",
				value: `**${suffix}**`
			}],
				timestamp: new Date(),
		footer: {
			icon_url: msg.author.avatarURL,
			text: msg.author.username + ` is epic`
		}
		}
		}).then(response => {
			var searchstring = suffix
			if (!suffix.toLowerCase().startsWith('http')) {
				searchstring = 'gvsearch1:' + suffix;
			}

			YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.
				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					return response.edit( 'Invalid video!');
				}

				info.requester = msg.author.id;

				// Queue the video.
				response.edit({embed: {
				color: 3447003,
				author: {
					name: msg.author.user,
					icon_url: msg.author.avatarURL
				},
				title: `${msg.author.username}`,
				description: `has requested a song to be queued`,
				fields: [{
						name: "Queued",
						value: `**${info.title}**`
					}],
						timestamp: new Date(),
				footer: {
					icon_url: msg.author.avatarURL,
					text: msg.author.username + ` is epic`
				}
			}
		}).then(() => {
					queue.push(info);
					// Play if only 1 element in the queue.
					if (queue.length === 1) executeQueue(msg, queue);
				}).catch(console.log);
			});
		}).catch(console.log);
	}

	/**
	 * 
	 * @param {Message} msg
	 */

	function join(msg) {
		msg.member.voiceChannel.join().then(() => {
			msg.channel.send(`Joined ${msg.member.voiceChannel.name}`)
		});
	}


	/**
	 * The command for skipping a song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function skip(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send( 'No music being played.');

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canSkip(msg.member, queue)) return msg.channel.send( 'You cannot skip this as you didn\'t queue it.').then((response) => {
			response.delete(5000);
		});

		// Get the number to skip.
		let toSkip = 1; // Default 1.
		if (!isNaN(suffix) && parseInt(suffix) > 0) {
			toSkip = parseInt(suffix);
		}
		toSkip = Math.min(toSkip, queue.length);

		// Skip.
		queue.splice(0, toSkip - 1);

		// Resume and stop playing.
		const dispatcher = voiceConnection.player.dispatcher;
		if (voiceConnection.paused) dispatcher.resume();
		dispatcher.end();

		msg.channel.send( 'Skipped ' + toSkip + '!');
	}

	/**
	 * The command for listing the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function queue(msg, suffix) {
		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Get the queue text.
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n');

		// Get the status of the queue.
		let queueStatus = 'Stopped';
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection !== null) {
			const dispatcher = voiceConnection.player.dispatcher;
			queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
		}

		// Send the queue and status.
		msg.channel.send( 'Queue (' + queueStatus + '):\n' + text);
	}

	/**
	 * The command for pausing the current song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function pause(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send('No music being played.');

		if (!isAdmin(msg.member))
			return msg.channel.send( 'You are not authorized to use this.');

		// Pause.
		msg.channel.send({embed: {
		color: 3447003,
		author: {
			name: msg.author.user,
			icon_url: msg.author.avatarURL
		},
		title: `${msg.author.username}`,
		description: `has paused the song`,
		fields: [{
				name: "Song paused:",
				value: `**${video.title}**`
			}],
				timestamp: new Date(),
		footer: {
			icon_url: msg.author.avatarURL,
			text: msg.author.username + ` is epic`
		}
	}
});
		const dispatcher = voiceConnection.player.dispatcher;
		if (!dispatcher.paused) dispatcher.pause();
	}

	/**
	 * The command for leaving the channel and clearing the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function leave(msg, suffix) {
		if (isAdmin(msg.member)) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send( 'I\'m not in any channel!.');
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
		} else {
			msg.channel.send( 'You don\'t have permission to use that command!');
		}
	}

	/**
	 * The command for clearing the song queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function clearqueue(msg, suffix) {
		if (isAdmin(msg.member)) {
			const queue = getQueue(msg.guild.id);

			queue.splice(0, queue.length);
			msg.channel.send( 'Queue cleared!');
		} else {
			msg.channel.send( 'You don\'t have permission to use that command!');
		}
	}

	/**
	 * The command for resuming the current song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function resume(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		dispatcher.resume();
		if (voiceConnection === null) return msg.channel.send( 'No music being played.');

		if (!isAdmin(msg.member))
			return msg.channel.send( 'You are not authorized to use this.');

  /*global info*/

		// Resume.
		msg.channel.send({embed: {
		color: 3447003,
		author: {
			name: msg.author.user,
			icon_url: msg.author.avatarURL
		},
		title: `${msg.author.username}`,
		description: `has resumed playback`,
		fields: [{
				name: "Resumed:",
				value: `**${info.title}**`
			}],
				timestamp: new Date(),
		footer: {
			icon_url: msg.author.avatarURL,
			text: msg.author.username + ` is epic`
		}
	}
});

		const dispatcher = voiceConnection.player.dispatcher;
		dispatcher.resume();
	}

	/**
	 * The command for changing the song volume.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function volume(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send('No music being played.');

		if (!isAdmin)
			return msg.channel.send('You are not authorized to use this.');

		// Get the dispatcher
		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 200 || suffix < 0) return msg.channel.send('Volume out of range!').then((response) => {
			response.delete(5000);
		});

		msg.channel.send("Volume set to " + suffix);
		dispatcher.setVolume((suffix/100));
	}

	/**
	 * Executes the next song in the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {object} queue - The song queue for this server.
	 * @returns {<promise>} - The voice channel.
	 */
	function executeQueue(msg, queue) {
		// If the queue is empty, finish.
		if (queue.length === 0) {
			msg.channel.send({embed: {
			color: 3447003,
			author: {
				name: msg.author.user,
				icon_url: msg.author.avatarURL
			},
			title: `${msg.author.username}`,
			description: `Playback finished`,
			fields: [{
					name: "Song over"
				}],
					timestamp: new Date(),
			footer: {
				icon_url: msg.author.avatarURL,
				text: msg.author.username + ` is epic`
			}
		}
	});

			// Leave the voice channel.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection !== null) return voiceConnection.disconnect();
		}

		new Promise((resolve, reject) => {
			// Join the voice channel if not already in 1.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) {
				// Check if the user is in a voice channel.
				if (msg.member.voiceChannel) {
					msg.member.voiceChannel.join().then(connection => {
						resolve(connection);
					}).catch((error) => {
						console.log(error);
					});
				} else {
					// Otherwise, clear the queue and do nothing.
					queue.splice(0, queue.length);
					reject();
				}
			} else {
				resolve(voiceConnection);
			}
		}).then(connection => {
			// Get the first item in the queue.
			const video = queue[0];

			console.log(`${msg.author.username}#${msg.author.discriminator} has requested "${video.title}" to be played in ${msg.guild.name}`);

			// Play the video.
			msg.channel.send({embed: {
			color: 3447003,
			author: {
				name: msg.author.user,
				icon_url: msg.author.avatarURL
			},
			title: `${msg.author.username}`,
			url: `${video.webpage_url}`,
			description: `has requested a song`,
			fields: [{
					name: "Now playing",
					value: `**${video.title}**`
				}],
					timestamp: new Date(),
			footer: {
				icon_url: msg.author.avatarURL,
				text: msg.author.username + ` is epic`
			}
		}
	}).then(() => {
				let dispatcher = connection.playStream(ytdl(video.webpage_url, {filter: 'audioonly'}), {seek: 0, volume: (100)});

				connection.on('error', (error) => {
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('error', (error) => {
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('end', () => {
					// Wait a second.
					setTimeout(() => {
						if (queue.length > 0) {
							// Remove the song from the queue.
							queue.shift();
							// Play the next song in the queue.
							executeQueue(msg, queue);
						}
					}, 1);
				});
			}).catch((error) => {
				console.log(error);
			});
		}).catch((error) => {
			console.log(error);
		});
	}

/*global video*/


/**
 * Wrap text in a code block and escape grave characters.
 *
 * @param {string} text - The input text.
 * @returns {string} - The wrapped text.
 */
function wrap(text) {
	return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}

client.login(config.token);
