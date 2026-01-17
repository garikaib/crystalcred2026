/**
 * Safeguard utility to prevent accidental execution of administrative scripts.
 * Requires the environment variable CRYSTALCRED_ADMIN_SECRET_KEY to be set
 * OR an explicit confirmation flag.
 */
export function ensureSafeToRun() {
    const isConfirmed = process.env.I_KNOW_WHAT_I_AM_DOING === "true";
    const isAdminSecretSet = !!process.env.ADMIN_SECRET_KEY; // If they have the admin key, we assume they are authorized

    if (!isConfirmed && !isAdminSecretSet) {
        console.error("\n" + "!".repeat(60));
        console.error("DANGER: This is an administrative script that may modify your database.");
        console.error("To run this script, you must set the following environment variable:");
        console.error("I_KNOW_WHAT_I_AM_DOING=true");
        console.error("Example: I_KNOW_WHAT_I_AM_DOING=true npx tsx scripts/seed.ts");
        console.error("!".repeat(60) + "\n");
        process.exit(1);
    }

    console.log("🛡️  Safety check passed. Proceeding with script...");
}
