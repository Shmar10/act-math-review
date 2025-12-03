import { useState } from 'react';
import ContactForm from './ContactForm';

export default function Footer() {
  const [showContactForm, setShowContactForm] = useState(false);

  // Social media links - update these when accounts are ready
  const socialLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      href: '#', // TODO: Add Facebook page URL
      ariaLabel: 'Visit us on Facebook',
    },
    {
      name: 'Instagram',
      icon: '📷',
      href: '#', // TODO: Add Instagram profile URL
      ariaLabel: 'Follow us on Instagram',
    },
    {
      name: 'Twitter',
      icon: '🐦',
      href: '#', // TODO: Add Twitter/X profile URL
      ariaLabel: 'Follow us on Twitter',
    },
    {
      name: 'YouTube',
      icon: '▶️',
      href: '#', // TODO: Add YouTube channel URL
      ariaLabel: 'Subscribe to our YouTube channel',
    },
  ];

  return (
    <>
      <footer className="mt-12 py-8 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} ACT Math Review. All rights reserved.
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.ariaLabel}
                  className="text-2xl hover:scale-110 transition-transform opacity-70 hover:opacity-100"
                  title={social.name}
                  onClick={(e) => {
                    if (social.href === '#') {
                      e.preventDefault();
                    }
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact Us */}
            <button
              onClick={() => setShowContactForm(true)}
              className="text-sky-400 hover:text-sky-300 underline text-sm"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  );
}

