import { Component, type ErrorInfo, type ReactNode } from "react";

interface LazyBoundaryProps {
  /** What the boundary holds, for the error log ("the sections under the leaderboard"). */
  name: string;
  children: ReactNode;
}

/**
 * Around a lazy part of the page: if its chunk fails to load (or it throws while rendering),
 * it renders nothing in its place and logs why, so the rest of the page stays up. Without it
 * React would unmount the whole root, hero included.
 */
export class LazyBoundary extends Component<LazyBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[landing] Could not render ${this.props.name}, so the page goes on without them:`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
