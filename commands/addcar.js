// commandos/addcar.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const mysql = require('mysql2/promise');
const axios = require('axios');
const { dbConfig, webhookUrl } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcar')
        .setDescription('Adiciona um Civic ao usuário especificado.')
        .addIntegerOption(option => option.setName('id').setDescription('O ID do usuário').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has('1074354404649619457') && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
            return;
        }

        const userId = interaction.options.getInteger('id');
        const connection = await mysql.createConnection(dbConfig);

        try {
            const [rows] = await connection.execute('SELECT * FROM vrp_user_vehicles WHERE user_id = ? AND vehicle = "civic"', [userId]);
            if (rows.length > 0) {
                const errorMsg = `O ID ${userId} já possui um Civic.`;
                await interaction.reply({ content: errorMsg, ephemeral: true });
                await sendWebhook(webhookUrl, userId, interaction.user, false, false, errorMsg);
            } else {
                await connection.execute('INSERT INTO vrp_user_vehicles (user_id, vehicle) VALUES (?, "civic")', [userId]);
                const successMsg = `Civic adicionado com sucesso ao ID ${userId}.`;
                await interaction.reply({ content: successMsg, ephemeral: true });
                await sendWebhook(webhookUrl, userId, interaction.user, true, false, successMsg);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = `Erro ao executar o comando para o ID ${userId}.`;
            await interaction.reply({ content: errorMsg, ephemeral: true });
            await sendWebhook(webhookUrl, userId, interaction.user, false, true, errorMsg);
        } finally {
            await connection.end();
        }
    }
};

async function sendWebhook(url, userId, executor, success, connectionError = false, customMessage) {
    let color = success ? 0x00FF00 : 0xFF0000;
    let description = customMessage;
    const embed = {
        color: color,
        title: success ? 'Operação bem-sucedida' : 'Operação falhou',
        description: description,
        fields: [{ name: 'Quem digitou o comando:', value: executor.tag, inline: true }],
        timestamp: new Date(),
        footer: {
            text: 'Sistema de Gerenciamento de Veículo do Aftermath',
            icon_url: executor.displayAvatarURL()
        }
    };

    try {
        await axios.post(url, {
            embeds: [embed],
            username: 'Bot System'
        });
    } catch (error) {
        console.error("Erro ao enviar webhook:", error);
    }
}
