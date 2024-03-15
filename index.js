const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType  } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { dbConfig,token } = require('./config.json');
const mysql = require('mysql2/promise');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const botName = packageJson.name;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}


const vehicleNames = {
    "tmfiatunot": "Fiat Uno Turbo",
    "weevil": "AFT Weevil",
    "wolfsbane": "AFT Wolfsbane",
    "wrx15": "Subaru WRX STI 2015",
    "xj6": "Yamaha XJ6",
    "yosemite": "AFT Yosemite",
    "fuscatsi": "Volkswagen Fusca TSI",
    "gli": "Volkswagen Jetta GLI",
    "growler": "AFT Growler",
    "gti": "Volkswagen Golf GTI",
    "hakuchou": "AFT Hakuchou",
    "hornet": "Honda Hornet",
    "italigto": "AFT Itali GTO",
    "jester3": "AFT Jester ",
    "jugular": "AFT Jugular",
    "coupe": "Chevrolet Opala SS",
    "kanjo": "AFT Kanjo",
    "komoda": "AFT Komoda",
    "manchez": "AFT Manchez",
    "mareaweek": "Fiat Marea Weekend",
    "monza": "Chevrolet Monza",
    "n350z": "Nissan 350Z",
    "nivus": "Volkswagen Nivus",
    "osiris": "AFT Osiris",
    "pcj": "AFT PCJ-600",
    "ram2500": "Dodge Ram 2500",
    "ranger9": "Ford Ranger",
    "rebla": "AFT Rebla GTS",
    "rs3s20": "Audi RS3 2020",
    "sultan2": "AFT Sultan Classic",
    "sultanrs": "AFT Sultan RS",
    "tailgater": "AFT Tailgater",
    "69charger": "Dodge Charger 1969",
    "akuma": "AFT Akuma",
    "bati": "AFT Bati 801",
    "bf400": "AFT BF400",
    "bifta": "AFT Bifta",
    "blista2": "AFT Blista Compact",
    "bmw328sedan": "BMW 328i Sedan",
    "brioso": "AFT Brioso",
    "brioso2": "AFT Brioso Retro",
    "caracara2": "AFT Caracara 4x4",
    "cartrailer": "AFT Carretinha",
    "cg160": "Honda CG160",
    "chevettedl": "Chevrolet Chevette",
    "civic19": "Honda Civic G10",
    "civicsi": "Honda Civic SI",
    "cliffhanger": "AFT Cliffhanger",
    "club": "AFT Club",
    "comet3": "AFT Retro Custom",
    "comet6": "AFT Comet SR",
    "cypher": "AFT Cypher",
    "drafter": "AFT 8F Drafter",
    "dukes3": "AFT Dukes",
    "elegy": "AFT Elegy RH8",
    "faggio": "AFT Faggio",
    "sultanrs": "AFT Sultan RS",
    "yosemite2": "AFT Yosemite",
    "tailgater2": "AFT Tailgater",
    "corvettec5z06": "Chevrolet Corvette C5 Z06",
    "impalass": "Chevrolet Impala SS",
    "checol17": "Chevrolet Colorado",
    "gol": "Volkswagen Gol Quadrado",
    "caravan": "Chevrolet Caravan",
    "benze55": "Mercedes E55",
    "golf4": "Volkswagen Golf Sapão",
    "focusrs": "Ford Focus RS",
    "cb500x": "Honda CB500X",
    "95stang": "Ford Mustang 95",
};


// Conexão com a Database
let db;
mysql.createConnection(dbConfig).then(connection => {
    db = connection;
    console.log(`${botName}: ✅ Conexão com a database bem-sucedida.`);
}).catch(console.error);

// ID do canal e URL do Webhook
const channelId = "1213730793621553152";

client.once('ready', async() => {
    console.log(`${botName}: Bot inicializado com sucesso usando esse discord: ${client.user.tag}.`);

    const statuses = [
        { text: 'Cuidando dos Civics do Tiktok', emoji: '🚗' },
        { text: 'Cuidando do Estoque da Concessionária', emoji: '🔧' },
        { text: 'aftermath.com.br', emoji: '💼' }
    ];

    let index = 0;

    const setStatus = () => {
        const status = statuses[index];
        client.user.setPresence({
            activities: [
                {
                    name: status.text,
                    type: ActivityType.Watching,
                }
            ]
        });
        index = (index + 1) % statuses.length;
    };

    // Define o status inicial
    setStatus();

    // Atualiza o status a cada 60 segundos (60000 milissegundos)
    setInterval(setStatus, 60000);

    await sendBrandSelectionMessage(channelId, null, true); // Exclui mensagens antigas
});



client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

    if (interaction.isButton()) {
        await handleBrandSelection(interaction);
        return; // Prevent further processing if it's a button interaction
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({ content: 'No command found.', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});


async function sendBrandSelectionMessage(channelId, interaction = null, deletePrevious = true) {
    const channel = await client.channels.fetch(channelId);

    if (deletePrevious) {
        // Exclui todas as mensagens no canal
        await channel.messages.fetch().then(messages => {
            channel.bulkDelete(messages);
        }).catch(console.error);
    }

    const brands = ['AFT', 'Honda', 'Chevrolet', 'BMW', 'Dodge','Audi','Fiat','Ford','Mercedes', 'Volkswagen', 'Subaru', 'Yamaha', 'Nissan'];
    const rows = [new ActionRowBuilder()];

    brands.forEach((brand, index) => {
        if (index % 5 === 0 && index > 0) rows.push(new ActionRowBuilder());
        rows[rows.length - 1].addComponents(
            new ButtonBuilder()
                .setCustomId(brand.toLowerCase())
                .setLabel(brand)
                .setStyle(ButtonStyle.Primary),
        );
    });

    const embed = new EmbedBuilder()
        .setTitle('Selecione uma Marca de Veículo')
        .setDescription('Clique no botão correspondente à marca do veículo para ver os estoques disponíveis.');

    const messagePayload = { embeds: [embed], components: rows };
    if (interaction) {
        await interaction.update({ ...messagePayload, ephemeral: true });
    } else {
        await channel.send(messagePayload);
    }
}
async function handleBrandSelection(interaction) {
    if (!interaction.isButton()) return; // Ensure this function only processes button interactions

    // Attempt to defer the reply if the processing might take a while.
    // This acknowledges the interaction immediately and gives you up to 15 minutes to respond.
    await interaction.deferReply({ ephemeral: true });

    const brand = interaction.customId; // Assumes the customId is the brand
    const brandVehicles = Object.entries(vehicleNames).filter(([_, name]) => name.toUpperCase().includes(brand.toUpperCase()));
    
    const embeds = [];
    let currentEmbed = new EmbedBuilder()
        .setTitle(`Estoque de Veículos - ${brand.toUpperCase()}`)
        .setColor(0x0099FF);
    let counter = 0;

    for (const [vehicleCode, vehicleName] of brandVehicles) {
        if (counter >= 25) {
            embeds.push(currentEmbed);
            currentEmbed = new EmbedBuilder()
                .setTitle(`Estoque de Veículos - ${brand.toUpperCase()} (cont.)`)
                .setColor(0x0099FF);
            counter = 0;
        }
        
        const [results] = await db.execute('SELECT estoque FROM nation_concessionaria WHERE vehicle = ?', [vehicleCode]);
        if (results.length > 0) {
            const estoque = results[0].estoque;
            currentEmbed.addFields({ name: vehicleName, value: `Estoque: ${estoque}`, inline: true });
            counter++;
        }
    }

    if (counter > 0) embeds.push(currentEmbed);

    // Edit the initial reply or follow up if additional time was needed after deferring.
    await interaction.editReply({ embeds: embeds, ephemeral: true });
}


client.on('messageCreate', async message => {
    // Ignora mensagens de bots e verifica se a mensagem contém a palavra "civic"
    if (message.author.bot || !message.content.toLowerCase().includes('civic')) return;
    
    // Substitua 'ID_DA_CATEGORIA' pelo ID real da categoria
    const categoryID = '1064590566479904911';

    // Verifica se a mensagem foi enviada em um canal que pertence à categoria especificada
    if (message.channel.parentId === categoryID) {
        // Envia a imagem no canal
        message.channel.send('https://r2.fivemanage.com/pub/q80ym2i2gi7e.png');
    }
});

client.login(token);
