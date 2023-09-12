import { Card, Typography } from '@mui/material';
import React from 'react';

export default class ErrorBoundary extends React.Component<
  { children: React.ReactElement },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <Typography
            variant="h5"
            style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}
          >
            An unexpected error has occurred. Please refresh the page.
          </Typography>
        </Card>
      );
    }

    return this.props.children;
  }
}
