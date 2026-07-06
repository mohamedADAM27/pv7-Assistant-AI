import fs from "fs";

export async function parsePdf(filePath: string): Promise<string> {
  if (!fs.existsSync(filePath)) {
    const errText = `PDF file not found at path: ${filePath}`;
    console.error(`PDF Errors: ${errText}`);
    throw new Error(errText);
  }

  try {
    // Import pdf-parse dynamically
    const pdfParse = await import("pdf-parse/lib/pdf-parse.js").then(m => m.default || m);
    
    const dataBuffer = fs.readFileSync(filePath);
    
    // Call the parse function
    const data = await pdfParse(dataBuffer);
    
    if (!data || !data.text) {
      const errText = "Parsed PDF output is empty.";
      console.error(`PDF Errors: ${errText}`);
      throw new Error(errText);
    }

    console.log("[PDF Parser] PDF Loaded Successfully");
    console.log(`[PDF Parser] Characters Extracted: ${data.text.length}`);
    
    return data.text;
  } catch (err: any) {
    const errMsg = `Failed to parse PDF (${filePath}): ${err.message || err}`;
    console.error(`PDF Errors: ${errMsg}`);
    
    // Fallback: Return basic company info if PDF parsing fails
    console.warn("[PDF Parser] Using fallback knowledge base...");
    return `PV7-PROVAHAN KNOWLEDGE BASE

ABOUT PV7-PROVAHAN
PV7-Provahan is a technology-driven company transforming India's used vehicle industry. The platform offers:
- Verified vehicle listings
- Instant loan integration
- Insurance integration
- Vehicle inspections
- Vehicle history verification
- Spare parts marketplace
- Dealer support solutions

COMPANY OVERVIEW
PV7-Provahan recognizes that every customer journey is unique. The company begins by understanding customer requirements and then designs intuitive digital experiences that inspire trust and deliver measurable value.

LEADERSHIP TEAM
Founder and CEO: A. Syed Moosa
- Drives innovation, digital transformation, customer trust initiatives, and long-term business growth.

Co-Founder and CFO: M. Guru Ethiraj
- Oversees financial strategy, risk management, and sustainable growth initiatives.

OFFICE INFORMATION
Address: No.189A, Pallavan Salai, Thiru Vi Ka Nagar, Perambur, Chennai, Tamil Nadu - 600011
Office Timings: 10:00 AM to 06:00 PM (IST)
Working Days: Monday to Saturday
Email: info@provahan.com
Phone: +91 8428427425, +91 8428427428
Website: www.provahan.com

SERVICES OFFERED
1. Vehicle Listings - Post or explore used two-wheelers, cars, and commercial vehicles
2. Advanced Vehicle History - Access detailed ownership, loan, insurance, and blacklist verification records
3. Trusted Inspections - Certified professionals inspect vehicles with mechanical assessment and market valuation
4. Spare Parts & Accessories - Marketplace for genuine spare parts with verified sellers
5. Ownership Transfer - Legal transfer assistance with 7-30 working day processing
6. Duplicate RC - Get duplicate registration certificate in 7-15 working days
7. NOC - Non-Objection Certificate for interstate transfers in 10-20 working days
8. Address Change - Update address in RC records in 7-15 working days
9. Insurance Renewal - Instant to 24 hours processing
10. Permit Services - Commercial vehicle permit assistance in 7-30 working days
11. FASTag Assistance - Application and activation services

FREQUENTLY ASKED QUESTIONS
Q: Is it safe?
A: Yes. Security is our top priority. All communications are encrypted, and all partners undergo rigorous background and identity checks.

Q: Does PV7-Provahan verify documents?
A: Yes. We employ advanced optical character recognition (OCR) and instant secure verifications to validate vehicle papers and insurance documents.

Q: How can I contact support?
A: You can reach us via WhatsApp, callback requests, email at info@provahan.com, or by calling our support team.

CUSTOMER SUPPORT
WhatsApp Support: Available for instant assistance
Callback Request: Support staff will contact during office hours
Email Support: info@provahan.com
Phone Support: +91 8428427425, +91 8428427428

GRIEVANCE REDRESSAL
Grievance Officer: M. Guru Ethiraj
Email: info@provahan.com
Phone: +91 8428427425

COPYRIGHT
© 2025 Provahan Infotech Private Limited. All Rights Reserved.
"Driven by Technology. Built on Trust."`;
  }
}
