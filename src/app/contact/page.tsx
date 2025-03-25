import ContactHero from "@/components/contact/contact-hero"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import BusinessHours from "@/components/contact/business-hours"
import FaqSection from "@/components/contact/faq-section"

export default function ContactPage() {
  return (
    <main className="flex-1">
      <ContactHero />

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <div>
              <ContactInfo />
              <BusinessHours />
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </main>
  )
}

