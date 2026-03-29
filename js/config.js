window.APP_CONFIG = {
  SUPABASE_URL: "https://hghssblwbezmyrrfthri.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_IL6vSMDa-G1kpWCMR0KKXA_9NtUYIMr"
};

window.ACCOUNT_ADMIN_FUNCTION_URL = `${window.APP_CONFIG.SUPABASE_URL}/functions/v1/account-admin`;

window.supabaseClient = supabase.createClient(
  window.APP_CONFIG.SUPABASE_URL,
  window.APP_CONFIG.SUPABASE_ANON_KEY
);
