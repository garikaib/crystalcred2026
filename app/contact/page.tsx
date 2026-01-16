import { ContactForm } from "@/components/contact/ContactForm"
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Clock, MessageSquare } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 gradient-hero" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Decorative Elements */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl" />

                <div className="container relative z-10 mx-auto px-4 text-center text-white">
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <MessageSquare className="inline-block w-4 h-4 mr-2" />
                        We'd Love to Hear From You
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Contact Us</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Get in touch with our team for a free consultation or technical support. We're here to help you switch to clean energy.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Information */}
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase mb-2 block">Get In Touch</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                                Let's Start a Conversation
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-teal-50 rounded-xl text-teal-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-foreground">Visit Our Office</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            4th Floor Three Anchor House Building,<br />
                                            54 Jason Moyo,<br />
                                            Harare, Zimbabwe
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-orange-50 rounded-xl text-orange-600">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-foreground">Call Us</h3>
                                        <p className="text-muted-foreground mb-1">
                                            <a href="tel:+263785612227" className="hover:text-primary transition-colors">+263 78 561 2227</a>
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 px-3 py-1 rounded-full w-fit mt-2">
                                            <Clock size={14} />
                                            <span>Mon-Sat, 8am - 5pm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-foreground">Email Us</h3>
                                        <p className="text-muted-foreground">
                                            <a href="mailto:info@crystalcred.co.zw" className="hover:text-primary transition-colors">info@crystalcred.co.zw</a>
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">We typically reply within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h3 className="font-bold text-lg mb-4 text-foreground">Follow Our Journey</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.facebook.com/p/Crystalcred-Zimbabwe-61554197696461/"
                                        target="_blank"
                                        className="p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                    <a
                                        href="#"
                                        className="p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <Instagram size={20} />
                                    </a>
                                    <a
                                        href="#"
                                        className="p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <Twitter size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-premium border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400" />
                            <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                            <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you shortly.</p>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[500px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.125774577531!2d31.0505!3d-17.8315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQ5JzUzLjQiUyAzMcKwMDMnMDEuOCJF!5e0!3m2!1sen!2szw!4v1620000000000!5m2!1sen!2szw"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Overlay Card */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 bg-white p-6 rounded-xl shadow-2xl pointer-events-none max-w-sm w-[90%] md:w-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin className="text-primary h-5 w-5" />
                        <span className="font-bold text-foreground">Head Office</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Three Anchor House, Harare
                    </p>
                </div>
            </section>
        </div>
    )
}
