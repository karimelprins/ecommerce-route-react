import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="auth-page">
          <section className="empty-state">
            <span className="eyebrow">Runtime error</span>
            <h1>Something needs a quick refresh</h1>
            <p>Reload the page. If the issue appears again, check the browser console error.</p>
            <button className="primary-button" onClick={() => window.location.reload()}>Reload page</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
