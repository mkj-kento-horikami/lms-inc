import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './styles/App.css';

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>,
        rootElement
    );
} else {
    console.error('Root element not found');
}