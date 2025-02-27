import { jwtDecode } from "jwt-decode";
import fs from "fs";

import { PUBLIC_SLACK_CLIENT_ID } from "$env/static/public";
import { SLACK_CLIENT_SECRET } from "$env/static/private";

export async function POST({ request }) {
    const { code, redirect_uri } = await request.json();

    const res = await fetch('https://slack.com/api/openid.connect.token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: PUBLIC_SLACK_CLIENT_ID,
            client_secret: SLACK_CLIENT_SECRET,
            redirect_uri
        }),
    });

    const json = await res.json();

    if (!json.ok) {
        return Response.json(json, { status: 400 });
    }

    const { access_token, id_token } = json;
    const userData = jwtDecode(id_token);

    if (!userData) {
        return Response.json({ error: 'Invalid token' }, { status: 400 });
    }

    let jsonFile = "{}";

    if (fs.existsSync('data.json')) {
        jsonFile = await fs.promises.readFile('data.json', 'utf8');
    }

    const data = JSON.parse(jsonFile);
    data[userData.sub] = { access_token, jungle_token: null, enabled: false };
    await fs.promises.writeFile('data.json', JSON.stringify(data));

    return Response.json({ access_token, id_token });
}