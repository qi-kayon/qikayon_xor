import XOREncryptionApp from "./components/XOREncryptionApp.jsx";
import InfoPanel from './components/InfoPanel';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <InfoPanel />
      <XOREncryptionApp />
    </div>
  )
}

export default App