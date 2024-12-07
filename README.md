![Organization Logo](https://raw.githubusercontent.com/getflytrap/.github/main/profile/flytrap_logo.png)

# Flytrap React SDK

The Flytrap React SDK is a lightweight tool designed for React applications. It enables seamless error monitoring and reporting to the Flytrap system, capturing both global and manually handled errors with minimal setup.

This guide will walk you through setting up the Flytrap React SDK in your project and exploring its features. If you want to use Flytrap in a production environment, refer to the [Flytrap Installation Guide](https://github.com/getflytrap/flytrap_terraform) for complete setup instructions.

To learn more about Flytrap, check out our [case study](https://getflytrap.github.io/).

## 🚀 Getting Started

To start using Flytrap in your project:

1. Visit the Flytrap Dashboard and log in.
2. Click on **New Project** to create a project.
3. You’ll be provided with a **Project ID**, **API Key**, and **API Endpoint** specific to your project. These values are essential for configuring the SDK.

## 📦 Installation

Install the Flytrap React SDK via npm:

```bash
npm install flytrap_react
```

## 🛠️ Usage
1. **Initialize Flytrap:** In your main application file (e.g., `index.js` or `main.jsx`), import the Flytrap module and initialize it with your project credentials:

    ```javascript
    import flytrap from "flytrap_react";

    flytrap.init({
      projectId: "YOUR_PROJECT_ID",
      apiEndpoint: "YOUR_ENDPOINT",
      apiKey: "YOUR_API_KEY",
    });
    ```

2. **Automatically Capture Global Errors:** The Flytrap SDK automatically sets up global error and unhandled promise rejection handlers. These handlers ensure any uncaught exceptions or rejections are captured and logged.

3. **Using the Error Boundary:** Wrap your application or specific parts of your component tree with the `ErrorBoundary` provided by the Flytrap SDK. This captures rendering errors in React components and logs them.

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

    **Error Boundary Props**
    - `fallback`: (Optional) A React node to render when an error occurs. This could be a custom error message or component.

4. **Manually Capturing Exceptions:** For specific exceptions that you want to capture (e.g., inside a `try/catch` block), use the `captureException` method:

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

The second argument to `captureException` is an optional metadata object. This can include:

- `method`: The HTTP method (e.g., "GET", "POST").
- `url`: The URL associated with the request or action that caused the error.

**Note:** When using `axios`, this metadata will automatically be captured by the SDK. You don't need to pass it in explicitly.

## 🛠️ Example App Setup

Here’s a complete example using Flytrap in a React application:

`main.jsx`:
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
```

``App.jsx``:
```javascript
import React from "react";

const ProblematicComponent = () => {
  throw new Error("This error is caught by ErrorBoundary");
};

const App = () => (
  const handleUncaughtError = () => {
    throw new Error('This is an uncaught error from React!');
  }

  <div>
    <h1>Flytrap React SDK Demo</h1>
    <button id="uncaughtErrorBtn" onClick={handleUncaughtError}>Trigger Uncaught Error</button>
    <ProblematicComponent />
  </div>
);

export default App;
```

## 🗺️ Source Map Integration

To resolve minified stack traces into meaningful error locations, you can upload source maps to the Flytrap S3 bucket. The backend uses these maps to provide full context for errors, including:

- Original file name
- Line number
- Code snippets around the error

### Creating Inline Source Maps
To generate inline source maps for your JavaScript files in a React application, you can use a build tool like **Vite**, or a minifer like **`terser`**. 

**Using Vite:**
Vite does not generate inline source maps by default. However, you can configure it to do so:

```javascript
export default {
  build: {
    sourcemap: 'inline', // Generates inline source maps in production
  },
};
```
For more details, refer to the [Vite documentation](https://vite.dev/config/build-options#build-sourcemap).

**Using `terser`:**
```bash
terser app.js -o dist/app.min.js --source-map "includeSources"
```
This command creates a minified JavaScript file (app.min.js) with an accompanying inline source map.

### Uploading Source Maps
You can use the AWS CLI to upload your source maps to the designated S3 bucket for your Flytrap setup. Ensure you are in the directory where your source map files (e.g., app.min.js.map) are located. Replace `<bucket_id>` and `<project_id>` with your actual bucket and project identifiers:

```bash
aws s3 cp ./app.min.js.map s3://flytrap-sourcemaps-bucket-<bucket_id>/<project_id>/app.min.js.map
```
- `./app.min.js.map`: The source map file to upload.
- `s3://flytrap-sourcemaps-bucket-<bucket_id>/<project_id>/`: The destination bucket and folder for the project.  

If you need to delete a source map from the S3 bucket, use the following command:
```bash
aws s3 rm s3://flytrap-sourcemaps-bucket-<bucket_id>/<project_id>/app.min.js.map
```

### Testing Locally
To test source map integration locally, refer to the [Flytrap Processor Repository](https://github.com/getflytrap/flytrap_processor) for instructions on setting up local source map uploads and integration.

## 🖥️ Local End-to-End Testing with Flytrap Architecture

For full **local** integration with the Flytrap architecture:

1. **Install the Flytrap API:** Follow the [Flytrap API Repository setup guide](https://github.com/getflytrap/flytrap_api).
2. **Install the Flytrap Processor:** Refer to the [Flytrap Processor Repository](https://github.com/getflytrap/flytrap_processor) for instructions.
3. **View Errors in the Dashboard:** Set up the [Flytrap Dashboard](https://github.com/getflytrap/flytrap_ui) to view and manage reported errors.
4. **Integrate the Flytrap SDK in your project.**

### Testing the Complete Setup
1. Trigger errors or promise rejections in your application integrated with a Flytrap SDK.
2. Confirm that errors are logged by checking:
  - Flytrap Processor Logs: Ensure errors are processed correctly.
  - Flytrap Dashboard: View processed errors, including stack traces and context.

## 🚀 Production Setup
If you’re looking for detailed instructions to deploy Flytrap in a production environment, refer to:

- [Flytrap Installation Guide](https://github.com/getflytrap/flytrap_terraform)
- [How-To-Use Page](https://getflytrap.github.io/)

For questions or issues, feel free to open an issue in this repository or contact the Flytrap team. 🚀

---

<div align="center">
  🪰🪤🪲🌱🚦🛠️🪴
</div>