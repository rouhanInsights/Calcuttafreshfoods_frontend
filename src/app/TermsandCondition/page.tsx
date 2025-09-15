export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 15.09.2025</p>

      <div className="space-y-6">
        <p>This website is operated by Calcutta Fresh Foods. By accessing this site or purchasing from us, you agree to be bound by the following terms.</p>

        <section>
          <h2 className="text-xl font-semibold">Key Sections</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>✔️ Minimum age required or guardian consent</li>
            <li>✔️ No illegal use or transmission of malware</li>
            <li>✔️ Products/services subject to change anytime</li>
            <li>✔️ Orders can be refused for any reason</li>
            <li>✔️ Returns accepted only at delivery or if spoiled</li>
            <li>✔️ Third-party tools/links used at your own risk</li>
            <li>✔️ All personal info is protected by our Privacy Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Return & Refund Policy</h2>
          <p>Returns are accepted only at the time of delivery or in case of spoilage. Refunds are processed within 3–5 business days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Shipping Policy</h2>
          <p>We ship within 1–2 business days. No deliveries on holidays. Ensure your shipping details are correct before placing an order.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Governing Law</h2>
          <p>All disputes are subject to the laws of India with jurisdiction in Kolkata, West Bengal.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>📧 <a href="mailto:halderbijoy182@gmail.com" className="underline text-blue-600">halderbijoy182@gmail.com</a><br />
          🌐 <a href="https://calcuttafreshfoods.com" className="underline text-blue-600">https://calcuttafreshfoods.com</a></p>
        </section>
      </div>
    </div>
  );
}
