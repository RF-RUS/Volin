import React, { useState } from 'react';
import './style.css';
import { RoleSelector } from './components/RoleSelector';
import { ManagerInterface } from './components/ManagerInterface';
import { ExecutorInterface } from './components/ExecutorInterface';

type UserRole = 'manager' | 'executor' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  function handleRoleSelect(role: 'manager' | 'executor') {
    setUserRole(role);
  }

  function handleBackToRoles() {
    setUserRole(null);
  }

  if (!userRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  if (userRole === 'manager') {
    return <ManagerInterface onBackToRoles={handleBackToRoles} />;
  }

  if (userRole === 'executor') {
    return <ExecutorInterface onBackToRoles={handleBackToRoles} />;
  }

  return null;
}

export default App;
