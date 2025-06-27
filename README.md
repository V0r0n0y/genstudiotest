# Roman Numeral Converter

A full-stack web application and API for converting numbers (1-3999) to Roman numerals. Built with Node.js/Express, React, and Adobe React Spectrum, with full observability (logs, metrics, traces) and Dockerized deployment.

- **API**: GET /romannumeral?query={1-3999} → {input, output}
- **UI**: React + Adobe React Spectrum, light/dark mode, input, button, result
- **Observability**: logs, metrics, traces (Winston, Prometheus, Jaeger)
- **Docker**: build and run with `docker build . && docker run -p 8080:8080 <image>`
- **No external Roman numeral libraries**

## Technology Choices
- **Node.js/Express**: Simple, robust backend for REST API.
- **React**: Modern, component-based UI.
- **Adobe React Spectrum**: Accessible, production-grade UI components.
- **Winston**: Structured logging for observability.
- **Prometheus**: Metrics collection and monitoring.
- **Jaeger**: Distributed tracing for performance and debugging.
- **Docker**: Consistent, portable deployment.
- **Jest**: Automated testing for reliability.

## Run locally
1. `npm install` in /server and /client
2. `npm run build` in /client
3. `node server/index.js`
4. Open http://localhost:8080

## Run in Docker
1. `docker build -t roman .`
2. `docker run -p 8080:8080 roman`

## 🚀 Features

- **Web Service**: RESTful API for Roman numeral conversion
- **React UI**: Modern, responsive interface using Adobe React Spectrum components
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Observability**: Logging, metrics, and distributed tracing
- **Docker Support**: Containerized deployment with multi-stage builds
- **Testing**: Unit and integration tests
- **Error Handling**: Robust validation and error management

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js
- **Roman Numeral Logic**: Custom implementation following historical conventions
- **Observability**: Winston logging, Prometheus metrics, Jaeger tracing
- **Testing**: Jest with supertest for API testing

### Frontend (React)
- **Framework**: React 18 with functional components and hooks
- **UI Library**: Adobe React Spectrum for consistent, accessible design
- **Styling**: CSS with responsive design and theme support
- **API Integration**: Fetch API with error handling and loading states

### Observability Stack
- **Logging**: Winston with structured JSON logging
- **Metrics**: Prometheus client with custom metrics
- **Tracing**: OpenTracing with Jaeger integration

## 📋 Requirements

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)
- Docker Compose (for full stack deployment)

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roman-numeral-converter
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start development servers**
   ```bash
   # Start both server and client in development mode
   npm run dev
   
   # Or start them separately:
   npm run server:dev  # Server on http://localhost:8080
   npm run client:dev  # Client on http://localhost:3000
   ```

### Docker Deployment

1. **Build and run with Docker**
   ```bash
   # Build the image
   docker build -t roman-numeral-converter .
   
   # Run the container
   docker run -p 8080:8080 roman-numeral-converter
   ```

2. **Full stack with observability**
   ```bash
   # Start all services (app + monitoring)
   docker-compose up -d
   
   # Access the application
   # Main app: http://localhost:8080
   # Jaeger UI: http://localhost:16686
   # Prometheus: http://localhost:9090
   # Grafana: http://localhost:3000 (admin/admin)
   ```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
The test suite includes:
- **Unit Tests**: Roman numeral conversion logic
- **API Tests**: Endpoint validation and error handling
- **Integration Tests**: Full request/response cycles
- **Edge Cases**: Boundary conditions and error scenarios

## 📚 API Documentation

### Endpoints

#### `GET /romannumeral?query={integer}`
Convert Arabic numeral to Roman numeral.
```bash
curl "http://localhost:8080/romannumeral?query=42"
```
**Response:**
```json
{
  "input": "42",
  "output": "XLII"
}
```

#### `GET /metrics`
Prometheus metrics endpoint.
```bash
curl http://localhost:8080/metrics
```

### Error Responses

| Status | Description | Example |
|--------|-------------|---------|
| 400 | Invalid input | `Number must be 1-3999` |
| 404 | Endpoint not found | `Not found` |
| 500 | Internal server error | `Internal server error` |

## 🎨 UI Features

### Components
- **Input Field**: Number input with validation (1-3999)
- **Convert Button**: Triggers API call with loading state
- **Result Display**: Shows conversion result
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile

### Theme Support
- **Automatic Detection**: Follows system dark/light mode preference
- **Accessibility**: High contrast and keyboard navigation

## 🔍 Observability

### Logging
- **Structured Logs**: JSON format with timestamps
- **Log Levels**: Error, warn, info, debug
- **Context**: Request tracking and correlation IDs

### Metrics
- **HTTP Metrics**: Request duration, counts, status codes
- **Business Metrics**: Conversion success rates, input ranges
- **System Metrics**: CPU, memory, active connections
- **Custom Metrics**: Roman numeral conversion performance

### Tracing
- **Distributed Tracing**: Request flow across services
- **Performance Analysis**: Operation timing and bottlenecks
- **Error Tracking**: Detailed error context and stack traces
- **Dependency Mapping**: Service interaction visualization

## 🚀 Deployment

### Production Considerations
- **Environment Variables**: Configure logging, metrics, and tracing
- **Health Checks**: Docker health checks and load balancer integration
- **Security**: Non-root user, security headers, input validation
- **Performance**: Optimized builds, caching, compression

### Environment Variables
```bash
NODE_ENV=production
PORT=8080
LOG_LEVEL=info
JAEGER_AGENT_HOST=jaeger
JAEGER_AGENT_PORT=6832
```

## 📖 Roman Numeral Rules

The application follows standard Roman numeral conventions:

### Basic Symbols
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000

### Rules
1. **Addition**: Larger symbols to the left add their values
2. **Subtraction**: Smaller symbols to the left subtract their values
3. **Repetition**: Same symbol can repeat up to 3 times
4. **Subtraction Limits**: Only I, X, C can be used for subtraction
5. **Range**: Valid range is 1-3999

### Examples
- 4 = IV (5-1)
- 9 = IX (10-1)
- 49 = XLIX (50-10 + 10-1)
- 3999 = MMMCMXCIX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request


## 🙏 Acknowledgments

- **Adobe React Spectrum**: For the excellent UI component library
- **Roman Numeral Specification**: Based on historical conventions and Wikipedia standards
- **Open Source Community**: For the various tools and libraries used
