export default function getResource(label) {
    const resources = {
        openingAccountTitle: '4. Opening Account',
        importantInfoText: '*IMPORTANT INFORMATION ABOUT OPENING AN ACCOUNT:* To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify and record information that identifies each person who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth, or other information that will allow us to identify you. We may also ask to see your driver’s license or other identifying documents.',
        caResidentsText: '*CA Residents:* If you are married, you may apply for a separate account.',
        nyRiVtResidentsText: '*NY, RI, and VT Residents:* We may order credit reports in connection with processing applications/solicitations and any update, renewal or extension of credit. Upon request, we will tell you the name and address of any consumer-reporting agency that furnished a report on you. You consent to the obtaining of such reports by signing or otherwise submitting an application or solicitation.',
        ohResidentsText: '*OH Residents:* The Ohio laws against discrimination require that all creditors make credit equally available to all creditworthy customers, and that credit reporting agencies maintain separate credit histories on each individual upon request. The Ohio Civil Rights Commission administers compliance with this law.',
        wiResidentsText: '*WI Residents:* No provision of a marital property agreement, unilateral statement under Section 766.59 or court decree under Section 766.70 adversely affects the interest of Comenity Capital Bank, unless the Bank, prior to the time credit is granted, is furnished a copy of the agreement, statement or decree or has actual knowledge of the adverse provision when the obligation to the Bank is incurred.',
        nyResidentsText: '*New York Residents:* Comenity Capital Bank 1-866-412-5563 (TDD/TTY 1-888-819-1918). New York Residents may contact the New York State Department of Financial Services by telephone or visit its website for free information on comparative credit card rates, fees, and grace periods. New York Department of Financial Services 1-800-518-8866 or [www.dfs.ny.gov|https://www.dfs.ny.gov]'
    };

    return resources[label];
}
