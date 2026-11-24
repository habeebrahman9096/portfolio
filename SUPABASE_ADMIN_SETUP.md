# Admin login setup

Supabase blocks password login until an email address is confirmed when **Confirm email** is enabled. This setting is enforced by Supabase, so it cannot be safely bypassed in browser JavaScript.

Choose one of these options:

1. Disable confirmation for this project:
   - Open Supabase Dashboard.
   - Go to **Authentication → Providers → Email**.
   - Turn off **Confirm email** and save.
   - Create the owner account again or sign in with the existing password.

2. Confirm only the first owner account manually:
   - Go to **Authentication → Users**.
   - Open `effectgraphics90@gmail.com`.
   - Choose **Confirm email** (or edit the user and mark the email as confirmed).
   - Return to `admin.html` and sign in.

The database policies still restrict project creation, editing, deletion, and image uploads to `effectgraphics90@gmail.com`.
