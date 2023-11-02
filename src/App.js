import Layout from './components/Layout/Layout';
import { AuthProvider } from './Firebase/context';
import { ModalProvider } from './context/ModalContext';
import { ChatProvider } from './context/ChatContext';
import Modal from './components/UI/Modal';

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <ModalProvider>
          <Modal />
          <Layout />
        </ModalProvider>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
