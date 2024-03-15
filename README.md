# MigManagerBot

## Sobre

**MigAutoManager** é um bot do Discord projetado para gerenciar estoques de veículos em servidores do FiveM. Este bot atualiza os estoques de veículos em tempo real, além de permitir a adição e remoção de Civics da garagem dos jogadores. Construído com Discord.js, MigAutoManager oferece uma experiência interativa rica, utilizando Embeds, Buttons e Slash Commands para facilitar a gestão e interação.

## Funcionalidades

- **Gestão de Estoque**: Atualiza e gerencia o estoque de veículos por marca, permitindo aos jogadores verificar o estoque disponível diretamente no Discord.
- **Gerenciamento de Veículos**: Permite aos administradores adicionar ou remover um Civic da garagem de um jogador, uma funcionalidade útil para premiações ou administração do servidor. (você pode alterar o carro na linha 22 do addcar.js)
- **Interação Intuitiva**: Utiliza Embeds, Buttons e Slash Commands para uma experiência de usuário suave e interativa.
- **Logs de Atividades**: Mantém um registro das ações realizadas através dos comandos, enviando detalhes para um webhook especificado.

## Pré-requisitos

Antes de iniciar o bot, certifique-se de que você possui Node.js instalado em sua máquina. Além disso, você precisará criar um bot no [Portal do Desenvolvedor do Discord](https://discord.com/developers/applications) e adicionar o token do bot ao arquivo de configuração.

## Configuração

### config.json

Para configurar o bot, crie um arquivo `config.json` na raiz do projeto com o seguinte formato:

```json
{
  "token": "SEU_TOKEN_AQUI",
  "dbConfig": {
    "host": "ENDEREÇO_DO_SERVIDOR_DE_BANCO_DE_DADOS",
    "user": "USUÁRIO_DO_BANCO_DE_DADOS",
    "database": "NOME_DO_BANCO_DE_DADOS",
    "password": "SENHA_DO_BANCO_DE_DADOS"
  },
  "webhookUrl": "URL_DO_SEU_WEBHOOK_PARA_LOGS",
  "guildId": "ID_DO_SERVIDOR_DISCORD",
  "clientId": "ID_DO_BOT_DISCORD"
}
```

- token: Token do bot, obtido através do Portal do Desenvolvedor do Discord.
- dbConfig: Configurações do banco de dados MySQL para conexão.
- host: Endereço do servidor de banco de dados.
- user: Usuário para acessar o banco de dados.
- database: Nome do banco de dados utilizado.
- password: Senha do usuário do banco de dados.
- webhookUrl: URL do webhook do Discord para enviar logs dos comandos /addcar e /remcar.
- guildId: ID do servidor Discord onde o bot está ativo.
- clientId: ID do bot no Discord.

## Instalação
- Clone o repositório para sua máquina local.
- Navegue até o diretório do projeto via terminal.
- Execute npm install para instalar as dependências necessárias.
- Configure o arquivo config.json conforme descrito acima.
- Inicie o bot com node index.js

## Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

