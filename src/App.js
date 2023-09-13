import Layout from './components/UI/Layout';
import Home from './views/Home';
import { AuthProvider } from './Firebase/context';
import { ModalProvider } from './context/ModalContext';

const App = () => {
  return (
    <ModalProvider>
      <AuthProvider>
        <Layout>
          <Home />
        </Layout>
      </AuthProvider>
    </ModalProvider>
  );
};

export default App;
