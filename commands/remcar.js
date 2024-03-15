// commands/remcar.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const mysql = require('mysql2/promise');
const axios = require('axios');
const { dbConfig, webhookUrl } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remcar')
        .setDescription('Remove um Civic do usuário especificado.')
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
            if (rows.length == 0) {
                const errorMsg = `O ID ${userId} não possui um Civic para remover.`;
                await interaction.reply({ content: errorMsg, ephemeral: true });
                await sendWebhook(webhookUrl, userId, interaction.user.tag, interaction.user.displayAvatarURL(), false, errorMsg);
            } else {
                await connection.execute('DELETE FROM vrp_user_vehicles WHERE user_id = ? AND vehicle = "civic"', [userId]);
                const successMsg = `Civic removido com sucesso do ID ${userId}.`;
                await interaction.reply({ content: successMsg, ephemeral: true });
                await sendWebhook(webhookUrl, userId, interaction.user.tag, interaction.user.displayAvatarURL(), true, successMsg);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = `Erro ao executar o comando /remcar para o ID ${userId}.`;
            await interaction.reply({ content: errorMsg, ephemeral: true });
            await sendWebhook(webhookUrl, userId, interaction.user.tag, interaction.user.displayAvatarURL(), false, errorMsg);
        } finally {
            await connection.end();
        }
    }
};

async function sendWebhook(url, userId, executorTag, executorAvatarUrl, success, customMessage) {
    const color = success ? 0x00FF00 : 0xFF0000;
    const title = success ? 'Remoção bem-sucedida' : 'Falha na remoção';
    const embed = {
        color,
        title,
        description: customMessage,
        timestamp: new Date(),
        footer: {
            text: `Sistema de Gerenciamento de Veículo do Aftermath - Ação por ${executorTag}`,
            icon_url: executorAvatarUrl
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
