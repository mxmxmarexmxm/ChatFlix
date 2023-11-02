import Layout from './components/UI/Layout';
import Home from './views/Home';
import { AuthProvider } from './Firebase/context';
import { ModalProvider } from './context/ModalContext';
import { ChatProvider } from './context/ChatContext';
import Modal from './components/UI/Modal';

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <ModalProvider>
          <Layout>
            <Modal />
            <Home />
          </Layout>
        </ModalProvider>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
