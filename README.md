# Flytrap React SDK

## Getting Started
To start using Flytrap in your React project:

1. Go to the Flytrap website.
2. Click on "New Project."
3. You’ll be provided with a Project ID, API Key, and Endpoint specific to your project.
4. These values are essential for configuring the SDK.

## Installation
Install the Flytrap React SDK via npm:

```bash
npm install flytrap_react
```

## Usage
Initialize Flytrap
In your main application file (e.g., index.js or main.jsx), import the Flytrap module and initialize it with your project credentials:

```javascript
import flytrap from "flytrap_react";

flytrap.init({
  projectId: "YOUR_PROJECT_ID",
  apiEndpoint: "YOUR_ENDPOINT",
  apiKey: "YOUR_API_KEY",
  includeContext: true, // Optional: Enable source code context logging (default is true)
});
```

### Automatically Capture Global Errors
The Flytrap SDK automatically sets up global error and unhandled promise rejection handlers. These handlers ensure any uncaught exceptions or rejections are captured and logged.

### Using the Error Boundary
Wrap your application or specific parts of your component tree with the ErrorBoundary provided by the Flytrap SDK. This captures rendering errors in React components and logs them.

```javascript
import React from "react";
import flytrap from "flytrap_react";
import App from "./App";

const Root = () => (
  <flytrap.ErrorBoundary fallback={<div>Something went wrong!</div>}>
    <App />
  </flytrap.ErrorBoundary>
);

export default Root;
```

### Error Boundary Props
`fallback`: (Optional) A React node to render when an error occurs. This could be a custom error message or component.

### Manually Capturing Exceptions
For specific exceptions that you want to capture (e.g., inside a try/catch block), use the `captureException` method:

```javascript
try {
  // Your code here
  throw new Error("Something went wrong!");
} catch (error) {
  flytrap.captureException(error, {
    method: "GET", // Optional: HTTP method, if applicable
    url: "https://example.com/api", // Optional: URL, if applicable
  });
}
```

### Metadata
The second argument to captureException is an optional metadata object. This can include additional context about the request, such as:

- method: The HTTP method (e.g., "GET", "POST").
- url: The URL associated with the request or action that caused the error.

This data will automatically be extracted when using axios.

### Source Code Context (Optional)
When includeContext is set to true (default), Flytrap attempts to capture snippets of your source code around the error location (e.g., the file, line number, and surrounding lines).

This feature requires source files to be accessible at runtime. If source files are unavailable, Flytrap will send the minified code location instead.

Example App Setup
Here’s a complete example using Flytrap in a React application:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import flytrap from "flytrap_react";
import App from "./App";

flytrap.init({
  projectId: "YOUR_PROJECT_ID",
  apiEndpoint: "YOUR_ENDPOINT",
  apiKey: "YOUR_API_KEY",
});

ReactDOM.render(
  <React.StrictMode>
    <flytrap.ErrorBoundary fallback={<h1>Something went wrong!</h1>}>
      <App />
    </flytrap.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
App.jsx:

javascript
Copy code
import React from "react";

const ProblematicComponent = () => {
  throw new Error("This error is caught by ErrorBoundary");
};

const App = () => (
  <div>
    <h1>Flytrap React SDK Demo</h1>
    <ProblematicComponent />
  </div>
);

export default App;
```

## Backend Source Map Integration (Planned)
If source maps are unavailable in the browser, you can upload your source maps to the Flytrap backend. The backend will use these to resolve minified stack traces into meaningful error locations with full context.