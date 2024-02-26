const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const PORT = 8000;
const token = '6861958515:AAFtLJnKgI0qXOoyc2UdlQKbuWxp--kHCFA';
const bot = new TelegramBot(token, { polling: true });
const URL = 'https://lighterboiii.github.io/vpn-bot/';
const app = express();

app.use(express.json());
app.use(cors());

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    //   await bot.sendMessage(chatId, 'Оформить подписку на наш VPN-сервис или попробовать его бесплатно можно по кнопке ниже', {
    //     reply_markup: {
    //       keyboard: [
    //         [{ text: 'Кнопка ниже', web_app: {url: `${URL}/signin`}}]
    //       ],
    //     }
    //   });
    await bot.sendMessage(chatId, 'Оформить подписку на наш VPN-сервис или попробовать его бесплатно можно по кнопке ниже', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Кнопка ниже', web_app: { url: URL } }]
        ]
      }
    });
  } else {
    bot.sendMessage(chatId, 'А может быть ты '+ text.toLowerCase() + ', ёпта', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Лучше вот сюда вот нажми', web_app: { url: URL } }]
        ]
      }
    });
  }
// это тоже движуха на потом вся
  if(msg?.web_app_data?.data) {
    try {
        const data = JSON.parse(msg?.web_app_data?.data)
        console.log(data)
        await bot.sendMessage(chatId, 'Спасибо за обратную связь!')

        setTimeout(async () => {
            await bot.sendMessage(chatId, 'тут что то напишем в ответе');
        }, 3000)
    } catch (e) {
        console.log(e);
    }
}
});

// дальше методы-заглушки, потом их сделать ЖЕСТКО!
app.post('тут путь сделать', async (req, res) => {
  const {} = req.body; // вытащить поля
  try {
      await bot.answerWebAppQuery(queryId, {
          type: 'article',
          id: queryId,
          title: 'тут сделать титлу',
          input_message_content: {
              message_text: 'здесь будет текст ответа'
          }
      })
      return res.status(200).json({});
  } catch (e) {
      return res.status(500).json({})
  }
});

app.listen(PORT, () => console.log('server started on PORT ' + PORT))