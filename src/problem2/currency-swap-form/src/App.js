import { Layout } from "antd";
import SwapForm from "./components/SwapForm";
const { Content} = Layout;

function App() {
  return (
    <Layout>
      <Content style={{
        padding: '0 20em',
        minHeight: '100vh',
        display:'flex',
        alignItems:'center',
      }}>
      <SwapForm/>
      </Content>
  
    </Layout>
  );
}

export default App;
