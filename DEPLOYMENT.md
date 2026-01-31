# 🚀 Deployment & Submission Guide

Since this is a **Blockchain Application** (DApp), "Deployment" is different from a normal website. You have a backend (Blockchain) and a frontend (Web Site).

## ✅ Option 1: The "Hackathon Winner" Method (Recommended)
**Judges rarely run code.** They look at the **Video** and the **Code Quality**.

1.  **Submit the GitHub Link**:
    *   `https://github.com/codecaffin4346/Greenledger`
2.  **Submit the Video**:
    *   Record using the [Visual 3D Demo].
3.  **State**: *"Application runs on local Ganache Blockchain for zero-latency demonstration."*

**Why this is best:** It is 100% stable. Deploying to a public testnet (Sepolia) introduces lag (15s block times) which can ruin a live demo.

---

## ☁️ Option 2: Live Frontend (Vercel/Netlify)
If you *must* provide a clickable URL, you can deploy the **Frontend Only**, but it will not connect to your local blockchain unless you use a tunnel.

### Steps to Deploy UI to Vercel:
1.  Go to [Vercel.com](https://vercel.com) -> "Add New Project".
2.  Import your GitHub Repo (`Greenledger`).
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `build`
5.  Click **Deploy**.

**⚠️ Vital Warning**: 
The deployed website will load, but when you click "Login" or "Submit", it will fail because **Vercel cannot see your local Ganache blockchain**.
*   **Fix**: You would need to use `ngrok http 8545` to tunnel your Ganache port and update `index.js` to use the ngrok URL.
*   **Better Fix**: Deploy contracts to **Sepolia Testnet** (Requires Metamask + Free Test ETH).

## 📄 Submission Checklist
- [ ] **GitHub Repo** (Public & Pushed)
- [ ] **README.md** (Updated with Digrams)
- [ ] **Demo Video** (Recorded with Confetti)
- [ ] **Tech Stack Slide** (tech_stack.md)
