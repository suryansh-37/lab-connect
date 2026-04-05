import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'React Hooks Project', description: 'Build a custom hook to fetch data.', dueDate: '2026-04-10', status: 'Pending', lab: 'Web Development' },
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Weekly Sync: Web Dev', date: '2026-04-05', time: '10:00 AM', link: 'https://meet.google.com/lab-connect', lab: 'Web Development' }
  ]);

  return (
    <AppContext.Provider value={{ assignments, setAssignments, meetings, setMeetings }}>
      {children}
    </AppContext.Provider>
  );
};