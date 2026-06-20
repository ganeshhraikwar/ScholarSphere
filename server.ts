import express from "express";
import path from "path";
import Database from "better-sqlite3";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import { fileURLToPath } from "url";

// Emulate __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
const db = new Database(":memory:"); // using in memory for prototype

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mobile TEXT,
    country TEXT,
    state TEXT,
    category TEXT,
    course TEXT,
    degreeLevel TEXT,
    income INTEGER,
    marks INTEGER,
    skills TEXT,
    isSubscribed INTEGER DEFAULT 0
  );

  CREATE TABLE scholarships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    country TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    category TEXT,
    state TEXT,
    course TEXT,
    degreeLevel TEXT,
    deadline TEXT NOT NULL,
    documents TEXT,
    applyLink TEXT,
    status TEXT DEFAULT 'ACTIVE',
    lastUpdated TEXT NOT NULL
  );

  CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    scholarshipId INTEGER NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(scholarshipId) REFERENCES scholarships(id)
  );

  CREATE TABLE saved_scholarships (
    userId INTEGER NOT NULL,
    scholarshipId INTEGER NOT NULL,
    PRIMARY KEY(userId, scholarshipId),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(scholarshipId) REFERENCES scholarships(id)
  );

  CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// Seed some global scholarships
const insertScholarship = db.prepare(`
  INSERT INTO scholarships (title, provider, country, amount, currency, eligibility, category, state, course, degreeLevel, deadline, documents, applyLink, status, lastUpdated)
  VALUES (@title, @provider, @country, @amount, @currency, @eligibility, @category, @state, @course, @degreeLevel, @deadline, @documents, @applyLink, @status, @lastUpdated)
`);

const today = new Date();
const nextMonth = new Date(today); nextMonth.setMonth(today.getMonth() + 1);
const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);

const seedScholarships = [
  { title: "Fulbright Foreign Student Program", provider: "U.S. Department of State", country: "USA", amount: 45000, currency: "USD", eligibility: "International students, young professionals and artists", category: "General", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Transcripts, GRE/TOEFL, Letters of Recommendation, Personal Statement", applyLink: "https://foreign.fulbrightonline.org/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Chevening Scholarships", provider: "UK Government", country: "UK", amount: 20000, currency: "GBP", eligibility: "Citizen of Chevening-eligible country, 2 years work experience", category: "General", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Transcripts, English Proficiency, 2 Reference Letters, Essays", applyLink: "https://www.chevening.org/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Erasmus Mundus Joint Masters", provider: "European Union", country: "France", amount: 25000, currency: "EUR", eligibility: "Bachelor's degree from any country worldwide", category: "General", state: "All", course: "Various Specialized Courses", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Diploma, Transcripts, CV, Motivation Letter, 2 References", applyLink: "https://erasmus-plus.ec.europa.eu/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "MEXT Scholarship", provider: "Government of Japan", country: "Japan", amount: 1500000, currency: "JPY", eligibility: "Born on or after April 2 1989, physically and mentally healthy", category: "General", state: "All", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Application Form, Transcripts, Medical Certificate, Recommendation Letter", applyLink: "https://www.mext.go.jp/en/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Gates Cambridge Scholarships", provider: "Bill and Melinda Gates Foundation", country: "UK", amount: 30000, currency: "GBP", eligibility: "Outstanding intellectual ability, commitment to improving lives", category: "General", state: "All", course: "Any", degreeLevel: "Ph.D", deadline: nextMonth.toISOString().split('T')[0], documents: "Academic Transcripts, 2 Academic References, 1 Personal Reference", applyLink: "https://www.gatescambridge.org/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "DAAD EPOS Scholarships", provider: "German Academic Exchange Service", country: "Germany", amount: 12000, currency: "EUR", eligibility: "2 years minimum relevant professional experience", category: "General", state: "All", course: "Development-Related Postgraduate Courses", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "DAAD Application, CV, Motivation Letter, Employment Letter", applyLink: "https://www.daad.de/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Australia Awards Scholarships", provider: "Department of Foreign Affairs", country: "Australia", amount: 50000, currency: "AUD", eligibility: "Citizen of a participating country", category: "General", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Proof of citizenship, academic transcripts", applyLink: "https://www.dfat.gov.au/people-to-people/australia-awards", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Eiffel Excellence Scholarship Program", provider: "French Ministry for Europe", country: "France", amount: 14000, currency: "EUR", eligibility: "Foreign students up to 25yo for Master's or 30yo for PhD", category: "General", state: "All", course: "Engineering, Science, Law", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "CV, Project Statement, Transcripts", applyLink: "https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Knight-Hennessy Scholars", provider: "Stanford University", country: "USA", amount: 65000, currency: "USD", eligibility: "Enrolling in a full-time Stanford graduate program", category: "General", state: "California", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Transcripts, Test Scores, Resume, Reccomendations", applyLink: "https://knight-hennessy.stanford.edu/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Vanier Canada Graduate Scholarships", provider: "Government of Canada", country: "Canada", amount: 50000, currency: "CAD", eligibility: "Demonstrated leadership skills and academic excellence", category: "General", state: "All", course: "Health, Natural Sciences, Eng", degreeLevel: "Ph.D", deadline: nextMonth.toISOString().split('T')[0], documents: "Research Proposal, Academic Transcripts", applyLink: "https://vanier.gc.ca/en/home-accueil.html", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Chinese Government Scholarships", provider: "Chinese Scholarship Council", country: "China", amount: 40000, currency: "RMB", eligibility: "Under 25 for UG, 35 for Masters", category: "General", state: "All", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Notarized Highest Diploma, Transcripts, Study Plan", applyLink: "http://www.campuschina.org/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Italian Government Scholarships (Invest Your Talent)", provider: "Ministry of Foreign Affairs Italy", country: "Italy", amount: 9000, currency: "EUR", eligibility: "Students from eligible countries", category: "General", state: "All", course: "Engineering, Technology", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Degree Certificate, Language Proficiency", applyLink: "https://investyourtalentapplication.esteri.it/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Manaaki New Zealand Scholarships", provider: "New Zealand Government", country: "New Zealand", amount: 35000, currency: "NZD", eligibility: "From eligible developing country", category: "General", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Birth Certificate, Transcripts", applyLink: "https://www.nzscholarships.govt.nz/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Korean Government Scholarship Program (KGSP)", provider: "NIIED", country: "South Korea", amount: 15000000, currency: "KRW", eligibility: "Citizens of NIIED designated countries", category: "General", state: "All", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Personal Statement, Study Plan, Reccomendation Letter", applyLink: "https://www.studyinkorea.go.kr/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Swedish Institute Scholarships for Global Professionals", provider: "Swedish Institute", country: "Sweden", amount: 120000, currency: "SEK", eligibility: "3000 hours of work experience", category: "General", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "CV, Motivation Letter, Reference Letters", applyLink: "https://si.se/en/apply/scholarships/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Boustany Astronomy Scholarship", provider: "Boustany Foundation", country: "UK", amount: 10000, currency: "GBP", eligibility: "Excellent academic background", category: "General", state: "All", course: "Astronomy", degreeLevel: "Ph.D", deadline: nextMonth.toISOString().split('T')[0], documents: "CV, Acceptance Letter, Photographs", applyLink: "https://www.boustany-foundation.org/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Tata Scholarship for students from India", provider: "Tata Education", country: "USA", amount: 50000, currency: "USD", eligibility: "Indian citizen, accepted to Cornell", category: "General", state: "New York", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Financial Aid Forms, CSS Profile", applyLink: "https://admissions.cornell.edu/apply/international-students", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Singapore International Graduate Award (SINGA)", provider: "A*STAR", country: "Singapore", amount: 26400, currency: "SGD", eligibility: "International graduates with passion for research", category: "General", state: "All", course: "Biomedical, Computing", degreeLevel: "Ph.D", deadline: nextMonth.toISOString().split('T')[0], documents: "Transcripts, Passport, 2 Reccomendation Letters", applyLink: "https://www.a-star.edu.sg/Scholarships/For-Graduate-Studies/Singapore-International-Graduate-Award-SINGA", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "National Fellowship for OBC Students", provider: "Ministry of Social Justice & Empowerment", country: "India", amount: 372000, currency: "INR", eligibility: "OBC Candidates pursuing M.Phil/Ph.D", category: "Minority", state: "All", course: "Any", degreeLevel: "Ph.D", deadline: nextMonth.toISOString().split('T')[0], documents: "Caste Certificate, Income Certificate, Admission Proof", applyLink: "https://socialjustice.gov.in/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Post Matric Scholarship Scheme for Minorities", provider: "Ministry of Minority Affairs", country: "India", amount: 10000, currency: "INR", eligibility: "Minimum 50% marks, Income < 2 Lakh", category: "Minority", state: "All", course: "Undergraduate", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Marksheets, Income Certificate, Aadhaar", applyLink: "https://scholarships.gov.in/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Swami Vivekananda Merit Cum Means Scholarship", provider: "Govt of West Bengal", country: "India", amount: 60000, currency: "INR", eligibility: "WB resident, 60% marks in last exam", category: "General", state: "West Bengal", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Domicile, Marksheet, Income Proof", applyLink: "https://svmcm.wbhed.gov.in/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "PM-YASASVI Scheme", provider: "Ministry of Social Justice", country: "India", amount: 30000, currency: "INR", eligibility: "OBC/EBC/DNT students in class 9-12", category: "General", state: "All", course: "School", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Income < 2.5 Lakh, School ID", applyLink: "https://yet.nta.ac.in/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Inspire Scholarship (SHE)", provider: "DST, Govt of India", country: "India", amount: 80000, currency: "INR", eligibility: "Top 1% in 12th board, pursuing Basic/Natural Sciences", category: "General", state: "All", course: "Science", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "12th Marksheet, Endorsement Certificate", applyLink: "https://online-inspire.gov.in/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Dr. Ambedkar Post Matric Scholarship for EBC", provider: "Govt of India", country: "India", amount: 20000, currency: "INR", eligibility: "EBC Students, Income < 1 Lakh", category: "Minority", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Income Certificate, Caste Certificate, Aadhaar", applyLink: "https://scholarships.gov.in/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Google Generation Scholarship", provider: "Google", country: "Global (All)", amount: 10000, currency: "USD", eligibility: "Women in Computer Science/Tech outperforming academically", category: "Merit", state: "All", course: "Computer Science", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Transcripts, Resume, 2 Essays", applyLink: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Microsoft Tuition Scholarship", provider: "Microsoft", country: "USA", amount: 15000, currency: "USD", eligibility: "Enrolled in a 4-year Undergrad program in CS or STEM", category: "Merit", state: "All", course: "Computer Science", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Resume, Transcripts", applyLink: "https://careers.microsoft.com/students/us/en/scholarships", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Reliance Foundation Undergraduate Scholarships", provider: "Reliance Foundation", country: "India", amount: 200000, currency: "INR", eligibility: "Passed 12th class with min 60%, Income < 15 lakh", category: "Merit-Cum-Means", state: "All", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Marksheets, Income Proof", applyLink: "https://scholarships.reliancefoundation.org/", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "HDFC Bank Parivartan's ECSS Programme", provider: "HDFC Bank", country: "India", amount: 75000, currency: "INR", eligibility: "Students from Class 1 to PG, Family income < 2.5 Lakh", category: "Need-based", state: "All", course: "Any", degreeLevel: "Postgraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Marksheets, Identity Proof, Income Proof", applyLink: "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Kotak Kanya Scholarship", provider: "Kotak Education Foundation", country: "India", amount: 150000, currency: "INR", eligibility: "Girl students passing 12th with 85%+ pursuing professional pgms", category: "Merit-Cum-Means", state: "All", course: "Professional Course", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Marksheet, Income Certificate, ID Proof", applyLink: "https://www.buddy4study.com/page/kotak-kanya-scholarship", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "L'Oréal India For Young Women In Science", provider: "L'Oréal", country: "India", amount: 250000, currency: "INR", eligibility: "Girl students applying for graduation in science/tech, 85%+ in 12th", category: "Merit", state: "All", course: "Science", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Marksheet, Income certificate", applyLink: "https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarships", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "LIC Golden Jubilee Scholarship", provider: "LIC of India", country: "India", amount: 20000, currency: "INR", eligibility: "60% in 12th/10th, pursuing higher education, income < 2.5 Lakh", category: "Need-based", state: "All", course: "Any", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Marksheets, Income Certificate", applyLink: "https://licindia.in/golden-jubilee-scholarship", status: "ACTIVE", lastUpdated: new Date().toISOString() },
  { title: "Adobe Research Women-in-Technology", provider: "Adobe", country: "Global (All)", amount: 10000, currency: "USD", eligibility: "Female undergrads or masters students in CS or Eng", category: "Merit", state: "All", course: "Computer Science", degreeLevel: "Undergraduate", deadline: nextMonth.toISOString().split('T')[0], documents: "Resume, Transcripts, 3 Letters of Recommendation", applyLink: "https://research.adobe.com/scholarship/", status: "ACTIVE", lastUpdated: new Date().toISOString() }
];

for (const s of seedScholarships) insertScholarship.run(s);

// Procedural generation of 12000+ scholarships globally
const globalCountries = ["USA", "UK", "Canada", "Australia", "India", "Germany", "France", "Japan", "Singapore", "New Zealand", "Netherlands", "Sweden", "Switzerland", "Brazil", "South Africa", "UAE", "All", "Global"];
const companies = ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Reliance", "Tata", "Infosys", "Wipro", "Adobe", "Intel", "IBM", "Cisco", "Oracle", "Samsung", "Sony", "Netflix", "Spotify", "Accenture", "TCS"];
const governments = ["Ministry of Education", "Federal Government", "State Council", "Department of Higher Education", "National Science Foundation", "Research Council", "Buddy4Study Foundation", "Chevening", "Fulbright", "Erasmus", "DAAD"];
const universities = ["Oxford", "Cambridge", "MIT", "Stanford", "Harvard", "Caltech", "Imperial College", "ETH Zurich", "UCL", "Chicago", "NUS", "Melbourne", "Toronto", "TUM", "IIT Bombay", "IIT Delhi", "IIT Madras", "IIM Ahmedabad", "NYU", "UCLA"];
const levels = ["High School", "Undergraduate", "Postgraduate", "PhD", "Post-Doctoral", "Diploma", "All"];
const categories = ["Merit-Based", "Need-Based", "Diversity", "STEM", "Arts & Humanities", "Sports", "Research", "Women in Tech", "Global", "Minority", "First-Generation"];
const courses = ["Computer Science", "Engineering", "Medicine", "Business", "Law", "Social Sciences", "Arts", "Data Science", "AI & ML", "All", "MBA", "Design", "Architecture", "Health Sciences"];
const statesList = ["California", "New York", "Texas", "Massachusetts", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Kerala", "London", "Ontario", "British Columbia", "Victoria", "New South Wales", "Bavaria", "All"];
const docsList = ["Resume, Transcript, SOP", "Resume, Cover Letter", "Transcript, 2 LORs", "SOP, Portfolio", "Income Certificate, Resume"];

function r(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

db.transaction(() => {
  for (let i = 0; i < 12000; i++) {
    const isCorp = Math.random() > 0.4;
    const provider = isCorp ? r(companies) : (Math.random() > 0.5 ? r(governments) : r(universities));
    const country = r(globalCountries);
    const degree = r(levels);
    const course = r(courses);
    const title = `${provider} ${r(["Excellence", "Global", "Future Leaders", "Innovators", "Merit", "Research", "Diversity", "Empowerment", "Visionary", "Impact", "Pioneer", "Scholars", "NextGen"])} Scholarship ${degree === 'All' ? 'Program' : 'for ' + degree}`;
    
    let currency = country === 'India' ? 'INR' : (country === 'UK' ? 'GBP' : (country === 'Germany' || country === 'France' || country === 'Netherlands' ? 'EUR' : 'USD'));
    let amount = currency === 'INR' ? Math.floor(Math.random() * 500) * 1000 + 10000 : Math.floor(Math.random() * 50) * 1000 + 1000;
    
    let d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 365) + 1);
    const deadlineStr = d.toISOString().split('T')[0];

    insertScholarship.run({
      title,
      provider,
      country,
      amount,
      currency,
      eligibility: `Open to ${degree} students studying ${course} with outstanding academic records in ${r(statesList)} or globally.`,
      category: r(categories),
      state: country === 'Global' || country === 'All' ? 'All' : r(statesList),
      course,
      degreeLevel: degree,
      deadline: deadlineStr,
      documents: r(docsList),
      applyLink: `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + provider + ' scholarship')}`,
      status: "ACTIVE",
      lastUpdated: today.toISOString().split('T')[0]
    });
  }
  
  // Seed Users and Reviews
  const insertUser = db.prepare(`INSERT INTO users (name, email, password, country) VALUES (?, ?, 'password123', ?)`);
  const insertReview = db.prepare(`INSERT INTO reviews (userId, rating, comment) VALUES (?, ?, ?)`);
  
  const sampleUsers = [
    { name: "John Doe", email: "john@example.com", country: "USA", review: "ScholarSphere helped me find the perfect STEM scholarship for my Master's! The AI recommendation is spot on.", rating: 5 },
    { name: "Priya Sharma", email: "priya@example.com", country: "India", review: "I secured full funding for my studies thanks to this platform. The search is so easy.", rating: 5 },
    { name: "Alex Wong", email: "alex@example.com", country: "Canada", review: "Great interface, found so many local university grants.", rating: 4 },
    { name: "Maria Garcia", email: "maria@example.com", country: "Spain", review: "Saved me hours of searching. Love the AI agent feature.", rating: 5 },
    { name: "James Smith", email: "james@example.com", country: "UK", review: "Good collection, maybe add more art-focused scholarships.", rating: 4 }
  ];

  for (const u of sampleUsers) {
    const res = insertUser.run(u.name, u.email, u.country);
    insertReview.run(res.lastInsertRowid, u.rating, u.review);
  }
})();

const app = express();
export default app;

const PORT = 3000;

app.use(cors());
app.use(express.json());

  // AI Agent: Discover new scholarships
  async function runDiscoveryAgent() {
    if (!process.env.GEMINI_API_KEY) {
      console.log("[Agent] Skipping discovery, GEMINI_API_KEY is not configured.");
      return;
    }
    
    try {
      console.log("[Agent] Running advanced discovery agent...");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      
      const prompt = `You are an automated scholarship discovery agent. Generate 2 distinct, highly realistic, and globally relevant scholarships that have recently opened and are actively accepting applications.

Return purely a JSON array of objects with these exact keys: "title", "provider", "country", "amount" (number ONLY), "currency" (String like "USD"), "eligibility", "category", "state", "course", "degreeLevel", "deadline" (YYYY-MM-DD), "documents", "applyLink".
      
Output raw JSON, no markdown formatting at all.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      
      const text = response.text || "[]";
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const newScholarships = JSON.parse(cleanJson);
      
      const todayStr = new Date().toISOString().split('T')[0];
      // Prune old ones
      db.prepare("UPDATE scholarships SET status = 'EXPIRED' WHERE deadline < ? AND status = 'ACTIVE'").run(todayStr);

      let count = 0;
      for (const item of newScholarships) {
         try {
           insertScholarship.run({
              title: item.title || "AI Discovered Scholarship",
              provider: item.provider || "Unknown Foundation",
              country: item.country || "Global",
              amount: Number(item.amount) || 5000,
              currency: item.currency || "USD",
              eligibility: item.eligibility || "International students",
              category: item.category || "General",
              state: item.state || "All",
              course: item.course || "Any",
              degreeLevel: item.degreeLevel || "Undergraduate",
              deadline: item.deadline || new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0],
              documents: item.documents || "Standard Application",
              applyLink: item.applyLink || "https://example.com/apply",
              status: "ACTIVE",
              lastUpdated: new Date().toISOString()
           });
           count++;
         } catch(e) {
            console.error("[Agent] Error inserting scholarship", e);
         }
      }
      console.log(`[Agent] Successfully discovered and analyzed ${count} new active scholarships.`);
    } catch(err) {
      console.error("[Agent] Discovery failed:", err);
    }
  }

  // Cron Simulation: Check deadlines
  setInterval(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    db.prepare("UPDATE scholarships SET status = 'EXPIRED' WHERE deadline < ? AND status = 'ACTIVE'").run(todayStr);
  }, 1000 * 60 * 60); // Check every hour
  
  // Advanced Agent Scheduled Task (Every 6 Hours)
  setInterval(() => {
    runDiscoveryAgent();
  }, 1000 * 60 * 60 * 6);

  // Email Agent Scheduled Task (Check for expiring scholarships)
  function runEmailAgent() {
    console.log("[Email Agent] Checking for expiring scholarships to notify subscribed users...");
    const today = new Date();
    today.setDate(today.getDate() + 7); // Remind 7 days before
    const nextWeekStr = today.toISOString().split('T')[0];
    const expiringSoon = db.prepare("SELECT * FROM scholarships WHERE deadline <= ? AND status = 'ACTIVE'").all(nextWeekStr) as any[];
    
    if (expiringSoon.length > 0) {
       const subscribedUsers = db.prepare("SELECT * FROM users WHERE isSubscribed = 1").all();
       for (const user of subscribedUsers as any[]) {
          console.log(`[Email Agent] 📧 Sending email to ${user.email} (User: ${user.name}): "Alert! ${expiringSoon.length} scholarship(s) expanding soon, including ${expiringSoon[0].title}. Deadline is approaching! Log in to apply."`);
       }
    } else {
       console.log("[Email Agent] No expiring scholarships to notify about.");
    }
  }

  // Run email agent every 12 hours
  setInterval(() => {
    runEmailAgent();
  }, 1000 * 60 * 60 * 12);

  // Initial check
  db.prepare("UPDATE scholarships SET status = 'EXPIRED' WHERE deadline < ? AND status = 'ACTIVE'").run(new Date().toISOString().split('T')[0]);

  // APIs
  app.post("/api/user/subscribe", (req, res) => {
     const { userId, subscribe } = req.body;
     try {
       db.prepare("UPDATE users SET isSubscribed = ? WHERE id = ?").run(subscribe ? 1 : 0, userId);
       res.json({ success: true, isSubscribed: subscribe });
       if (subscribe) {
          console.log(`[Email Agent] User ${userId} subscribed. Triggering welcome check...`);
          runEmailAgent();
       }
     } catch (e: any) {
       res.status(500).json({ error: e.message });
     }
  });

  app.post("/api/agent/trigger", async (req, res) => {
     // Allow manual trigger for demo
     runDiscoveryAgent();
     res.json({ message: "Agent discovery job started in the background." });
  });

  app.get("/api/stats/live-users", (req, res) => {
    // Generate a pseudo-random live user count that fluctuates
    const base = 420;
    const timeFactor = Math.floor(Date.now() / 10000) % 20; // changes every 10s
    res.json({ liveUsers: base + timeFactor });
  });

  app.get("/api/scholarships", (req, res) => {
    let query = "SELECT * FROM scholarships WHERE status = 'ACTIVE'";
    const conditions = [];
    const params = [];

    if (req.query.search) {
       conditions.push("(title LIKE ? OR provider LIKE ?)");
       params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    if (req.query.country && req.query.country !== "All") {
      conditions.push("(country = ? OR country = 'All')");
      params.push(req.query.country);
    }
    if (req.query.degreeLevel && req.query.degreeLevel !== "All") {
      conditions.push("(degreeLevel = ?)");
      params.push(req.query.degreeLevel);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    let countQuery = "SELECT COUNT(*) as count FROM scholarships WHERE status = 'ACTIVE'";
    if (conditions.length > 0) countQuery += " AND " + conditions.join(" AND ");

    if (conditions.length > 0) query += " AND " + conditions.join(" AND ");
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    try {
      const results = db.prepare(query).all(...params);
      const totalCount = (db.prepare(countQuery).get(...params.slice(0, -2)) as any).count;
      res.json({ items: results, totalCount, page, totalPages: Math.ceil(totalCount / limit) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/scholarships/expired", (req, res) => {
    try {
      const results = db.prepare("SELECT * FROM scholarships WHERE status = 'EXPIRED'").all();
      res.json(results);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/reviews", (req, res) => {
    try {
      const results = db.prepare(`
        SELECT r.*, u.name as userName, u.country as userCountry 
        FROM reviews r 
        JOIN users u ON r.userId = u.id 
        ORDER BY r.createdAt DESC LIMIT 50
      `).all();
      res.json(results);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/reviews", (req, res) => {
    try {
      const { userId, rating, comment } = req.body;
      db.prepare("INSERT INTO reviews (userId, rating, comment) VALUES (?, ?, ?)").run(userId, rating, comment);
      res.json({ success: true });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/scholarships/:id", (req, res) => {
    try {
      const s = db.prepare("SELECT * FROM scholarships WHERE id = ?").get(req.params.id);
      if (s) res.json(s);
      else res.status(404).json({ error: "Not found" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    try {
      const { name, email, password, mobile, country, state, category, course, degreeLevel, marks, income, skills } = req.body;
      const stmt = db.prepare(`INSERT INTO users (name, email, password, mobile, country, state, category, course, degreeLevel, marks, income, skills) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      const info = stmt.run(name, email, password, mobile, country, state, category, course, degreeLevel, marks, income, skills);
      
      const user = db.prepare("SELECT id, name, email, country, state, category, course, degreeLevel, marks, income, skills FROM users WHERE id = ?").get(info.lastInsertRowid) as any;
      res.json({ token: "fake-jwt-token-" + user.id, user });
    } catch (e: any) {
      res.status(400).json({ error: "Email might be already in use or missing fields. " + e.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare("SELECT id, name, email, country, state, category, course, degreeLevel, marks, income, skills, isSubscribed FROM users WHERE email = ? AND password = ?").get(email, password) as any;
      if (user) {
        res.json({ token: "fake-jwt-token-" + user.id, user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Saved Scholarships
  app.post("/api/users/:id/save", (req, res) => {
    try {
      db.prepare("INSERT OR IGNORE INTO saved_scholarships (userId, scholarshipId) VALUES (?, ?)").run(req.params.id, req.body.scholarshipId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/users/:id/unsave", (req, res) => {
    try {
      db.prepare("DELETE FROM saved_scholarships WHERE userId = ? AND scholarshipId = ?").run(req.params.id, req.body.scholarshipId);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/users/:id/saved", (req, res) => {
    try {
      const items = db.prepare(`
        SELECT s.* FROM scholarships s 
        JOIN saved_scholarships ss ON s.id = ss.scholarshipId 
        WHERE ss.userId = ?
      `).all(req.params.id);
      res.json(items);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // End of API routes






  // Vite middleware for development (only run locally)
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    import("vite").then(async ({ createServer: createViteServer }) => {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    });
  } else if (!process.env.VERCEL) {
    // Production standalone mode (not Vercel)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
