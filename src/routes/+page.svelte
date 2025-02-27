<script lang="ts">
	import { browser } from "$app/environment";
    import { PUBLIC_SLACK_CLIENT_ID } from "$env/static/public";

    let loc;

    if (browser) {
        loc = window.location.origin + "/";
    }
</script>

<div class="flex h-screen w-full">
    <a 
        class="m-auto flex rounded-md bg-ctp-flamingo p-4"
        href={`https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=users.profile%3Awrite&redirect_uri=${loc + "callback"}&client_id=${PUBLIC_SLACK_CLIENT_ID}`}
    >
        <img src="/slack.svg" alt="Slack logo" class="w-8 h-8" />
        <span class="text-3xl leading-none ml-2 text-ctp-crust">Sign in with Slack</span>
    </a>
</div>