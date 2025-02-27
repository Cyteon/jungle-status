import fs from "fs";

export async function GET({ request, url }) {
    const access_token = url.searchParams.get('access_token');
    const user_id = url.searchParams.get('user_id');

    if (!access_token || !user_id) {
        return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const jsonFile = await fs.promises.readFile('data.json', 'utf8');
    const data = JSON.parse(jsonFile);

    if (!data[user_id]) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (!data[user_id].access_token === access_token) {
        return Response.json({ error: 'Unathorized' }, { status: 400 });
    }

    return Response.json({ enabled: data[user_id].enabled, token: data[user_id].jungle_token });
}