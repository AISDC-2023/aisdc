# aisdc
This repository contains the companion web application for Track 3: AI Playground in [AI Student Developer Conference 2023](https://learn.aisingapore.org/aisdc2024/).

The application is developed using Firebase product and services which includes [Firebase Authentication](https://firebase.google.com/docs/auth), [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore), [Firebase Cloud Functions](https://firebase.google.com/docs/functions), and [Firebase Hosting](https://firebase.google.com/docs/hosting).

## Project Structure

The following is a basic overview of the project structure:

| Name | Description |
| ---- | ----------- |
| 📁 .github | GitHub Actions workflow for CI/CD to Firebase Hosting and Firebase Cloud Function |
| 📁 functions | Backend of the web application built using [Firebase Cloud Functions](https://firebase.google.com/docs/functions). |
| 📁 qr-codes | QR Code generated for the booths and users |
| 📁 scripts | Python scripts to generate and save QR Codes |
| 📁 web-app | Frontend of the React web application built using [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Headless UI](https://headlessui.dev/). |
| 📄 .firebaserc | Firebase project configuration |
| 📄 .gitignore | Git ignore file |
| 📄 firebase.json | Firebase configuration |
| 📄 firebase.indexes.json | Firebase Firestore indexes configuration |
| 📄 firebase.rules | Firebase Firestore security rules |

## Getting Started (Local Development)

### web-app
1. Install the dependencies using `npm install`.
2. Run the development server using `npm run dev`.

### functions
1. Install the dependencies using `npm install`.
2. Run the development server using `npm run serve`.

## Contact

- [Wong Zhao Wu](https://github.com/kiritowu) (Backend Developer, Cloud Engineer)
- [Chung Wei Tat](https://github.com/cweitat) (Front-end Developer, UI/UX Designer)
- [Kshitij Parashar](https://github.com/xitij27) (Front-end Developer)
