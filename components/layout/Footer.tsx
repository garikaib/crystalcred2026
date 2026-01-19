"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Mail, MapPin, Phone } from "lucide-react";

interface Socials {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
}

interface Contact {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
}

interface SiteSettings {
    contact: Contact;
    socials: Socials;
}

export function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch site settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">CrystalCred</h3>
                        <p className="text-white/80 mb-6 text-sm leading-relaxed">
                            Bridging the gap to clean energy. We provide premium solar solutions for homes and businesses across Zimbabwe.
                        </p>
                        <div className="flex gap-4">
                            {settings?.socials?.facebook && (
                                <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-ring transition-colors" aria-label="Visit our Facebook page">
                                    <Facebook size={20} />
                                </a>
                            )}
                            {settings?.socials?.twitter && (
                                <a href={settings.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-ring transition-colors" aria-label="Visit our Twitter profile">
                                    <Twitter size={20} />
                                </a>
                            )}
                            {settings?.socials?.instagram && (
                                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ring transition-colors" aria-label="Visit our Instagram profile">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {settings?.socials?.linkedin && (
                                <a href={settings.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ring transition-colors" aria-label="Visit our LinkedIn profile">
                                    <Linkedin size={20} />
                                </a>
                            )}
                            {settings?.socials?.youtube && (
                                <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-ring transition-colors" aria-label="Visit our YouTube channel">
                                    <Youtube size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/gallery" className="hover:text-white transition-colors">Our Work</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Products</h4>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li><Link href="/products/solar-packages" className="hover:text-white transition-colors">Solar Packages</Link></li>
                            <li><Link href="/products/inverters" className="hover:text-white transition-colors">Inverters</Link></li>
                            <li><Link href="/products/batteries" className="hover:text-white transition-colors">Batteries</Link></li>
                            <li><Link href="/products/panels" className="hover:text-white transition-colors">Solar Panels</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-white/80">
                            <li className="flex gap-3 items-start">
                                <MapPin size={18} className="shrink-0 mt-0.5" />
                                <span>{settings?.contact?.address || "Loading..."}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone size={18} className="shrink-0" />
                                <span>{settings?.contact?.phone || "Loading..."}</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail size={18} className="shrink-0" />
                                <span>{settings?.contact?.email || "Loading..."}</span>
                            </li>
                            {settings?.contact?.whatsapp && (
                                <li className="flex gap-3 items-center text-ring font-medium">
                                    <MessageCircle size={18} className="shrink-0" />
                                    <a href={settings.contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">Chat on WhatsApp</a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
                    <p>&copy; {currentYear} CrystalCred. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

