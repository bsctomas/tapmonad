
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ABI del contrato
const abi = [
  {
    inputs: [],
    name: "tap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getTapCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x14572d087897b533c8217552F9fCB203A1FB4dDc"; // reemplaza con tu dirección real

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Instala Metamask");
    const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletAddress(address);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const instance = new ethers.Contract(contractAddress, abi, signer);
    setContract(instance);
  };

  const fetchCount = async () => {
    if (!contract || !walletAddress) return;
    const c = await contract.getTapCount(walletAddress);
    setCount(c.toString());
  };

  const handleTap = async () => {
    if (!contract) return;
    const tx = await contract.tap();
    await tx.wait();
    fetchCount(); // actualizar el contador después del tap
  };

  useEffect(() => {
    if (walletAddress && contract) {
      fetchCount();
    }
  }, [walletAddress, contract]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Tap Counter DApp</h1>
      {!walletAddress ? (
        <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500">
          Conectar Wallet
        </button>
      ) : (
        <>
          <p>Tu dirección: <span className="text-sm text-gray-400">{walletAddress}</span></p>
          <p className="text-xl">Taps: <span className="font-mono">{count}</span></p>
          <button onClick={handleTap} className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-500">
            Tap 🔘
          </button>
        </>
      )}
    </div>
  );
}

export default App;
