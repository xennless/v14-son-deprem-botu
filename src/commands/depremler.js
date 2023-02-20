const { EmbedBuilder } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const axios = require('axios')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("depremler")
        .setDescription("Türkiyede olan son depremleri gösterir!")
        .addIntegerOption(option => option.setName("name").setDescription("Kaç adet depremleri görmek istiyorsunuz?!").setMinValue(1).setMaxValue(10).setRequired(true)),
    run: async (client, intreaction) => {
        if (client.cooldowns.has(intreaction.user.id)) {
            const cooldownembed = new EmbedBuilder()
                .setColor('DarkRed')
                .setDescription(`Bekleme süresi var! **(${client.COOLDOWN_SECONDS} Saniye)**`)
                .setFooter({ text: "API sisteminden engel almamak için bekleme süresi vardı!" })
            intreaction.reply({ embeds: [cooldownembed], ephemeral: true });
        } else {
            const sayi = intreaction.options.getInteger("name")
            let response = await axios.get(`https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=${sayi}`);

            const embeds = response.data.result.map((deprem, index) => {
                return new EmbedBuilder()
                    .setDescription(`Türkiye Son **${index + 1}**. Depremi`)
                    .setFields(
                        { name: "Yer", value: `${deprem.lokasyon}` },
                        { name: "Zaman", value: `${deprem.date}`, inline: true },
                        { name: "Şiddeti", value: `**${deprem.mag}**`, inline: true },
                        { name: "Derinlik", value: `${deprem.depth}`, inline: true },
                        { name: "Enlem", value: `${deprem.lat}`, inline: true },
                        { name: "Boylam", value: `${deprem.lng}`, inline: true })
                    .setTimestamp()
                    .setFooter({ text: "Tüm veriler Kandilli Rasathane'sinden alınıyor!" });
            });

            intreaction.reply({ embeds: embeds });
            client.cooldowns.set(intreaction.user.id, true);

            // After the time you specified, remove the cooldown
            setTimeout(() => {
                client.cooldowns.delete(intreaction.user.id);
            }, client.COOLDOWN_SECONDS * 1000);
        }


    }
}

