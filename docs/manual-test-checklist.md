\# AKY manual test checklist



Use this checklist after every change.



\## Before you start

\- Make a backup copy of the whole project folder.

\- Open `index.html` in your browser.

\- Sign in with a test account that already works.



\## Core checks

\- \[ ] Login works

\- \[ ] Logout works

\- \[ ] Change Password modal opens

\- \[ ] Customer list loads

\- \[ ] Customer search works

\- \[ ] Customer dashboard opens after selecting a customer



\## Customer checks

\- \[ ] Add Customer modal opens

\- \[ ] Save Customer still works

\- \[ ] Edit Customer still works for a role that is allowed to edit



\## Invoice checks

\- \[ ] Create Invoice modal opens

\- \[ ] Adding line items still updates the total

\- \[ ] Saving an invoice still works

\- \[ ] Invoice view modal still opens



\## Payment checks

\- \[ ] Make Payment flow opens

\- \[ ] Payment method fields change when you switch method

\- \[ ] Saving a payment still works

\- \[ ] Payment view modal still opens



\## Document checks

\- \[ ] Customer Document Vault still loads documents

\- \[ ] Uploading an image still works

\- \[ ] Viewing a saved document still works

\- \[ ] Deleting a document still works for an allowed role



\## Report and admin checks

\- \[ ] Reports screen opens

\- \[ ] Log History opens for roles that can view logs

\- \[ ] Accounts screen opens for owner



\## Role-based checks

\- \[ ] Owner-only buttons are still hidden for non-owner users

\- \[ ] Executive View only appears for roles that can see it

\- \[ ] Notifications only appears for roles that can see it



\## If something breaks

1\. Undo only the last change.

2\. Refresh the page.

3\. Test again.

4\. If the problem is gone, the last change caused it.

5\. Fix that one change before touching anything else.

