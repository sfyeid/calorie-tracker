import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"

import { App } from "@/app/App"
import { store } from "@/app/store"
import { ErrorFallback } from "@/shared/ui/ErrorFallback"
import "@/shared/config/i18n"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)
