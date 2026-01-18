const host = "http://localhost:3000";

async function testCreatePost() {
    const res = await fetch(`${host}/api/blog`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // We need to mock auth or use a valid session cookie for this to work against real API
            // But since we can't easily mock auth middleware in this script without cookie,
            // we might need to rely on the server logs I just added.
            // However, if I can't hit the API because of Auth, that's a finding too.
        },
        body: JSON.stringify({
            title: "Test Post API Log",
            content: "<p>This is a test</p>",
            status: "draft"
        })
    });

    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
}

testCreatePost();
