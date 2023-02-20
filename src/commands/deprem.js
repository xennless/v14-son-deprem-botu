const { EmbedBuilder } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const axios = require('axios')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("son-deprem")
        .setDescription("Türkiyede olan son depremleri gösterir!"),
    run: async (client, intreaction) => {
        if (client.cooldowns.has(intreaction.user.id)) {
            const cooldownembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setDescription(`Bekleme süresi var! **(${client.COOLDOWN_SECONDS} Saniye)**`)
                .setFooter({ text: "API sisteminden engel almamak için bekleme süresi vardı!"})
            intreaction.reply({ embeds: [cooldownembed], ephemeral: true });
        } else {
            let response = await axios.get('https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=1')
            const emb = new EmbedBuilder()
                .setTitle('Türkiye Son Olan Deprem')
                .setFields(
                    { name: "Yer", value: `${await response.data.result[0].lokasyon}` },
                    { name: "Zaman", value: `${await response.data.result[0].date}`, inline: true },
                    { name: "Şiddeti", value: `**${await response.data.result[0].mag}**`, inline: true },
                    { name: "Derinlik", value: `${await response.data.result[0].depth}`, inline: true },
                    { name: "Enlem", value: `${await response.data.result[0].lat}`, inline: true },
                    { name: "Boylam", value: `${await response.data.result[0].lng}`, inline: true })
                .setTimestamp()
                .setFooter({ text: "Tüm veriler Kandilli Rasathane'sinden alınıyor!" })

            intreaction.reply({ embeds: [emb] })
            client.cooldowns.set(intreaction.user.id, true);

            // After the time you specified, remove the cooldown
            setTimeout(() => {
                client.cooldowns.delete(intreaction.user.id);
            }, client.COOLDOWN_SECONDS * 1000);
        }


    }
}

