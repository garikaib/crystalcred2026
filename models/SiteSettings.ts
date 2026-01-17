
import mongoose, { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
    {
        contact: {
            address: {
                type: String,
                default: "4th Floor Three Anchor House Building, 54 Jason Moyo, Harare, Zimbabwe",
            },
            phone: {
                type: String,
                default: "+263 78 561 2227",
            },
            email: {
                type: String,
                default: "info@crystalcred.co.zw",
            },
            whatsapp: {
                type: String,
                default: "https://wa.me/263785612227",
            },
        },
        socials: {
            facebook: {
                type: String,
                default: "https://www.facebook.com/p/CrystalCred-Zimbabwe-61554197696461/",
            },
            twitter: {
                type: String,
                default: "",
            },
            instagram: {
                type: String,
                default: "",
            },
            linkedin: {
                type: String,
                default: "",
            },
            youtube: {
                type: String,
                default: "",
            },
            tiktok: {
                type: String,
                default: "",
            },
        },
    },
    { timestamps: true }
);

const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
