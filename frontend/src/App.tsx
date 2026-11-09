import { BrowserRouter as Router} from 'react-router-dom';
import { Toaster } from 'sonner';
import MainRoutes from './routes/MainRoutes';

import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SessionTimeoutHandler } from './components/SessionTimeoutHandler';
import { ConfirmDialogProvider } from './components/common/ConfirmDialog';

function App() {
  return (
    <Router>
      <TenantProvider>
        <AuthProvider>
          <NotificationProvider>
            <ConfirmDialogProvider>
              <Toaster position="top-right" richColors closeButton expand={false} />
              <SessionTimeoutHandler />
              <MainRoutes />
            </ConfirmDialogProvider>
          </NotificationProvider>
        </AuthProvider>
      </TenantProvider>
    </Router>
  );
}

export default App;
