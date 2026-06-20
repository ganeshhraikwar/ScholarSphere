const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

const insertStmt = db.prepare(`
  INSERT INTO scholarships (title, provider, country, amount, currency, eligibility, category, state, course, degreeLevel, deadline, documents, applyLink, status, lastUpdated)
  VALUES (@title, @provider, @country, @amount, @currency, @eligibility, @category, @state, @course, @degreeLevel, @deadline, @documents, @applyLink, 'ACTIVE', @lastUpdated)
`);

const globalCountries = ["USA", "UK", "Canada", "Australia", "India", "Germany", "France", "Japan", "Singapore", "New Zealand", "Netherlands", "Sweden", "Switzerland", "Brazil", "South Africa", "UAE"];
const companies = ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Reliance", "Tata", "Infosys", "Wipro", "Adobe", "Intel", "IBM", "Cisco", "Oracle", "Samsung", "Sony"];
const governments = ["Ministry of Education", "Federal Government", "State Council", "Department of Higher Education", "National Science Foundation", "Research Council", "Buddy4Study Foundation", "Chevening", "Fulbright", "Erasmus"];
const universities = ["Oxford", "Cambridge", "MIT", "Stanford", "Harvard", "Caltech", "Imperial College", "ETH Zurich", "UCL", "Chicago", "NUS", "Melbourne", "Toronto", "TUM", "IIT Bombay", "IIT Delhi", "IIT Madras", "IIM Ahmedabad"];
const levels = ["High School", "Undergraduate", "Postgraduate", "PhD", "Post-Doctoral", "Diploma", "All"];
const categories = ["Merit-Based", "Need-Based", "Diversity", "STEM", "Arts & Humanities", "Sports", "Research", "Women in Tech", "Global", "Minority"];
const courses = ["Computer Science", "Engineering", "Medicine", "Business", "Law", "Social Sciences", "Arts", "Data Science", "AI & ML", "All", "MBA", "Design", "Architecture", "Health Sciences"];
const statesList = ["California", "New York", "Texas", "Massachusetts", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Kerala", "London", "Ontario", "British Columbia", "Victoria", "New South Wales", "Bavaria", "All"];
const docsList = ["Resume, Transcript, SOP", "Resume, Cover Letter", "Transcript, 2 LORs", "SOP, Portfolio", "Income Certificate, Resume"];

function r(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

db.transaction(() => {
  let count = 0;
  for (let i = 0; i < 12000; i++) {
    const isCorp = Math.random() > 0.4;
    const provider = isCorp ? r(companies) : (Math.random() > 0.5 ? r(governments) : r(universities));
    const country = r(globalCountries);
    const degree = r(levels);
    const course = r(courses);
    const title = `${provider} ${r(["Excellence", "Global", "Future Leaders", "Innovators", "Merit", "Research", "Diversity", "Empowerment", "Visionary", "Impact", "Pioneer", "Scholars", "NextGen"])} Scholarship ${degree === 'All' ? 'Program' : 'for ' + degree}`;
    
    // Amount
    let currency = country === 'India' ? 'INR' : (country === 'UK' ? 'GBP' : (country === 'Germany' || country === 'France' || country === 'Netherlands' ? 'EUR' : 'USD'));
    let amount = currency === 'INR' ? Math.floor(Math.random() * 500) * 1000 + 10000 : Math.floor(Math.random() * 50) * 1000 + 1000;
    
    // Deadline (future up to 1 year)
    let d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 365) + 1);
    const deadline = d.toISOString().split('T')[0];

    const s = {
      title,
      provider,
      country,
      amount,
      currency,
      eligibility: `Open to ${degree} students studying ${course} with outstanding academic records.`,
      category: r(categories),
      state: r(statesList),
      course,
      degreeLevel: degree,
      deadline,
      documents: r(docsList),
      applyLink: `https://example.com/scholarship/${Math.floor(Math.random()*10000000)}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    insertStmt.run(s);
    count++;
  }
  console.log(`Inserted ${count} scholarships procedurally.`);
})();
