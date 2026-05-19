# cronify

> Simple web UI to write, test, and schedule cron expressions with human-readable previews and local timezone support.

---

## Features

- 📝 Write and validate cron expressions in real time
- 🕐 Human-readable previews (e.g. `"Every day at 9:00 AM"`)
- 🌍 Local timezone detection and conversion
- ✅ Test expressions against upcoming run dates

---

## Installation

```bash
git clone https://github.com/yourusername/cronify.git
cd cronify && npm install && npm start
```

---

## Usage

Open `http://localhost:3000` in your browser and start typing a cron expression in the input field.

```
Expression:  0 9 * * 1-5
Preview:     Every weekday at 9:00 AM
Next runs:
  → Mon, Jun 16 2025 09:00:00 AM (Local)
  → Tue, Jun 17 2025 09:00:00 AM (Local)
  → Wed, Jun 18 2025 09:00:00 AM (Local)
```

You can also paste an existing cron expression to instantly decode and preview it.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm run build` | Build for production |
| `npm test` | Run the test suite |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) © 2025 yourusername