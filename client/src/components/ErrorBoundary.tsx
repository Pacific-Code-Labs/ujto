import { Component, ErrorInfo, ReactNode } from 'react';
import { translations } from "@/i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    const lang = typeof window !== 'undefined' && window.location.pathname.startsWith('/es') ? 'es' : 'en';
    const tr = (key: string) => translations[lang][`errorBoundary.${key}`] ?? key;
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'system-ui',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '50px auto'
        }}>
          <h1 style={{ color: '#dc2626' }}>{tr('title')}</h1>
          <p>{tr('description')}</p>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
              {tr('details')}
            </summary>
            <pre style={{
              background: '#f3f4f6',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tr('reload')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}