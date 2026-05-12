export const getScoreColor = (score) => {
  if(score >= 90) return '#10b981'; 
  if(score >= 70) return '#f59e0b';
  return '#ef4444';
};

export const teachingLabs = [
  { id: 1, title: 'Cell Theory: Biol 101', code: 'BIOL 101', session: '04', iconType: 'beaker', iconColor: '#2563eb', progress: 75, banner: '/biology_illustration.png' },
  { id: 2, title: 'Visual Hierarchy Essay', code: 'DS II', session: '02', iconType: 'book', iconColor: '#059669', progress: 60, banner: '/design_illustration.png' },
];

export const recentActivity = [
  { id: 1, user: 'Julian Weber', action: 'submitted Mitochondria Paper', time: '14m ago', color: '#f59e0b', btn: 'Grade' },
  { id: 2, user: 'System', action: 'New discussion in Art History', time: '2h ago', color: '#10b981', btn: 'View' },
  { id: 3, user: 'Maya Angelou', action: 'posted question in Calculus', time: '5h ago', color: '#3b82f6', btn: 'Reply' },
];

export const students = [
  { id: '40192', name: 'Adrian Thorne', avatar: 'A', lastActive: '5m ago', grade: '91.0%', status: 'Excellent', att: '98%', comp: 94, engagement: 92, chat: 14, issues: 0, statusColor: '#10b981', statusBg: '#d1fae5' },
  { id: '40215', name: 'Elena Rodriguez', avatar: 'E', lastActive: '2h ago', grade: '77.3%', status: 'On Track', att: '82%', comp: 76, engagement: 85, chat: 28, issues: 1, statusColor: '#d97706', statusBg: '#fef3c7' },
  { id: '40388', name: 'Julian Vance', avatar: 'J', lastActive: '1d ago', grade: '58.3%', status: 'At Risk', att: '64%', comp: 58, engagement: 45, chat: 8, issues: 3, statusColor: '#ef4444', statusBg: '#fee2e2' },
  { id: '40412', name: 'Sarah Chen', avatar: 'S', lastActive: 'Online Now', grade: '97.6%', status: 'Excellent', att: '100%', comp: 98, engagement: 97, chat: 45, issues: 0, statusColor: '#10b981', statusBg: '#d1fae5' },
];