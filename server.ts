import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import PDFDocument from "pdfkit";
import { createServer as createViteServer } from "vite";
import { env } from "./backend/config/env.ts";
import chatRouter from "./backend/routes/chatRoutes.ts";
import { initializeVectorStore } from "./backend/utils/vectorStore.ts";
import { errorHandler } from "./backend/middleware/errorHandler.ts";

const app = express();
const PORT = env.PORT;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Register API and Chat Router
app.use(chatRouter);

// Fallback PDF generation if no knowledge base PDF is found
async function ensurePdfExists(): Promise<string> {
  const primaryPdfPath = path.join(process.cwd(), "PV7-Provahan Knowledge Base.pdf");
  if (fs.existsSync(primaryPdfPath)) {
    console.log(`[Startup] Found primary knowledge base PDF at: ${primaryPdfPath}`);
    return primaryPdfPath;
  }

  const fallbackPdfPath = path.join(process.cwd(), "knowledge.pdf");
  if (fs.existsSync(fallbackPdfPath)) {
    console.log(`[Startup] Found fallback knowledge base PDF at: ${fallbackPdfPath}`);
    return fallbackPdfPath;
  }

  console.log("[Startup] Knowledge PDF missing. Building knowledge.pdf with default company data...");
  
  return new Promise<string>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(fallbackPdfPath);
      doc.pipe(stream);

      const pages = [
        `PV7-PROVAHAN KNOWLEDGE BASE\n\nTABLE OF CONTENTS\n1. About PV7-Provahan\n2. Company Overview\n3. Why PV7-Provahan Stands Apart\n4. Mission\n5. Vision\n6. Leadership Team\n7. Office Information\n8. Services Offered\n9. Platform Features\n10. FAQs\n11. Customer Support Process\n12. Terms & Conditions\n13. Privacy Policy\n14. Grievance Redressal\n15. Social Media & Website Information\n16. Copyright Information\n\n1. ABOUT PV7-PROVAHAN\nPV7-Provahan is a technology-driven company transforming India's used vehicle industry. Built on extensive expertise in the automobile sector, the company offers a smart, secure, and seamless digital platform for buying, selling, and managing pre-owned vehicles.\n\nIts comprehensive ecosystem includes:\n• Verified vehicle listings\n• Instant loan integration\n• Insurance integration\n• Vehicle inspections\n• Vehicle history verification\n• Spare parts marketplace\n• Dealer support solutions\n\nPV7-Provahan simplifies vehicle ownership through innovation, transparency, and customer-centric digital experiences.\nThe platform serves individual users, dealerships, and businesses across India.`,
        `2. COMPANY OVERVIEW\nPV7-Provahan recognizes that every customer journey is unique. The company begins by understanding customer requirements and then designs intuitive digital experiences that inspire trust and deliver measurable value.\n\nWhether users are:\n• First-time sellers\n• Experienced dealers\n• Individual buyers\n• Commercial vehicle owners\n\nPV7-Provahan provides the tools required to buy, sell, finance, insure, verify, and manage vehicles efficiently.\nThe company is redefining mobility in India through advanced technology, data intelligence, and customer-centric design.\n\n3. WHY PV7-PROVAHAN STANDS APART\nPV7-Provahan is more than a marketplace.\nThe company combines real-world automobile expertise with cutting-edge digital solutions to solve long-standing challenges in the used vehicle ecosystem.\n\nProblems addressed include:\n• Unreliable vehicle listings\n• Complex paperwork\n• Limited financing access\n• Insurance difficulties\n• Lack of transparency\n• Difficulty accessing spare parts\n\nCore values:\n• Trust\n• Transparency\n• Innovation\n• Customer-first approach\n• Seamless mobility`,
        `PV7-Provahan believes mobility represents freedom, opportunity, and trust.\n\n4. MISSION\nTo transform India's used vehicle ecosystem into a trusted, transparent, and paperless digital marketplace.\nPV7-Provahan is committed to simplifying buying, selling, financing, and insuring vehicles through innovation and integrity.\nThe company aims to empower individuals and businesses with safer, smarter, and more seamless mobility experiences.\n\n5. VISION\nPV7-Provahan envisions a future where mobility is accessible to everyone and acts as a catalyst for growth and progress.\nThe company aims to build India's most comprehensive mobility ecosystem integrating:\n• Vehicle discovery\n• Vehicle verification\n• Finance\n• Insurance\n• Inspections\n• Spare parts\nunder one intelligent digital platform.\nPV7-Provahan aspires to become the cornerstone of India's mobility revolution.\n\n6. LEADERSHIP TEAM\nA. Syed Moosa\nFounder and CEO\nA. Syed Moosa leads the strategic direction of PV7-Provahan.\nHe drives innovation, digital transformation, customer trust initiatives, and long-term business growth.`,
        `Quote:\n"I set out with a clear ambition—to reimagine the used vehicle space in India through intelligent design, customer-centric solutions, and forward-thinking execution."\n\nM. Guru Ethiraj\nCo-Founder and CFO\nM. Guru Ethiraj oversees financial strategy, risk management, and sustainable growth initiatives.\nHe focuses on building resilient systems while ensuring transparency, integrity, and long-term value creation.\n\nQuote:\n"We are committed to leading with integrity, creativity, and transparency."\n\n7. OFFICE INFORMATION\nRegistered Office Address\nPV7-Provahan Infotech Private Limited\nNo.189A, Pallavan Salai, Thiru Vi Ka Nagar, Perambur, Chennai, Tamil Nadu - 600011\n\nAlternate Address:\n189A, Pallavan Salai, Sembium, Chennai - 600011\n\nOffice Timings\n10:00 AM to 06:00 PM (IST)\n\nWorking Days\nMonday to Saturday\n\nEmail Addresses\nPrimary Support: info@provahan.com`,
        `General Contact: provahanindia@gmail.com\n\nPhone Numbers\n+91 8428427425\n+91 8428427428\n\nWebsite\nwww.provahan.com\n\n8. SERVICES OFFERED\nVehicle Listings\nDescription:\nUsers can easily post or explore used vehicles including:\n• Two-wheelers\n• Cars\n• Commercial vehicles\n\nFeatures:\n• Verified listings\n• Advanced search filters\n• Real-time updates\n• Nationwide reach\n\nAdvanced Vehicle History\nDescription:\nUsers can access detailed vehicle history using the registration number.\n\nInformation available:\n• Ownership records\n• Loan status\n• Insurance validity`,
        `• Blacklist verification\n\nPurpose:\nTo improve transparency and prevent fraud.\n\nTrusted Inspections\nDescription:\nCertified professionals inspect vehicles before transactions.\n\nInspection includes:\n• Mechanical assessment\n• Odometer verification\n• Service history review\n• Authenticity verification\n• Market valuation\n\nSpare Parts & Accessories\nDescription:\nMarketplace for genuine spare parts and accessories.\n\nBenefits:\n• Verified sellers\n• Competitive pricing\n• Timely delivery\n• Authentic products\n\nOwnership Transfer\nDescription:\nLegal transfer of vehicle ownership.\n\nRequired Documents:\n• Original RC`,
        `• Insurance\n• PUC\n• Buyer & Seller ID proof\n• Address proof\n• Form 29 & 30\n\nProcessing Time:\n7–30 working days\n\nApproximate Fees:\nRs. 500–Rs. 5,000\n\nEligibility:\nRegistered owner and buyer.\n\nDuplicate RC\nRequired when original RC is lost or damaged.\n\nProcessing Time:\n7–15 working days\n\nApproximate Fees:\nRs. 300–Rs. 1,500\n\nNOC\nRequired for interstate transfers.\n\nProcessing Time:\n10–20 working days\n\nApproximate Fees:\nRs. 500–Rs. 2,500`,
        `Address Change\nUpdate address in RC records.\n\nProcessing Time:\n7–15 working days\n\nApproximate Fees:\nRs. 300–Rs. 1,500\n\nInsurance Renewal\nProcessing Time:\nInstant to 24 hours.\n\nFees:\nDepends on insurer and coverage.\n\nPermit Services\nCommercial vehicle permit assistance.\n\nProcessing Time:\n7–30 working days.\n\nFASTag Assistance\nApplication, activation, replacement, and updates.\n\nProcessing Time:\nInstant to 7 working days.`,
        `9. FREQUENTLY ASKED QUESTIONS\nQ. What is PV7-Provahan?\nPV7-Provahan is India's trusted digital platform for used vehicle transactions and related services.\n\nQ. What vehicle categories are supported?\nTwo-wheelers, cars, and commercial vehicles.\n\nQ. Is PV7-Provahan a dealership?\nNo. It is a digital platform facilitating vehicle transactions.\n\nQ. Is it safe?\nYes. The platform focuses on transparency and verified services.\n\nQ. Does PV7-Provahan verify documents?\nYes.\n\nQ. How can customers contact support?\nThrough WhatsApp, callback requests, email, or phone.\n\n10. CUSTOMER SUPPORT PROCESS\nWhatsApp Support\nCustomers can obtain instant assistance from support experts.\n\nRequest Callback\nCustomers may request a callback.\nSupport staff will contact customers during office hours.\n\nEmail Support\ninfo@provahan.com`,
        `Customer Support Phone\n+91 8428427425\n+91 8428427428\n\n11. GRIEVANCE REDRESSAL\nGrievance Officer:\nName: Guru Ethiraj\nDesignation: Grievance Officer\nEmail: info@provahan.com\nPhone: +91 8428427425\nUsers receive a unique ticket number for complaint tracking.\n\n12. TERMS & CONDITIONS SUMMARY\n• Platform usage indicates acceptance of Terms of Use.\n• Users must comply with Indian laws.\n• Users below 18 years cannot independently transact.\n• Platform acts only as an intermediary.\n• Users remain responsible for uploaded content.\n• Terms may be updated without prior notice.\n• Chennai courts have exclusive jurisdiction.\n\n13. PRIVACY POLICY SUMMARY\nPV7-Provahan collects:\n• Name\n• Address\n• Phone number\n• Email\n• Government ID details\n• Device information`,
        `• Usage analytics\n\nInformation is protected through:\n• Secure servers\n• SSL encryption\n• Industry-standard security measures\n\nUsers can request:\n• Data access\n• Data correction\n• Account deletion\n\n14. CHILDREN'S PRIVACY\nThe platform is not intended for users below 18 years of age.\n\n15. SOCIAL MEDIA & WEBSITE INFORMATION\nOfficial Website: www.provahan.com\n\nNavigation Links:\n• Home\n• About Us\n• Services\n• Terms & Conditions\n• Privacy Policy\n• Location\n\nFollow Us:\nOfficial social media channels are available through the "Follow Us" section on the website.\nFor the latest updates, users are encouraged to visit the official website and social media pages.\n\n16. COPYRIGHT\n© 2025 Provahan Infotech Private Limited.`,
        `All Rights Reserved.\n\nTagline:\n"Driven by Technology. Built on Trust."`
      ];

      pages.forEach((pageText, idx) => {
        if (idx > 0) {
          doc.addPage();
        }
        doc.font("Helvetica").fontSize(10).text(pageText, 50, 50, { lineGap: 5 });
      });

      doc.end();
      stream.on("finish", () => {
        console.log("[Startup] Fallback knowledge.pdf generated successfully.");
        resolve(fallbackPdfPath);
      });
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

// Global express error handler middleware
app.use(errorHandler);

// Server startup and asset compilation wiring
async function startServer() {
  try {
    // 1. Ensure PDF is available
    const pdfPath = await ensurePdfExists();
    
    // 2. Initialize Vector Database (with caching optimization)
    console.log("[Startup] Initializing Vector Store...");
    await initializeVectorStore(pdfPath);
    console.log("[Startup] Vector Store initialized successfully.");
  } catch (err) {
    console.error("[Startup Error] Failed to initialize knowledge base:", err);
  }

  // 3. Connect Vite Dev Server or Serve Static Assets
  if (env.NODE_ENV !== "production") {
    console.log("[Startup] Running in DEVELOPMENT mode. Loading Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Startup] Running in PRODUCTION mode. Serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // 4. Start listening
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Startup] Full-stack application running at: http://localhost:${PORT}`);
    console.log(`[Startup] Access your app at: http://0.0.0.0:${PORT}`);
  });

  // Handle server errors
  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[Startup Error] Port ${PORT} is already in use!`);
    } else {
      console.error("[Startup Error] Server error:", err);
    }
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error("[Fatal Startup Error]:", err);
  process.exit(1);
});