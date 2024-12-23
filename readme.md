# Telegram Bot with Google Sheets Integration

This project is a Telegram bot built using Node.js and Telegraf. The bot collects user data through an interactive conversation and stores the data in a Google Sheet. The Google Sheet has the following columns:

- **Timestamp**
- **UserId**
- **Username**
- **Name**
- **Region**
- **City**
- **Age**
- **Phone Number**

## Features

- Start/Cancel options for data collection.
- Inline buttons for region selection.
- Validation and confirmation before saving data.
- Data stored in Google Sheets for persistent storage.

---

## Prerequisites

1. **Node.js** (v14 or later)
2. **npm** or **yarn** for dependency management.
3. A **Telegram Bot Token**. [Create a bot](https://core.telegram.org/bots#botfather) using BotFather.
4. **Google Cloud Project** with a service account for Sheets API.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <project_directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following:

```env
BOT_TOKEN=your_telegram_bot_token
```

Replace `your_telegram_bot_token` with the token you obtained from BotFather.

### 4. Google Sheets API Configuration

#### a. Enable Google Sheets API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services > Library**.
4. Search for **Google Sheets API** and click **Enable**.

#### b. Create a Service Account

1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials** > **Service Account**.
3. Set up the service account with the role **Editor**.
4. Download the JSON key file and save it as `google_credentials.json` in the project root.

#### c. Share the Google Sheet

1. Create a new Google Sheet.
2. Share it with the service account email (found in the JSON key file) and grant **Editor** access.
3. Note the spreadsheet ID from the URL (e.g., `https://docs.google.com/spreadsheets/d/<spreadsheet_id>/edit`).

### 5. Update the Code

1. Open the project in your editor.
2. Replace `YOUR_SPREADSHEET_ID` in the code with the actual spreadsheet ID.

---

## Running the Bot

### 1. Start the Bot

```bash
node index.js
```

### 2. Interact with the Bot

- Send `/start` to begin.
- Follow the prompts to provide your details.
- Use the "Cancel" option to stop at any time.

---

## Project Structure

```
project_root/
├── api-key/google_credentials.json    # Google service account credentials
├── index.js                   # Main bot logic
├── package.json               # Node.js dependencies
├── .gitignore                       # Gitignore file for environment variables
├── .env                       # Environment variables
└── README.md                  # Documentation
```

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## Troubleshooting

1. **Bot Not Responding**:

   - Ensure the bot token in `.env` is correct.
   - Verify the bot is running.

2. **Error Writing to Google Sheets**:

   - Ensure the service account has Editor access to the sheet.
   - Double-check the spreadsheet ID in the code.

3. **Missing Dependencies**:
   - Run `npm install` to install missing packages.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Future Enhancements

- Add multi-language support.
- Integrate analytics for tracking bot usage.
- Improve error handling and logging.
- And more robust features

---
