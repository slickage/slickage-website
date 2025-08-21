export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto my-12 px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-2">
          This Cookie Policy explains how Slickage ("we," "us," or "our") uses cookies and similar
          technologies on our website [Your Website URL] (the "Site"). By using the Site, you
          consent to the use of cookies in accordance with this Cookie Policy.
        </p>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our practices or
          for other operational, legal, or regulatory reasons. We encourage you to review this page
          periodically for the latest information on our cookie practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
        <p className="mb-2">
          Cookies are small text files that are placed on your computer or mobile device when you
          visit a website. They are widely used to make websites work more efficiently, as well as
          to provide reporting information and to enable certain functionalities.
        </p>
        <p>
          Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your
          personal computer or mobile device when you go offline, while session cookies are deleted
          as soon as you close your web browser.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
        <p>We use cookies for several purposes, including:</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you
            with services available through our Site and to enable some of its features, such as
            accessing secure areas.
          </li>
          <li>
            <strong>Performance and Functionality Cookies:</strong> These cookies are used to
            enhance the performance and functionality of our Site but are non-essential to their
            use. However, without these cookies, certain functionality may become unavailable.
          </li>
          <li>
            <strong>Analytics and Customization Cookies:</strong> These cookies collect information
            that is used either in aggregate form to help us understand how our Site is being used
            or how effective our marketing campaigns are, or to help us customize our Site for you.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> These cookies are used to make advertising
            messages more relevant to you. They perform functions like preventing the same ad from
            continuously reappearing, ensuring that ads are properly displayed for advertisers, and
            in some cases, selecting advertisements that are based on your interests.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>First-party cookies:</strong> These are cookies set by the website you are
            visiting directly.
          </li>
          <li>
            <strong>Third-party cookies:</strong> These are cookies set by a domain other than that
            of the website you are visiting. This can happen when the website incorporates elements
            from other sites, such as images, social media plugins, or advertising.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Choices Regarding Cookies</h2>
        <p className="mb-2">
          You have the right to decide whether to accept or reject cookies. You can exercise your
          cookie preferences by using the cookie consent tool on our website or by setting your web
          browser controls to accept or refuse cookies.
        </p>
        <p className="mb-2">
          Most web browsers allow you to manage your cookie preferences. You can set your browser to
          refuse all cookies or to indicate when a cookie is being sent. However, if you disable
          cookies, some features or services on our Site may not function properly.
        </p>
        <p>
          For more information on how to control cookies, check your browser's help material or
          visit websites like{' '}
          <a
            href="http://www.allaboutcookies.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            allaboutcookies.org
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-2">
          If you have any questions about our use of cookies or other technologies, please email us
          at:
        </p>
        <p>Email: [Your Contact Email Here]</p>
      </section>

      <div className="text-sm text-gray-500 mt-8">
        <p>Last updated: July 1, 2025</p>
      </div>
    </main>
  );
}
