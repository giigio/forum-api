# Forum API

A robust forum API built with **TypeScript** following **Domain-Driven Design (DDD)** principles and **Clean Architecture**. This project demonstrates best practices in software architecture, including domain events, use cases, repositories, and comprehensive testing.

## 🚀 Features

### Core Functionality

- **Questions Management**: Create, edit, delete, and fetch questions
- **Answers Management**: Answer questions, edit and delete answers
- **Comments System**: Comment on both questions and answers
- **Best Answer Selection**: Question authors can mark the best answer
- **Attachments Support**: Add attachments to questions and answers
- **Notifications System**: Automated notifications using domain events

### Architecture Highlights

- **Domain-Driven Design (DDD)**: Clear separation of domain logic from infrastructure
- **Clean Architecture**: Independence from frameworks and external dependencies
- **Domain Events**: Event-driven architecture for cross-aggregate communication
- **Value Objects**: Slug generation and other value objects
- **Repository Pattern**: Abstract data persistence
- **Use Cases**: Business logic encapsulation
- **Either Pattern**: Functional error handling without exceptions

## 📁 Project Structure

```
src/
├── core/                           # Shared kernel
│   ├── entities/                   # Base entities and aggregate roots
│   │   ├── entity.ts
│   │   ├── aggregate-root.ts
│   │   ├── unique-entity-id.ts
│   │   └── watched-list.ts        # Track collection changes
│   ├── events/                     # Domain events infrastructure
│   │   ├── domain-event.ts
│   │   ├── domain-events.ts
│   │   └── event-handler.ts
│   ├── errors/                     # Base error classes
│   ├── repositories/               # Base repository interfaces
│   └── types/                      # Utility types
│
├── domain/                         # Business domains
│   ├── forum/                      # Forum bounded context
│   │   ├── application/            # Application layer
│   │   │   ├── repositories/       # Repository interfaces
│   │   │   └── use-cases/          # Business use cases
│   │   └── enterprise/             # Domain layer
│   │       └── entities/           # Domain entities
│   │           ├── question.ts
│   │           ├── answer.ts
│   │           ├── comment.ts
│   │           ├── attachment.ts
│   │           └── events/         # Domain events
│   │
│   └── notification/               # Notification bounded context
│       ├── application/
│       │   ├── repositories/
│       │   ├── subscribers/        # Event subscribers
│       │   └── use-cases/
│       └── enterprise/
│           └── entities/
│
└── tests/                          # Test files
    ├── forum/                      # Forum domain tests
    ├── notification/               # Notification tests
    ├── factories/                  # Test data factories
    ├── repositories/               # In-memory repositories
    └── utils/                      # Test utilities
```

## 🛠️ Technologies

- **TypeScript**: Type-safe development
- **Vitest**: Fast unit testing framework
- **Day.js**: Date manipulation
- **ESLint**: Code quality and consistency
- **Faker.js**: Test data generation

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/giigio/forum-api.git

# Navigate to the project directory
cd forum-api

# Install dependencies
npm install
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔍 Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## 🏗️ Architecture Patterns

### Domain-Driven Design (DDD)

The project is organized into bounded contexts:

- **Forum**: Handles questions, answers, and comments
- **Notification**: Manages user notifications

### Clean Architecture Layers

1. **Domain Layer** (`enterprise/entities/`): Pure business logic, no external dependencies
2. **Application Layer** (`application/`): Use cases and repository interfaces
3. **Infrastructure Layer** (`tests/repositories/`): In-memory implementations for testing

### Key Patterns

#### 1. **Entity & Aggregate Root**

```typescript
export class Question extends AggregateRoot<QuestionProps> {
  // Domain logic and business rules
}
```

#### 2. **Use Cases**

Each business operation is encapsulated in a use case:

```typescript
export class CreateQuestionUseCase {
  async execute(request: CreateQuestionUseCaseRequest) {
    // Business logic here
  }
}
```

#### 3. **Either Pattern**

Functional error handling:

```typescript
type Response = Either<Error, { question: Question }>
```

#### 4. **Domain Events**

Decouple aggregates using events:

```typescript
export class AnswerCreatedEvent implements DomainEvent {
  constructor(public answer: Answer) {}
}
```

#### 5. **Repository Pattern**

Abstract data access:

```typescript
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  create(question: Question): Promise<void>
}
```

#### 6. **Watched List**

Track collection changes for aggregate consistency:

```typescript
export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  // Automatically tracks added/removed items
}
```

## 📚 Use Cases

### Questions

- `CreateQuestionUseCase`: Create a new question with attachments
- `EditQuestionUseCase`: Update question content and attachments
- `DeleteQuestionUseCase`: Remove a question
- `GetQuestionBySlugUseCase`: Retrieve question by slug
- `FetchRecentQuestionsUseCase`: List recent questions with pagination
- `ChooseQuestionBestAnswerUseCase`: Mark an answer as the best

### Answers

- `AnswerQuestionUseCase`: Provide an answer to a question
- `EditAnswerUseCase`: Update answer content and attachments
- `DeleteAnswerUseCase`: Remove an answer
- `FetchQuestionAnswersUseCase`: List all answers for a question

### Comments

- `CommentOnQuestionUseCase`: Add a comment to a question
- `CommentOnAnswerUseCase`: Add a comment to an answer
- `DeleteQuestionCommentUseCase`: Remove a question comment
- `DeleteAnswerCommentUseCase`: Remove an answer comment
- `FetchQuestionCommentsUseCase`: List comments on a question
- `FetchAnswerCommentsUseCase`: List comments on an answer

### Notifications

- `SendNotificationUseCase`: Create and send a notification
- `ReadNotificationUseCase`: Mark a notification as read

## 🔔 Domain Events & Subscribers

The project uses domain events for cross-aggregate communication:

### Events

- `AnswerCreatedEvent`: Triggered when a new answer is created

### Subscribers

- `OnAnswerCreated`: Sends a notification to the question author when their question receives an answer

## 🧩 Domain Entities

### Core Entities

- **Question**: Forum questions with title, content, slug, and attachments
- **Answer**: Responses to questions with content and attachments
- **QuestionComment**: Comments on questions
- **AnswerComment**: Comments on answers
- **Attachment**: File attachments for questions and answers
- **Notification**: User notifications

### Value Objects

- **Slug**: URL-friendly question identifier
- **UniqueEntityID**: Universal identifier for entities

## 🔐 Business Rules

- Only question authors can edit or delete their questions
- Only question authors can choose the best answer
- Only answer authors can edit or delete their answers
- Only comment authors can delete their comments
- Questions automatically generate slugs from titles
- Recent questions are sorted by creation date
- Pagination uses 20 items per page
- Notifications are only visible to recipients

## 🧪 Testing Strategy

- **Unit Tests**: All use cases have comprehensive test coverage
- **In-Memory Repositories**: Fast, isolated tests without database dependencies
- **Factories**: Test data generation with Faker.js
- **Domain Events Testing**: Async event verification with `waitFor` utility
