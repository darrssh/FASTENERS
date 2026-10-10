import { Component } from 'react';
import type { ReactNode } from 'react';

/** A failed 3D asset must never break the whole site (§41). */
export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* intentional no-op: fallback UI below */
  }
  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div className="card p-8 text-center text-muted">
            <p className="eyebrow">3D unavailable</p>
            <p className="mt-2 text-paper">This 3D view failed to load, but the rest of the site works.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
