# 🚀 Deployment & Submission Guide

Since this is a **Blockchain Application** (DApp), "Deployment" is different from a normal website. You have a backend (Blockchain) and a frontend (Web Site).

## ✅ Option 1: The "Standard Demo" Method (Recommended)
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

### ⚡ Advanced: How to Connect Vercel to Local Ganache (via Ngrok)

**Prerequisites**:
1.  **Ngrok Account**: [Sign up here](https://ngrok.com/).
2.  **Ngrok Installed**: Download and install it.

#### Step 1: Start the Tunnel
Open a **new terminal** (keep Ganache running) and run:
```bash
ngrok http 8545
```
*   Copy the **Forwarding URL** (looks like `https://a1b2-c3d4.ngrok-free.app`).

#### Step 2: Update Your Code
You must tell the frontend to talk to this new "Public URL" instead of localhost.
1.  Open `app/javascripts/index.js`.
2.  Find line ~302 (Web3 Initialization).
3.  Change:
    ```javascript
    // OLD
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    
    // NEW (Paste your ngrok URL)
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://YOUR-NGROK-ID.ngrok-free.app"));
    ```

#### Step 3: Build & Deploy
1.  Run `npm run build` locally to check for errors.
2.  **Commit & Push** these changes to GitHub.
    ```bash
    git add .
    git commit -m "Config: Updated Web3 provider to Ngrok"
    git push
    ```
3.  Vercel will auto-detect the push and deploy the new version.

#### Step 4: Important Caveats
*   **Keep Terminal Open**: If you close the terminal running `ngrok`, the website breaks.
*   **Resetting**: If you restart ngrok, the URL changes. You must update `index.js`, push, and redeploy again. (This is why Option 1 is better).

## 📄 Submission Checklist
- [ ] **GitHub Repo** (Public & Pushed)
- [ ] **README.md** (Updated with Digrams)
- [ ] **Demo Video** (Recorded with Confetti)
- [ ] **Tech Stack Slide** (tech_stack.md)
