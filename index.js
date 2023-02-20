const { Client, Collection, EmbedBuilder } = require("discord.js")
const Discord = require("discord.js")
const axios = require('axios')
const db = require('croxydb')
const client = new Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.MessageContent,
    ]
})

const config = require("./src/config.js")
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

let token = config.token

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token)

client.cooldowns = new Discord.Collection();
client.COOLDOWN_SECONDS = 30;

// Komutlar dosyasındaki komutları tarayarak uygulamaya ekliyor
const commands = []
readdirSync('./src/commands').forEach(async file => {
    const command = require(`./src/commands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
})

// Botun giriş yaptığından emin oluyoruz.
client.on("ready", async () => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        )
    } catch (error) {
        console.error(error)
    }
    console.log(`Bot logged in as ${client.user.tag}!`)
})


// Eventleri yüklüyor
readdirSync('./src/events').forEach(async file => {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
})

client.login(token)
