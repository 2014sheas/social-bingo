# Social Bingo

A social bingo game app built with React Native, Firebase, and Redux.

## Features

- User authentication with Firebase
- Create and join bingo games
- Real-time game updates
- Group management
- Traditional and custom bingo cards
- Multiplayer support

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment set up
- Firebase project with Firestore and Authentication enabled

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/social-bingo.git
cd social-bingo
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Firebase configuration:

- Get your Firebase configuration from the Firebase Console
- Replace the placeholder values in `.env` with your actual Firebase credentials

5. Start the development server:

```bash
npm start
# or
yarn start
```

6. Run on iOS:

```bash
npm run ios
# or
yarn ios
```

7. Run on Android:

```bash
npm run android
# or
yarn android
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # Configuration files
├── navigation/     # Navigation setup
├── screens/        # Screen components
├── services/       # API and service functions
├── store/          # Redux store and slices
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Set up Firestore security rules
5. Add your web app to the Firebase project
6. Copy the Firebase configuration to your `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
