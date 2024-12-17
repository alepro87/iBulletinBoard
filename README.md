# Bulletin Board Application

A modern web application that allows users to create, manage, and share advertisements within their local community. Users can post advertisements with details such as title, description, location, and category, while also being able to search, filter, and sort through existing posts.

## Technologies Used

### Backend
- **.NET 8** - Latest version of the .NET platform
- **Clean Architecture** - Organized in layers (Core, Infrastructure, API)
- **Repository Pattern** - For data access abstraction
- **Specification Pattern** - For query encapsulation
- **JSON File Service** - For data persistence
- **RESTful API** - Following REST principles for the web API

### Frontend
- **Angular 18** - Latest version of the Angular framework
- **Angular Material** - For UI components and styling
- **Tailwind CSS** - For custom styling and responsive design
- **TypeScript** - For type-safe code
- **RxJS** - For reactive programming

## Features

- **Advertisement Management**
  - Create new advertisements
  - Update existing advertisements
  - Delete advertisements
  - Owner-only CRUD operations

- **Browse & Search**
  - Search functionality
  - Category filtering
  - Location filtering
  - Multiple sorting options
  - Pagination support

- **User Interface**
  - Material design components
  - User-friendly forms
  - Modern and clean layout

## Project Structure

### Backend
```
├── API/
│   ├── Controllers/
│   ├── Data/
│   ├── Properties/
│   └── RequestHelpers/
├── Core/
│   ├── Entities/
│   ├── Interfaces/
│   └── Specifications/
└── Infrastructure/
    └── Data/
```

### Frontend
```
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   ├── features/
│   │   │   └── board/
│   │   ├── layout/
│   │   └── shared/
│   │       └── models/
│   └── environments/
```

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js (LTS version)
- Angular CLI
- Git

### Backend Setup
1. Clone the repository
```bash
git clone <repository-url>
```

2. Navigate to the API project directory
```bash
cd API
```

3. Restore dependencies and run the application
```bash
dotnet restore
dotnet run
```

The API will be available at `https://localhost:5001`

### Frontend Setup
1. Navigate to the client directory
```bash
cd client
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## Development Guidelines

### Backend
- Follow Clean Architecture principles
- Use repository pattern for data access
- Implement specifications for complex queries
- Follow RESTful API conventions
- Include XML comments for API documentation

### Frontend
- Follow Angular best practices
- Use standalone components
- Implement proper error handling
- Follow Material Design guidelines
- Use Tailwind utility classes for custom styling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Angular Material team for the UI components
- Tailwind CSS team for the utility-first CSS framework
- The .NET team for the robust backend framework
