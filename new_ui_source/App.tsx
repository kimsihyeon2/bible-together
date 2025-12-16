import React, { useState } from 'react';
import { Screen } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import PlanDetailScreen from './screens/PlanDetailScreen';
import ProgressScreen from './screens/ProgressScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import { BottomNav } from './components/BottomNav';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen navigate={navigate} />;
      case Screen.DASHBOARD:
        return <DashboardScreen navigate={navigate} />;
      case Screen.PLAN_DETAIL:
        return <PlanDetailScreen navigate={navigate} />;
      case Screen.PROGRESS:
        return <ProgressScreen navigate={navigate} />;
      case Screen.CHAT:
        return <ChatScreen navigate={navigate} />;
      case Screen.SETTINGS:
        return <SettingsScreen navigate={navigate} />;
      default:
        return <LoginScreen navigate={navigate} />;
    }
  };

  // Bottom Navigation visibility logic
  const showBottomNav = [
    Screen.DASHBOARD, 
    Screen.SETTINGS, 
  ].includes(currentScreen);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {renderScreen()}
      {showBottomNav && <BottomNav currentScreen={currentScreen} navigate={navigate} />}
    </div>
  );
}

export default App;