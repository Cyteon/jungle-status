<script lang="ts">
	import { jwtDecode } from "jwt-decode";
	import { onMount } from "svelte";
    import { getCookie } from "typescript-cookie";

    let token = "";
    let enabled = false;

    let error = "";
    let success = "";

    onMount(async () => {
        if (!getCookie("access_token")) {
            window.location.href = "/";
        }

        const res = await fetch(`/api/v1/data?user_id=${jwtDecode(getCookie("id_token") as string).sub}&access_token=${getCookie("access_token")}`);
    
        if (res.ok) {
            const json = await res.json();
            token = json.token;
            enabled = json.enabled;
        }
    });

    function getTokenFromFile() {
        const file = document.querySelector('input[type="file"]').files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            token = e.target.result as string;
        }

        reader.readAsText(file);

        document.querySelector('input[type="file"]').value = "";
    }

    async function save() {
        error = "";
        success = "";

        if (!token) {
            error = "Token is required!";
            return;
        }

        const id_token = getCookie("id_token")
        const userData = jwtDecode(id_token);

        const res = await fetch("/api/v1/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: getCookie("access_token"),
                token,
                user_id: userData.sub,
                enabled
            })
        });

        if (res.ok) {
            success = "Settings saved!";
        } else {
            const json = await res.json();
            error = json.error;
        }
    }
</script>

<div class="flex flex-col w-full">
    <div class="mx-auto mt-8 w-64 flex flex-col">
        <h1 class="text-4xl text-center font-bold mb-4">Settings</h1>

        <input bind:value={token} placeholder="Enter token.." class="rounded-md p-2 bg-ctp-mantle border border-ctp-surface0 text-xl" />

        <p class="text-center my-1 text-xl text-ctp-subtext0">or</p>

        <input type="file" onchange={() => { getTokenFromFile() }} class="rounded-md p-2 bg-ctp-mantle border border-ctp-surface0 text-xl" />
    
        <hr class="my-4 border-ctp-surface0" />

        <select bind:value={enabled} class="rounded-md p-2 bg-ctp-mantle border border-ctp-surface0 text-xl">
            <option value={false}>Disabled</option>
            <option value={true}>Enabled</option>
        </select>

        <p class="text-center text-ctp-red mt-2">{error}</p>
        <p class="text-center text-ctp-green mb-2">{success}</p>

        <button onclick={save} class="rounded-md p-2 bg-ctp-green text-ctp-crust text-xl mt-1">Save</button>
    </div>
</div>