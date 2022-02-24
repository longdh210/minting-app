import { Routes, Route, Link } from 'react-router-dom';
import MintNft from './pages/mint-nft';
import DisplayNFT from './pages/display-nft';
import './App.css';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link className='page' to="/">Minting</Link>
            <Link className='page' to="/displayNFT">NFT</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<MintNft />} />
        <Route path="/displayNFT" element={<DisplayNFT />} />
      </Routes>
    </div>
  );
}

export default App;
