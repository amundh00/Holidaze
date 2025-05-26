# Holidaze

Holidaze is a modern venue booking application built with React, Vite, and Tailwind CSS. Users can browse, search, and book venues, while venue managers can list and manage their own venues.

## Features

- Browse and search for venues
- Filter venues by facilities (WiFi, parking, breakfast, pets)
- Book venues with date and guest selection
- User authentication (login, signup)
- Profile management
- Venue management for venue managers (list, edit, delete venues)
- Responsive design
- Interactive maps for venue locations

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Leaflet](https://leafletjs.com/) (for maps)
- [date-fns](https://date-fns.org/) (date handling)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-slick](https://react-slick.neostack.com/) (image carousel)

## Fonts

- **Headings:** DM Serif Display
- **Body:** Funnel Sans

Fonts are loaded via Google Fonts and configured in [tailwind.config.js](tailwind.config.js) and [src/index.css](src/index.css).

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/holidaze.git
   cd holidaze
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Noroff API URL and API key.

4. **Start the development server:**
   ```sh
   npm run dev
   ```

5. **Open in your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production

```sh
npm run build
```

### Linting

```sh
npm run lint
```

## Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

## API

This project uses the [Noroff API](https://api.noroff.dev/). You need a valid API key and endpoint, which should be set in your `.env` file.

## License

MIT

---

**Made with ❤️ for the Noroff course project.**
