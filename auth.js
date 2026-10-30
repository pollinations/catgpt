import { Pollinations } from "@pollinations/sdk";
import { PolliProvider, useAuthState } from "@pollinations/sdk/react";
import { AppUserMenu } from "@pollinations/ui/app-user-menu/sdk";
import pollinationsStyles from "@pollinations/ui/styles.css?raw";
import { createElement, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { setClient } from "./ai.js";

const APP_KEY = "pk_uWjreBEkxFAhjDHo";
const MODELS = ["claude-fast", "nanobanana-2-lite", "nanobanana", "gptimage"];

function Account({ onChange }) {
    const { apiKey, isHydrated, error } = useAuthState();
    useEffect(() => {
        if (!isHydrated) return;
        setClient(apiKey ? new Pollinations({ apiKey }) : null);
        onChange();
    }, [apiKey, isHydrated, onChange]);
    return createElement(
        "div",
        { className: "account-menu" },
        createElement(AppUserMenu, {
            dashboardHref: "https://enter.pollinations.ai",
        }),
        error && createElement("p", { role: "alert" }, error.message),
    );
}

export function mountAuth(onChange) {
    // Retire the previous custom login storage; SDK sessions own auth now.
    localStorage.removeItem("catgpt_api_key");
    const url = new URL(window.location.href);
    for (const name of [
        "key",
        "api_key",
        "access_token",
        "refresh_token",
        "token",
    ])
        url.searchParams.delete(name);
    if (
        /(?:^#|&)(?:api_key|access_token|refresh_token|key|token)=/i.test(
            url.hash,
        )
    )
        url.hash = "";
    window.history.replaceState({}, "", url);

    createRoot(document.getElementById("authContainer")).render(
        createElement(
            PolliProvider,
            {
                appKey: APP_KEY,
                permissions: ["profile", "usage"],
                models: MODELS,
                budget: 5,
                expiry: 1,
                storage: "sessionStorage",
            },
            createElement("style", null, pollinationsStyles),
            createElement(Account, { onChange }),
        ),
    );
}
