import fs from "fs";

export async function POST({ request }) {
    const { access_token, token, user_id, enabled } = await request.json();

    if (!access_token || !token || !user_id || enabled === undefined) {
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

    data[user_id].jungle_token = token;
    data[user_id].enabled = enabled;

    await fs.promises.writeFile('data.json', JSON.stringify(data));

    return Response.json({ success: true });
}