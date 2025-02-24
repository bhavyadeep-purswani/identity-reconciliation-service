# Identity Reconciliation Service

This project implements an identity reconciliation service that links user identities across different touchpoints. The service processes incoming contact data, merges duplicate records, and returns structured customer profiles.

## 🚀 Features

- **Identity Resolution**: Detects and merges duplicate contacts based on email and phone number.
- **Contact Unification**: Groups related contacts under a single primary identifier.
- **Efficient Querying**: Provides consolidated customer profiles with linked contacts.
- **Scalable API**: Designed to handle large datasets efficiently.

## 🛠 Tech Stack

- **Node.js** (Backend)
- **Express.js** (API framework)
- **PostgreSQL** (Database)
- **Prisma** (ORM)
- **Docker** (Containerization)

## 📖 API Endpoints

### 🔍 Identify Contact
```http
POST /identify
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "phoneNumber": "+1234567890"
}
```
**Response:**
```json
{
  "primaryContactId": 1,
  "emails": ["john@example.com", "john.doe@example.com"],
  "phoneNumbers": ["+1234567890", "+1987654321"],
  "secondaryContactIds": [2, 3]
}
```

## 📌 How It Works

1. A new contact is received via the `/identify` endpoint.
2. The system checks for existing records with the same email or phone number.
3. If matches are found, the contact is linked to an existing profile.
4. A unified response is returned with all associated contacts.

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker (optional)

### Installation
```sh
git clone https://github.com/yourusername/identity-reconciliation.git
cd identity-reconciliation
npm install
```

### Environment Setup
Create a `.env` file and configure database credentials:
```
DATABASE_URL=DB URL
PORT=PORT_NUMBER
```

### Running the Service
#### Using Node.js
```sh
npm db-migrate-dev
npm start
```
#### Using Docker
```sh
docker-compose up --build
```

## 📈 Future Enhancements
- Support for additional identity attributes (e.g., social media handles).
- Advanced matching algorithms using machine learning.
- Graph-based identity linking for better scalability.

## 🤝 Contributing
Feel free to fork this repo and submit pull requests! Contributions are welcome.

## 📜 License
ISC License

---
Built with ❤️ by [Bhavyadeep Purswani](https://github.com/bhavyadeep-purswani)
