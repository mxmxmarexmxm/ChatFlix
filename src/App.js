import Layout from './components/Layout/Layout';
import { AuthProvider } from './Firebase/context';
import { ModalProvider } from './context/ModalContext';
import { ChatProvider } from './context/ChatContext';
import { SettingsProvider } from './context/SettingsContext';
import Modal from './components/UI/Modal';

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ChatProvider>
          <ModalProvider>
            <Modal />
            <Layout />
          </ModalProvider>
        </ChatProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
