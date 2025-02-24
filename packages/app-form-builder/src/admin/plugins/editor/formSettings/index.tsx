import * as React from "react";
import { FormSettingsPluginType } from "~/types";
import GeneralSettings from "./components/GeneralSettings";
import TermsOfServiceSettings from "./components/TermsOfServiceSettings";
import ReCaptchaSettings from "./components/ReCaptchaSettings";
import { ReactComponent as SettingsIcon } from "./icons/round-settings-24px.svg";
import { ReactComponent as TermsOfServiceIcon } from "./icons/round-receipt-24px.svg";
import { ReactComponent as ReCaptchaIcon } from "./icons/round-vpn_lock-24px.svg";

const plugins: FormSettingsPluginType[] = [
    {
        name: "form-editor-form-settings-general",
        type: "form-editor-form-settings",
        title: "General settings",
        description: "Manage things like submit success messages and form layout.",
        icon: <SettingsIcon />,
        render(props) {
            return <GeneralSettings {...props} />;
        }
    },
    {
        name: "form-editor-form-settings-tos",
        type: "form-editor-form-settings",
        title: "Terms of service",
        description: "Manage terms of service messaging.",
        icon: <TermsOfServiceIcon />,
        render(props) {
            return <TermsOfServiceSettings {...props} />;
        }
    },
    {
        name: "form-editor-form-settings-recaptcha",
        type: "form-editor-form-settings",
        title: "ReCAPTCHA",
        description: "Enable reCAPTCHA to prevent spam and abuse.",
        icon: <ReCaptchaIcon />,
        render(props) {
            return <ReCaptchaSettings {...props} />;
        }
    }
];
export default plugins;
