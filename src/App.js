import Layout from './components/UI/Layout';
import Home from './components/Home';
import { AuthProvider } from './Firebase/context';

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Home />
      </Layout>
    </AuthProvider>
  );
};

export default App;
