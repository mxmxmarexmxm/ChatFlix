import Layout from './components/UI/Layout';
import Home from './views/Home';
import { AuthProvider } from './Firebase/context';
import { ModalProvider } from './context/ModalContext';
import Modal from './components/UI/Modal';

const App = () => {
  return (
    <ModalProvider>
      <AuthProvider>
        <Layout>
          <Modal />
          <Home />
        </Layout>
      </AuthProvider>
    </ModalProvider>
  );
};

export default App;
