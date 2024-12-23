const { Telegraf } = require("telegraf");
const { google } = require("googleapis");
require("dotenv").config();

// Load credentials
const auth = new google.auth.GoogleAuth({
  keyFile: "./api-key/google_credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

const bot = new Telegraf(process.env.BOT_TOKEN);

let userResponses = {}; // Store user responses temporarily

// Start Command
bot.start((ctx) => {
  userResponses[ctx.chat.id] = {
    userId: ctx.from.id,
    username: ctx.from.username,
  };
  ctx.reply(
    "Welcome! Click 'Begin' to start data collection or 'Cancel' to exit.",
    {
      reply_markup: {
        keyboard: [["Begin", "Cancel"]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
});

// Begin Data Collection
bot.hears("Begin", (ctx) => {
  const chatId = ctx.chat.id;
  userResponses[chatId] = {
    userId: ctx.from.id,
    username: ctx.from.username,
  };
  ctx.reply("What is your full name?");
});

// Cancel Command
bot.hears("Cancel", (ctx) => {
  delete userResponses[ctx.chat.id];
  ctx.reply("Data collection canceled. Goodbye!");
});

// Handle Text Responses
bot.on("text", (ctx) => {
  const chatId = ctx.chat.id;
  const userText = ctx.message.text;

  if (!userResponses[chatId]) return; // Ignore if user hasn't started

  const userData = userResponses[chatId];

  if (!userData.name) {
    userData.name = userText;
    ctx.reply("Please select your region:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Addis Ababa", callback_data: "region_Addis Ababa" }],
          [{ text: "Oromia", callback_data: "region_Oromia" }],
          [{ text: "Amhara", callback_data: "region_Amhara" }],
          [{ text: "Tigray", callback_data: "region_Tigray" }],
        ],
      },
    });
  } else if (!userData.city) {
    userData.city = userText;
    ctx.reply("Please enter your age:");
  } else if (!userData.age) {
    userData.age = userText;
    ctx.reply("Please enter your phone number:");
  } else if (!userData.phoneNumber) {
    userData.phoneNumber = userText;
    ctx.reply(
      `You entered:\nName: ${userData.name}\nRegion: ${userData.region}\nCity: ${userData.city}\nAge: ${userData.age}\nPhone: ${userData.phoneNumber}\n\nClick 'Confirm' to save or 'Cancel' to exit.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Confirm", callback_data: "confirm" }],
            [{ text: "Cancel", callback_data: "cancel" }],
          ],
        },
      }
    );
  }
});

// Handle Inline Buttons
bot.on("callback_query", async (ctx) => {
  const chatId = ctx.chat.id;
  const data = ctx.callbackQuery.data;

  if (data.startsWith("region_")) {
    userResponses[chatId].region = data.split("_")[1];
    ctx.reply("Please enter your city:");
  } else if (data === "confirm") {
    await saveDataToSheet(chatId, ctx);
    ctx.reply("Thank you! Your responses have been saved.");
    delete userResponses[chatId];
  } else if (data === "cancel") {
    delete userResponses[chatId];
    ctx.reply("Data collection canceled. Goodbye!");
  }
});

// Save Data to Google Sheets
async function saveDataToSheet(chatId, ctx) {
  const userData = userResponses[chatId];
  const timestamp = new Date().toISOString();

  const row = [
    timestamp,
    userData.userId,
    userData.username,
    userData.name,
    userData.region,
    userData.city,
    userData.age,
    userData.phoneNumber,
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: "1dZlDGsg3RXAhnh16STGklM4XAijceMsSXzDrN-oyumU",
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    console.error("Error saving data to Google Sheets:", error);
    ctx.reply("An error occurred while saving your data. Please try again.");
  }
}

// Start the bot
bot.launch();
console.log("Bot is running...");
