import { Component } from 'react';

// Catches render-time crashes anywhere below it and shows the error instead of a
// blank white screen — so problems are diagnosable (and copy-pasteable) in the
// packaged app, where the dev console isn't readily open.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // Also log for anyone with the dev console open.
    console.error('Fountain of Knowledge crashed while rendering:', error, info);
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;
    const detail =
      (error.stack || String(error)) +
      (info?.componentStack ? '\n\nComponent stack:' + info.componentStack : '');
    return (
      <div className="crash">
        <h1>⛲ Something broke while rendering</h1>
        <p>
          The app hit an error instead of showing a page. Copy the details below
          when reporting it.
        </p>
        <pre className="crash-detail">{detail}</pre>
        <button className="crash-reload" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}
