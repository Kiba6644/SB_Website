# BMSCE IEEE — Executive Administrator Guide

This guide is for student executives, branch treasurers, and volunteers responsible for managing the website, reconciling membership dues, and publishing branch announcements.

---

## 🔑 Accessing the Admin Portal

1. Navigate to: **`https://<your-domain>/admin/login`** (or click the **[Admin]** button in the header/footer).
2. Enter your authorized administrator email and password.
   - *For local testing/development*, click **"Demo Login"** or use `admin@bmsce.ac.in` / `adminpassword`.
3. Upon authentication, you will be redirected to the **Verification Dashboard** (`/admin/orders`).

---

## 📋 Verifying Membership Applications

The `/admin/orders` dashboard is your central ledger during the membership drive.

### 1. Reviewing an Incoming Order
Each card/row represents a student application and displays:
- **Student Information**: Full Name, USN, Department, Year of Study, and Institutional Email.
- **Selected Chapters**: The list of technical societies the student opted into.
- **Total Amount Due**: Base membership fee plus chapter add-ons.
- **UTR / Transaction Reference**: The 12-digit bank reference number entered by the student.

### 2. Inspecting Payment Proof
1. Click the blue **"View Proof"** button next to any order.
2. A full-screen modal will display the payment screenshot uploaded by the student.
3. Check that:
   - The recipient matches the branch UPI VPA.
   - The timestamp matches the order submission window.
   - The amount debited matches the exact order total.
   - The UTR corresponds to the credit entry in your branch bank account/UPI app.

### 3. Approving an Order (Verify)
1. Click the green **"Verify"** button.
2. The order status immediately changes to **Verified Member**.
3. **Automated Action**: The system automatically dispatches an official receipt email to the student's registered email address detailing their confirmed membership, chapters, and order reference.
4. The student can now see their status as **Verified Member** when logging into their `/account` portal.

### 4. Rejecting an Order (Action Required)
If a screenshot is blurry, cropped, missing the UTR, or the amount is incorrect:
1. Click the red **"Reject"** button.
2. A prompt will appear: enter a clear explanation for the student (e.g. *"Screenshot does not show the 12-digit UTR number. Please re-upload full receipt"*).
3. Click **"Confirm Rejection"**.
4. The order status updates to **Action Required (Rejected)**.
5. The student will see your exact feedback on their `/account` portal and will be provided a **"Resubmit Clear Payment Proof"** button to upload a clean screenshot without having to place a new order.

---

## 📊 Exporting the Membership Ledger (CSV)

To generate an official offline record for IEEE Headquarters, college administration, or chapter chairs:
1. At the top right of `/admin/orders`, click **"Export CSV"**.
2. Your browser will download a file named `bmsce_ieee_orders_YYYY-MM-DD.csv`.
3. Open it in Microsoft Excel, Google Sheets, or Apple Numbers to filter students by department, year, or chapter.

---

## 📢 Updating the Global Announcement Banner

1. Click **"Edit Announcement"** in the top navigation bar or go to `/admin/announcement`.
2. **Toggle Status**:
   - `ENABLED`: The banner is visible to all website visitors across the top of every page.
   - `DISABLED`: The banner is hidden.
3. **Banner Message Text**: Enter the copy (e.g. *"IEEEXtreme 24-Hour Hackathon registrations are now open!"*).
4. **Call-to-Action Link URL** (Optional): Add the target link (e.g. `/membership/register` or an external form).
5. Click **"Save & Publish Banner"**. The live site updates immediately.

---

## 🚨 Security & Best Practices
- **Do not share admin credentials**: Each authorized executive should have their individual email added to the `admins` database table.
- **Log out when using shared campus computers**: Click **"Sign Out"** at the top right when finished.
