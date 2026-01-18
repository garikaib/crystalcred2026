# Google Analytics Dashboard Setup

To display Google Analytics data in your Admin Dashboard, you need to set up a **Service Account** and provide its credentials.

## Step 1: Create a Service Account (Google Cloud)

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "CrystalCred Analytics").
3.  In the search bar, type **"Google Analytics Data API"** and select it.
4.  Click **Enable**.
5.  Go to **IAM & Admin** > **Service Accounts**.
6.  Click **+ Create Service Account**.
7.  Give it a name (e.g., "analytics-fetcher") and click **Create and Continue**.
8.  Skip the role assignment step (click **Done**).
9.  Click on the newly created email address (e.g., `analytics-fetcher@...iam.gserviceaccount.com`).
10. Go to the **Keys** tab.
11. Click **Add Key** > **Create new key**.
12. Select **JSON** and click **Create**.
13. A file will download. **Keep this safe!**

## Step 2: Grant Access in Google Analytics

1.  Open the JSON file you just downloaded.
2.  Copy the `client_email` address.
3.  Go to [Google Analytics](https://analytics.google.com/).
4.  Go to **Admin** (Gear icon) > **Property** > **Property Access Management**.
5.  Click **+** > **Add users**.
6.  Paste the service account email.
7.  Assign the **Viewer** role.
8.  Click **Add**.

## Step 3: Get Property ID

1.  In Google Analytics Admin, go to **Property Settings** > **Property Details**.
2.  Copy the **Property ID** (a string of numbers, e.g., `426789123`).

## Step 4: Add to Environment Variables

On your server, open `.env.production`:

```bash
sudo nano /home/ubuntu/crystalcred/.env.production
```

Add the following lines (using values from your JSON file and Property ID):

```env
GOOGLE_CLIENT_EMAIL="your-service-account-email@..."
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_PROPERTY_ID="12345678"
```

> **Note:** For the `GOOGLE_PRIVATE_KEY`, copy the *entire* string from the JSON file, including the `\n` characters. Paste it inside quotes.
