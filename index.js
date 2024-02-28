const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const PORT = 8000;
const token = '6861958515:AAFtLJnKgI0qXOoyc2UdlQKbuWxp--kHCFA';
const bot = new TelegramBot(token, { polling: true });
// const URL = 'https://lighterboiii.github.io/vpn-bot/';
const URL = 'https://main--vpnstool.netlify.app';
const app = express();

app.use(express.json());
app.use(cors());

const removeTyPrefix = (inputString) => {
  if (inputString.toLowerCase().startsWith("ты ")) {
    return inputString.slice(3).trim();
  } else {
    return inputString;
  }
};

const returnAnswer = (string) => {
  if (string && string.toLowerCase().startsWith("ты ")) {
    const changedString = removeTyPrefix(string);
    return 'А может быть ты ' + changedString.toLowerCase() + ' или подумаешь ещё?';
  } else {
    return 'А может быть ты ' + string?.toLowerCase() + ' ёпта?';
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Оформить подписку на наш VPN-сервис или попробовать его бесплатно можно по кнопке ниже', {
      reply_markup: {
        keyboard: [
          [{ text: 'Запустить приложение', web_app: { url: `${URL}/signup` }}]
        ]
      }
    });
  } else {
    if (!msg?.web_app_data?.data) {
      bot.sendMessage(chatId, returnAnswer(text), {
        reply_markup: {
          keyboard: [
            [{ text: 'Нажми на кнопочку', web_app: { url: URL } }]
          ]
        }
      });
    }
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      data.name ? 
      await bot.sendMessage(chatId, `Привет, ${data?.name}`) :
      await bot.sendMessage(chatId, `Привет`)

      setTimeout(async () => {
        await bot.sendMessage(chatId, `Твоя почта: ${data?.email}`);
        await bot.sendMessage(chatId, `Твой номер: ${data?.phone}`);
      }, 300)
    } catch (e) {
      console.log(e);
    }
  }
});

app.post('/web-data', async (req, res) => {
  const { queryId, selectedPlan } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешно',
      input_message_content: {
        message_text: `Поздравляем с покупкой. Ваша подписка ${selectedPlan.name}`
      }
    })
    return res.status(200).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({});
  }
});

app.listen(PORT, () => console.log('Работаю на порту ' + PORT))