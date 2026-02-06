# Push, deploy, and run your portfolio

Your code is **committed** locally. Follow these steps to push to GitHub, deploy, and run the site.

---

## Step 1: Push to GitHub

Open a terminal in your project folder (`C:\Users\A\Desktop\Myportfolio`) and run:

```bash
git push origin main
```

- If it asks for **username**: use your GitHub username (e.g. `maheshs108`).
- If it asks for **password**: use a **Personal Access Token**, not your GitHub password.  
  To create one: GitHub → **Settings → Developer settings → Personal access tokens → Generate new token**. Give it `repo` scope, copy it, and paste it when prompted.

If the branch is `master` instead of `main`, use:

```bash
git push origin master
```

---

## Step 2: Turn on GitHub Pages (deploy)

1. Open your repo: **https://github.com/maheshs108/Portfolio**
2. Go to **Settings → Pages** (left sidebar).
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Save. No need to click “Save” again if it’s already set.

The workflow in `.github/workflows/deploy-pages.yml` will run on every push to `main` (or `master`). The first run may take 1–2 minutes.

---

## Step 3: Open your live site (run)

After the workflow finishes (green check on the **Actions** tab):

**Your direct link:**

```
https://maheshs108.github.io/Portfolio/
```

Open this URL in Chrome (or any browser) to run the portfolio.

---

## If push fails (authentication)

- **HTTPS:** Use a Personal Access Token as the password (see Step 1).
- **SSH:** If you use SSH keys, set the remote to SSH and push:
  ```bash
  git remote set-url origin git@github.com:maheshs108/Portfolio.git
  git push origin main
  ```

## If the link shows 404

- Wait 1–2 minutes after the first push and try again.
- In the repo, open the **Actions** tab and confirm the “Deploy to GitHub Pages” workflow completed successfully.
- In **Settings → Pages**, ensure **Source** is **GitHub Actions**.
