import React from 'react';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to inc-lms</h1>
            </header>
            <main>
                {/* Add your routing and main content here */}
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} inc-lms. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;