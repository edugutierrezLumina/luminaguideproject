import React, { useEffect } from 'react';
import './TermsModal.css';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="terms-modal-backdrop" onClick={handleBackdropClick}>
      <div className="terms-modal-container">
        <button className="terms-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="terms-modal-content">
          <div className="terms-header">
            <h1>TERMS AND CONDITIONS OF USE - LUMINAGUIDE.ORG</h1>
            <p className="last-updated">Last Updated: October 16, 2025</p>
          </div>

          <div className="terms-body">
            {/* Section 1 */}
            <section className="terms-section">
              <h2>1. ACCEPTANCE OF TERMS</h2>
              <p>
                By accessing and using the LuminaGuide.org platform (hereinafter, "the Platform", "our Site" or "the Service"), you agree to be legally bound by these Terms and Conditions. If you do not agree with these terms, you should not use our Service.
              </p>
              <p>
                LuminaGuide.org is operated by [Your Legal Entity Name] headquartered in Oregon, United States. We reserve the right to modify these terms at any time, and we will notify you of such changes via email or posting on the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section className="terms-section">
              <h2>2. SERVICE DESCRIPTION</h2>
              <p>
                LuminaGuide.org is a digital platform that connects individuals seeking spiritual growth with qualified spiritual guides. Our services include:
              </p>
              <ul>
                <li>Search system and profiles of spiritual guides</li>
                <li>Session and appointment scheduling</li>
                <li>Educational content through blog and community forums</li>
                <li>Administration portal for collaborators</li>
              </ul>
              <p className="important-notice">
                <strong>IMPORTANT:</strong> LuminaGuide.org is NOT a licensed mental health service provider, does NOT provide medical diagnoses, psychological treatment or crisis intervention. Our services are of a spiritual and general wellness nature.
              </p>
            </section>

            {/* Section 3 */}
            <section className="terms-section">
              <h2>3. ELIGIBILITY AND ACCOUNT REGISTRATION</h2>
              
              <h3>3.1 Age Requirements</h3>
              <p>You must be at least 18 years of age to use our Service. By registering, you represent and warrant that you are at least 18 years old.</p>

              <h3>3.2 Account Information</h3>
              <p>By creating an account, you agree to:</p>
              <ul>
                <li>Provide accurate, current and complete information</li>
                <li>Maintain and update your information in a timely manner</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activity that occurs under your account</li>
              </ul>
              <p>We reserve the right to suspend or cancel your account if the information provided is inaccurate, incomplete or fraudulent.</p>
            </section>

            {/* Section 4 */}
            <section className="terms-section">
              <h2>4. PRIVACY AND DATA PROTECTION</h2>

              <h3>4.1 HIPAA Compliance</h3>
              <p>Although LuminaGuide.org is not a covered entity under HIPAA, we implement similar safeguards to protect your personal information, including:</p>
              <ul>
                <li><strong>Data encryption in transit:</strong> All data transmissions use TLS 1.2 or higher encryption</li>
                <li><strong>Data encryption at rest:</strong> Your personal information is stored in encrypted form</li>
                <li><strong>Access control:</strong> Only authorized personnel have access to sensitive information</li>
                <li><strong>Audit logging:</strong> We maintain detailed records of data access and modifications</li>
                <li><strong>Backups:</strong> We perform regular backups of all information</li>
              </ul>

              <h3>4.2 Compliance with Oregon Consumer Privacy Act (OCPA)</h3>
              <p>In compliance with the Oregon Consumer Privacy Act effective July 1, 2024, you have the following rights:</p>

              <h4>Consumer Rights:</h4>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Obtain a portable copy of your data</li>
                <li>Opt out of targeted advertising</li>
                <li>Opt out of the sale of personal data</li>
              </ul>

              <h4>Special Protections (effective January 1, 2026):</h4>
              <ul>
                <li><strong>Prohibition on sale of precise geolocation data:</strong> We do not sell location data that identifies your position within a radius of 1,750 feet</li>
                <li><strong>Protection of data of minors under 16:</strong> We do not process personal data of minors under 16 for targeted advertising, sale or profiling</li>
              </ul>

              <h3>4.3 Data Collection and Use</h3>
              <p>We collect and process the following types of information:</p>
              <ul>
                <li><strong>Account information:</strong> Name, email, encrypted password</li>
                <li><strong>Profile information:</strong> Spiritual interests, guide preferences</li>
                <li><strong>Usage information:</strong> Pages visited, session time, platform interactions</li>
                <li><strong>Technical information:</strong> IP address, browser type, device used</li>
              </ul>
              <p><strong>We do NOT collect:</strong> Protected health information (PHI), social security numbers, complete financial information (we only process payments through PCI-DSS certified payment processors).</p>

              <h3>4.4 Cookies and Tracking Technologies</h3>
              <p>We use cookies and similar technologies to improve your experience. You can configure your browser to reject cookies, although this may affect some functionalities of the Site.</p>

              <h3>4.5 Sharing Information with Third Parties</h3>
              <p>We do not sell your personal data. We share information only with:</p>
              <ul>
                <li><strong>Service providers:</strong> Hosting, payment processing, analytics (all with data protection agreements)</li>
                <li><strong>Spiritual guides:</strong> Information necessary to provide scheduled sessions</li>
                <li><strong>Legal authorities:</strong> When required by law</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="terms-section">
              <h2>5. ACCEPTABLE USE AND PROHIBITIONS</h2>

              <h3>5.1 Permitted Uses</h3>
              <p>You may use the Platform only to:</p>
              <ul>
                <li>Search for and connect with spiritual guides</li>
                <li>Schedule and participate in sessions</li>
                <li>Access educational content</li>
                <li>Participate respectfully in community forums</li>
              </ul>

              <h3>5.2 Prohibited Conduct</h3>
              <p>You agree NOT to:</p>
              <ul>
                <li>Use the Service for illegal or unauthorized purposes</li>
                <li>Violate any local, state, national or international law</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, intimidate or threaten other users or guides</li>
                <li>Post defamatory, obscene, offensive content or that infringes on third party rights</li>
                <li>Attempt to gain unauthorized access to the Platform or its systems</li>
                <li>Use robots, scrapers or other automated tools without authorization</li>
                <li>Interfere with the normal operation of the Platform</li>
                <li>Collect personal information from other users without consent</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="terms-section">
              <h2>6. INTELLECTUAL PROPERTY</h2>

              <h3>6.1 LuminaGuide Content</h3>
              <p>All content on the Platform, including text, graphics, logos, images, software and data compilations, is the property of LuminaGuide.org and is protected by copyright, trademark and other intellectual property laws.</p>

              <h3>6.2 User Content</h3>
              <p>By posting content on the Platform (comments, forum posts, reviews), you grant LuminaGuide.org a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt and publish such content for the purpose of operating and promoting the Service.</p>
            </section>

            {/* Section 7 */}
            <section className="terms-section">
              <h2>7. LIMITATION OF LIABILITY</h2>

              <h3>7.1 No Warranties</h3>
              <p className="legal-text">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
              </p>

              <h3>7.2 Disclaimer of Liability</h3>
              <p>LuminaGuide.org is NOT responsible for:</p>
              <ul>
                <li>The quality, safety or legality of services provided by independent spiritual guides</li>
                <li>Any direct, indirect, incidental, special or consequential damages arising from the use of the Platform</li>
                <li>Data loss, service interruptions or technical errors</li>
                <li>Interactions between users and spiritual guides</li>
                <li>Decisions made based on information or advice received through the Platform</li>
              </ul>

              <h3>7.3 Guide Verification</h3>
              <p>While we make reasonable efforts to verify the credentials of spiritual guides, we do NOT guarantee the accuracy of their qualifications, experience or suitability. It is your responsibility to exercise your own judgment when selecting and working with a guide.</p>
            </section>

            {/* Section 8 */}
            <section className="terms-section">
              <h2>8. INDEMNIFICATION</h2>
              <p>You agree to indemnify, defend and hold harmless LuminaGuide.org, its affiliates, directors, employees and agents from any claim, damage, loss, liability, cost or expense (including reasonable legal fees) arising from:</p>
              <ul>
                <li>Your use of the Platform</li>
                <li>Violation of these Terms and Conditions</li>
                <li>Violation of third party rights</li>
                <li>Any content you post on the Platform</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="terms-section">
              <h2>9. CANCELLATION AND REFUND POLICY</h2>

              <h3>9.1 Account Cancellation</h3>
              <p>You may cancel your account at any time by contacting support@luminaguide.org. Upon cancellation, your information will be deleted in accordance with our Data Retention Policy.</p>

              <h3>9.2 Session Cancellation</h3>
              <p>Cancellation and refund policies for sessions with spiritual guides are established individually by each guide and must be reviewed before making a booking.</p>
            </section>

            {/* Section 10 */}
            <section className="terms-section">
              <h2>10. DISPUTE RESOLUTION</h2>

              <h3>10.1 Applicable Law</h3>
              <p>These Terms are governed by the laws of the State of Oregon, United States, without regard to conflicts of legal principles.</p>

              <h3>10.2 Jurisdiction</h3>
              <p>Any dispute arising from these Terms shall be submitted to the exclusive jurisdiction of the state and federal courts located in Oregon.</p>

              <h3>10.3 Arbitration</h3>
              <p>Before initiating any legal proceeding, the parties agree to attempt to resolve any dispute through good faith negotiation for a period of 30 days.</p>
            </section>

            {/* Section 11 */}
            <section className="terms-section">
              <h2>11. GENERAL PROVISIONS</h2>

              <h3>11.1 Modifications</h3>
              <p>We reserve the right to modify these Terms at any time. Changes will take effect immediately after posting on the Platform. Your continued use of the Service after such modifications constitutes your acceptance of the new Terms.</p>

              <h3>11.2 Severability</h3>
              <p>If any provision of these Terms is deemed invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>

              <h3>11.3 Waiver</h3>
              <p>Failure to exercise any right under these Terms does not constitute a waiver of such right.</p>

              <h3>11.4 Entire Agreement</h3>
              <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and LuminaGuide.org.</p>
            </section>

            {/* Section 12 */}
            <section className="terms-section">
              <h2>12. CONTACT</h2>
              <p>For questions about these Terms and Conditions, please contact us:</p>
              <div className="contact-info">
                <p><strong>LuminaGuide.org</strong></p>
                <p>Email: <a href="mailto:legal@luminaguide.org">legal@luminaguide.org</a></p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="terms-section acknowledgment">
              <h2>ACKNOWLEDGMENT AND CONSENT</h2>
              <p className="legal-text">
                BY USING LUMINAGUIDE.ORG, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS AND OUR PRIVACY POLICY.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;