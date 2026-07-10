import { PortalProvider } from './context/PortalContext';
import { RecruitmentPortal } from './pages/RecruitmentPortal';

function App() {
  return (
    <PortalProvider>
      <RecruitmentPortal />
    </PortalProvider>
  );
}

export default App;
