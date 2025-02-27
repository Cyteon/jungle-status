<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { setCookie } from "typescript-cookie";

    let status = "Authenticating...";

    onMount(async () => {
        if (browser) {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");

            const res = await fetch("/api/v1/slack", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code, redirect_uri: window.location.origin + "/callback" })
            });

            if (res.ok) {                
                const { access_token, id_token } = await res.json();

                setCookie("access_token", access_token, { expires: 28 });
                setCookie("id_token", id_token, { expires: 28 });

                status = "Redirecting...";
                goto("/panel")
            } else {
                status = "Failed to authenticate.";
            }
        }
    })
</script>

<div class="flex h-screen w-full">
    <p class="m-auto text-3xl">{status}</p>
</div>
