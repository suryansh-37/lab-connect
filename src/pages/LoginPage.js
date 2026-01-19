import axios from 'axios';

// ... inside your component ...

const handleCreateSession = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/create-session');
        // Redirect to dashboard with the new ID from Database
        navigate(`/dashboard/${response.data.sessionId}`, { 
            state: { userName: 'Instructor', isCreator: true } 
        });
    } catch (error) {
        alert("Server Error: Could not create session.");
    }
};

const handleJoin = async (e) => {
    e.preventDefault();
    const fullCode = sessionCode.join('');
    
    try {
        const response = await axios.get(`http://localhost:3001/api/verify-session/${fullCode}`);
        if (response.data.valid) {
             navigate(`/dashboard/${fullCode}`, { state: { userName: name } });
        }
    } catch (error) {
        alert("Invalid Session Code or Session Expired.");
    }
};