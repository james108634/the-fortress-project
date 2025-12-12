// Replace these with your real Trust Wallet addresses
const trustWalletRegistry = {
  Ethereum: "0xYourEthereumAddressHere",
  BinanceSmartChain: "0xYourBSCAddressHere",
  Polygon: "0xYourPolygonAddressHere",
  Solana: "YourSolanaAddressHere",
  Bitcoin: "YourBitcoinAddressHere"
};

window.onload = () => {
  const trustWalletsEl = document.getElementById("trustWallets");
  let output = "";
  for (const [chain, address] of Object.entries(trustWalletRegistry)) {
    output += `${chain}: ${address}\n`;
  }
  trustWalletsEl.innerText = output;
};

async function connectWallet() {
  if (!freighterApi.isConnected()) {
    document.getElementById('stellarOutput').innerText = "Freighter not installed.";
    return;
  }
  const pubkey = await freighterApi.getPublicKey();
  document.getElementById('stellarOutput').innerText = "Connected Stellar pubkey: " + pubkey;
}

async function sendPayment() {
  try {
    const pubkey = await freighterApi.getPublicKey();
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    const account = await server.loadAccount(pubkey);
    const fee = await server.fetchBaseFee();

    const txn = new StellarSdk.TransactionBuilder(account, {
      fee,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: pubkey,
        asset: StellarSdk.Asset.native(),
        amount: "0.000001"
      }))
      .setTimeout(60)
      .build();

    const signed = await freighterApi.signTransaction(txn.toXDR(), { networkPassphrase: StellarSdk.Networks.TESTNET });
    document.getElementById('stellarOutput').innerText = "Signed TX: " + signed.slice(0,40) + "...";
  } catch (e) {
    document.getElementById('stellarOutput').innerText = "Error: " + e.message;
  }
}
