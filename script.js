// --- Language & Navigation ---
const navItems = document.querySelectorAll(".nav-item");
const content = document.getElementById("content");
const langSwitcher = document.getElementById("langSwitcher");

const translations = {
  en: { title: "AgriMind", tagline: "The AI Crop Doctor for Low-Connectivity Farmers", diagnose: "Diagnose", sms: "Live announcement", weather: "Weather", dashboard: "Dashboard", diagnoseTitle: "Disease Diagnosis", diagnoseSub: "Upload or capture an image of the affected crop", takePhoto: "Take Photo", upload: "Upload Image", preview: "Preview:", smsContent: "Live announcements & market prices for farmers.", weatherContent: "Check your local weather forecast for farming decisions.", dashboardContent: "Your farm insights and analysis will appear here soon." },
  yo: { title: "AgriMind", tagline: "Dókítà Ọgbìn ọlọ́gbọ́n fún Agbẹ ní àgbègbè tó ní àìlera intanẹẹti", diagnose: "Ṣàyẹ̀wò", sms: "Ìkéde Alive", weather: "Ojú-ọ̀run", dashboard: "Dasibodu", diagnoseTitle: "Ìdánwò Àrùn", diagnoseSub: "Ṣe àtàwọ̀n tàbí kó àwòrán ọgbìn tó ní àrùn", takePhoto: "Ya Àwòrán", upload: "Gbé Àwòrán sórí", preview: "Àwòrán:", smsContent: "Àwọn ìkéde pẹ̀lú owó ọjà fún agbẹ.", weatherContent: "Ṣàyẹ̀wò asọtẹ́lẹ̀ oju-ọ̀run ilé rẹ fún iṣẹ́ àgbẹ̀.", dashboardContent: "Àwọn àfihàn àti àtúpalẹ̀ oko rẹ yóò hàn níbí." },
  ig: { title: "AgriMind", tagline: "AI Dọkịta Ọhịa maka Ndị Ọrụ Ugbo", diagnose: "Nyocha", sms: "Nkwupụta Live", weather: "Ihu igwe", dashboard: "Dashboard", diagnoseTitle: "Nyocha Ọrịa", diagnoseSub: "Bulite ma ọ bụ were foto nke mkpụrụ osisi mebiri emebi", takePhoto: "Were Foto", upload: "Bulite Foto", preview: "Nlele:", smsContent: "Ndị ọrụ ugbo nwere ike ịhụ nkwupụta na ọnụahịa ahịa.", weatherContent: "Lelee ihu igwe mpaghara gị maka ọrụ ugbo.", dashboardContent: "Ihe ọmụma na nyocha ubi gị ga-apụta ebe a." },
  ha: { title: "AgriMind", tagline: "Likitan AI Na Gona Ga Manoma Masu Karancin Intanet", diagnose: "Bincika", sms: "Sanarwa Live", weather: "Yanayi", dashboard: "Dashboard", diagnoseTitle: "Binciken Cuta", diagnoseSub: "Ɗora ko ɗauki hoto na shuka mai matsala", takePhoto: "Dauki Hoto", upload: "Loda Hoto", preview: "Hoton:", smsContent: "Sanarwa da farashin kasuwa don manoma.", weatherContent: "Duba hasashen yanayi don shirye-shiryen aikin gona.", dashboardContent: "Bayanan gonarka za su bayyana anan." },
  pg: { title: "AgriMind", tagline: "Di AI Crop Doctor wey sabi help farmers wey no get better internet", diagnose: "Check Disease", sms: "SMS Help", weather: "Weather", dashboard: "Dashboard", diagnoseTitle: "Check Crop Disease", diagnoseSub: "Upload or snap di leaf wey dey sick", takePhoto: "Snap Picture", upload: "Upload Picture", preview: "Preview:", smsContent: "Send message about di crop make AI help diagnose am.", weatherContent: "Check weather forecast before you go farm.", dashboardContent: "Your farm info go show here soon." }
};

let currentLang = "en";

langSwitcher.addEventListener("click", () => {
  const langs = ["en","yo","ig","ha","pg"];
  const nextIndex = (langs.indexOf(currentLang)+1)%langs.length;
  currentLang = langs[nextIndex];
  langSwitcher.innerHTML = `<i class="fas fa-globe"></i> ${currentLang.toUpperCase()}`;
  updateLanguage();
});

function updateLanguage() {
  document.querySelectorAll("[data-key]").forEach(el=>{
    const key = el.getAttribute("data-key");
    if(translations[currentLang] && translations[currentLang][key]){
      el.textContent = translations[currentLang][key];
    }
  });
}

// --- Sections ---
const sections = {
  diagnose: document.getElementById("diagnoseSection"),
  sms: `
  <section class="container live-announcements">
    <h1 class="title" data-key="sms">Live announcement</h1>
    <p data-key="smsContent">${translations[currentLang].smsContent}</p>
    <div class="ann-controls">
      <button id="readAllBtn" class="btn send-btn"><i class="fa-solid fa-play"></i> Read All</button>
      <input id="annSearch" placeholder="Search announcements..." />
    </div>
    <div id="announcementsList" class="announcements-list"><p>Loading announcements...</p></div>
    <hr style="margin:20px 0;">
    <h2 style="margin-bottom:10px;">Market Prices</h2>
    <div class="price-filters">
      <select id="cropFilter"><option value="">All crops</option></select>
      <select id="stateFilter"><option value="">All states</option></select>
      <input id="priceSearch" placeholder="Search market or crop..." />
      <button id="refreshPrices" class="btn send-btn">Refresh</button>
    </div>
    <div id="pricesTable" class="prices-table"><p>Loading prices...</p></div>
  </section>
  `,
  weather: `
  <section class="container weather">
    <h1 class="title" data-key="weather">Weather</h1>
    <p data-key="weatherContent">${translations[currentLang].weatherContent}</p>
    <div id="weatherContainer" class="weather-card"></div>
  </section>
  `,}
 fetch("data/dashboard_data.json")
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  })
  .then(data => {
    // Update stats
    document.getElementById('totalScans').textContent = data.totalScans || 0;
    document.getElementById('activeFarmers').textContent = data.activeFarmers || 0;
    document.getElementById('diseasesDetected').textContent = data.diseasesDetected || 0;
    document.getElementById('successRate').textContent = (data.successRate || 0) + "%";

    // Render Most Common Diseases as bars
    const barsContainer = document.getElementById('commonDiseases');
    barsContainer.innerHTML = ""; // clear previous
    const maxCount = data.commonDiseases.length
      ? Math.max(...data.commonDiseases.map(d => d.count))
      : 1;
    data.commonDiseases.forEach(d => {
      const bar = document.createElement('div');
      bar.classList.add('bar');
      bar.style.width = ((d.count / maxCount) * 100) + "%";
      bar.textContent = `${d.name} (${d.count})`;
      barsContainer.appendChild(bar);
    });

    // Render Recent Activity
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = "";
    data.recentActivity.forEach(a => {
      const li = document.createElement('li');
      li.textContent = `${a.time} - ${a.farmer}: ${a.action}`;
      activityList.appendChild(li);
    });
  })
  .catch(err => console.error(err));


// --- Navigation ---
navItems.forEach(item=>{
  item.addEventListener("click", ()=>{
    navItems.forEach(btn=>btn.classList.remove("active"));
    item.classList.add("active");
    const section = item.dataset.section;
    if(section==="diagnose"){
      content.innerHTML = "";
      content.appendChild(sections.diagnose);
    }else{
      content.innerHTML = sections[section];
      updateLanguage();
      if(section==="weather") loadWeather();
      if(section==="sms") setTimeout(()=>initAnnouncementsAndPrices(),50);
    }
  });
});

// --- Helper: Escape ---
function escapeHtml(str){return str.replace(/"/g,'&quot;').replace(/'/g,"&#39;");}
function unescapeHtml(str){return str.replace(/&quot;/g,'"').replace(/&#39;/g,"'");}

// --- Text-to-Speech ---
function speak(text){
  if(!("speechSynthesis" in window)) return alert("Text-to-Speech not supported.");
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate=0.9;
  switch(currentLang){
    case "yo": utter.lang="yo-NG"; break;
    case "ig": utter.lang="ig-NG"; break;
    case "ha": utter.lang="ha-NE"; break;
    default: utter.lang="en-US";
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// --- Announcements ---
async function loadAnnouncements(){
  const container=document.getElementById("announcementsList");
  const searchInput=document.getElementById("annSearch");
  container.innerHTML=`<p>Loading announcements...</p>`;
  try{
    const res=await fetch('announcements.json');
    if(!res.ok) throw new Error("Announcements not found");
    const data=await res.json();
    function render(filterText=''){
      const list=data.filter(a=>(a.title[currentLang]+' '+a.body[currentLang]+' '+a.location[currentLang]).toLowerCase().includes(filterText.toLowerCase()));
      if(list.length===0){container.innerHTML=`<p>No announcements match your search.</p>`;return;}
      container.innerHTML=list.map(a=>`
        <div class="announcement-card" data-id="${a.id}">
          <div class="ann-head"><h3>${a.title[currentLang]}</h3>
            <div class="ann-meta"><small>${a.location[currentLang]} • ${a.date}</small></div>
          </div>
          <p>${a.body[currentLang]}</p>
          <div class="ann-actions">
            <button class="btn read-ann" data-text="${escapeHtml(a.title[currentLang]+'. '+a.body[currentLang])}">
              <i class="fa-solid fa-volume-high"></i> Read
            </button>
          </div>
        </div>
      `).join('');
    }
    render();
    searchInput?.addEventListener('input',e=>render(e.target.value));
  }catch(err){
    console.error("Announcements load error:",err);
    container.innerHTML=`<p>⚠️ Unable to load announcements.</p>`;
  }
}

function attachAnnouncementHandlers(){
  document.addEventListener('click',e=>{
    if(e.target.closest('.read-ann')){
      const btn=e.target.closest('.read-ann');
      const text=btn.getAttribute('data-text')||btn.dataset.text;
      speak(unescapeHtml(text));
    }
  });
  const readAllBtn=document.getElementById('readAllBtn');
  readAllBtn?.addEventListener('click',()=>readAllAnnouncements());
}

async function readAllAnnouncements(){
  try{
    const res=await fetch('announcements.json');
    const data=await res.json();
    const text=data.map(a=>`${a.title[currentLang]}. ${a.body[currentLang]}. Location: ${a.location[currentLang]}. Date: ${a.date}.`).join(' ');
    speak(text);
  }catch(err){console.error(err);alert("Unable to read announcements.");}
}

// --- Prices ---
let pricesData=[];
async function loadPrices(){
  const container=document.getElementById("pricesTable");
  const cropFilter=document.getElementById("cropFilter");
  const stateFilter=document.getElementById("stateFilter");
  const priceSearch=document.getElementById("priceSearch");
  container.innerHTML=`<p>Loading prices...</p>`;
  try{
    const res=await fetch('prices.json');
    if(!res.ok) throw new Error("Prices not found");
    pricesData=await res.json();
    const crops=[...new Set(pricesData.map(p=>p.crop))].sort();
    const states=[...new Set(pricesData.map(p=>p.state))].sort();
    cropFilter.innerHTML=`<option value="">All crops</option>`+crops.map(c=>`<option value="${c}">${c}</option>`).join('');
    stateFilter.innerHTML=`<option value="">All states</option>`+states.map(s=>`<option value="${s}">${s}</option>`).join('');
    function render(){
      const crop=cropFilter.value; const state=stateFilter.value; const q=priceSearch.value.trim().toLowerCase();
      const filtered=pricesData.filter(p=>(crop?p.crop===crop:true)&&(state?p.state===state:true)&&(q?(p.market.toLowerCase().includes(q)||p.crop.toLowerCase().includes(q)||p.location.toLowerCase().includes(q)):true));
      if(filtered.length===0){container.innerHTML=`<p>No prices found for your filters.</p>`;return;}
      container.innerHTML=`
        <table class="prices"><thead><tr><th>Crop</th><th>Price (₦/kg)</th><th>Market</th><th>State</th><th>Location</th><th>Last Updated</th><th>Action</th></tr></thead><tbody>
          ${filtered.map(p=>`<tr>
            <td>${p.crop}</td>
            <td>${p.price}</td>
            <td>${p.market}</td>
            <td>${p.state}</td>
            <td>${p.location}</td>
            <td>${p.updated}</td>
            <td><button class="btn read-price" data-text="${escapeHtml(p.crop+' at '+p.market+' in '+p.location+'. Price is '+p.price+' naira per kilogram.')}">
              <i class="fa-solid fa-volume-high"></i>
            </button></td>
          </tr>`).join('')}
        </tbody></table>
      `;
      document.querySelectorAll('.read-price').forEach(btn=>btn.addEventListener('click',()=>speak(unescapeHtml(btn.dataset.text))));
    }
    render();
    cropFilter.addEventListener('change',render);
    stateFilter.addEventListener('change',render);
    priceSearch.addEventListener('input',render);
    document.getElementById("refreshPrices")?.addEventListener('click',loadPrices);
  }catch(err){console.error("Prices load error:",err);container.innerHTML=`<p>⚠️ Unable to load prices.</p>`;}
}

// --- Init both ---
async function initAnnouncementsAndPrices(){
  await loadAnnouncements();
  attachAnnouncementHandlers();
  await loadPrices();
}

// --- Weather ---
async function loadWeather(){
  const apiKey="4004f22137594867aba174613250311";
  const container=document.getElementById("weatherContainer");
  container.innerHTML=`<p>Detecting your location...</p>`;
  if(!navigator.geolocation){container.innerHTML=`<p>⚠️ Geolocation not supported.</p>`;return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    const {latitude,longitude}=pos.coords;
    container.innerHTML=`<p>Fetching weather...</p>`;
    try{
      const url=`https://corsproxy.io/?https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3`;
      const res=await fetch(url);
      if(!res.ok) throw new Error("Bad response");
      const data=await res.json();
      const weather=data.current;
      const loc=data.location;
      const forecastDays=data.forecast.forecastday;
      let html=`<h3>${loc.name}, ${loc.country}</h3>
        <img src="https:${weather.condition.icon}" style="width:60px;height:60px;">
        <p>${weather.condition.text}</p>
        <p>🌡️ Temperature: ${weather.temp_c}°C</p>
        <p>💧 Humidity: ${weather.humidity}%</p>
        <p>💨 Wind: ${weather.wind_kph} km/h</p>
        <hr><h4>3-Day Forecast</h4><div class="forecast-grid">`;
      forecastDays.forEach(day=>{html+=`<div class="forecast-card"><p><b>${day.date}</b></p><img src="https:${day.day.condition.icon}"><p>${day.day.condition.text}</p><p>${day.day.avgtemp_c}°C</p><p>${day.day.daily_chance_of_rain}% rain</p></div>`;});
      html+="</div>"; container.innerHTML=html;
    }catch(err){console.error(err);container.innerHTML=`<p>⚠️ Unable to fetch weather.</p>`;}
  });
}

// --- Diagnose Image ---
const takePhotoBtn=document.getElementById("takePhotoBtn");
const uploadImageBtn=document.getElementById("uploadImageBtn");
const cameraInput=document.getElementById("cameraInput");
const fileInput=document.getElementById("fileInput");
const previewContainer=document.getElementById("previewContainer");
const previewImage=document.getElementById("previewImage");

takePhotoBtn?.addEventListener("click",()=>cameraInput.click());
uploadImageBtn?.addEventListener("click",()=>fileInput.click());

cameraInput?.addEventListener("change",e=>{if(e.target.files.length>0){showPreview(e.target.files[0]);analyzeCropImage(e.target.files[0]);}});
fileInput?.addEventListener("change",e=>{if(e.target.files.length>0){showPreview(e.target.files[0]);analyzeCropImage(e.target.files[0]);}});

function showPreview(file){
  const reader=new FileReader();
  reader.onload=function(e){previewImage.src=e.target.result;previewContainer.style.display="block";}
  reader.readAsDataURL(file);
}

async function analyzeCropImage(file){
  const existing=document.getElementById("analysisResult"); if(existing) existing.remove();
  const resultBox=document.createElement("div");
  resultBox.id="analysisResult"; resultBox.style.marginTop="20px"; resultBox.innerHTML="<p>⏳ Analyzing crop image...</p>";
  previewContainer.appendChild(resultBox);
  try{
    const formData=new FormData(); formData.append("image",file);
    const res=await fetch("http://localhost:5000/analyze",{method:"POST",body:formData});
    const data=await res.json();
    if(!Array.isArray(data)){resultBox.innerHTML="<p>⏳ Model warming up... try again in 10 seconds.</p>";return;}
    const top=data[0];
    resultBox.innerHTML=`<h3 style="margin-bottom:10px;">🧠 AI Diagnosis</h3>
      <p><strong>Disease:</strong> ${top.label.replace(/_/g," ")}</p>
      <p><strong>Confidence:</strong> ${(top.score*100).toFixed(1)}%</p>`;
  }catch(err){console.error(err);resultBox.innerHTML="<p>⚠️ Error analyzing image.</p>";}
}
/* ====== TREND CHARTS & AI INSIGHTS ====== */

// keep references to charts so we can update/destroy them if reloading dashboard
let priceInflationChart = null;
let budgetChart = null;

// call this after dashboard data is loaded (i.e., at the end of loadDashboard())
function renderDashboardExtras(data) {
  // data expected shape:
  // { months: [...], maizePrice: [...], inflation: [...], budget: [...] }
  // If your data uses different keys, adapt mapping.

  const months = data.months || ["Jan","Feb","Mar","Apr","May"];
  const maize = data.maizePrice || [];
  const inflation = data.inflation || [];
  const budget = data.budget || [];

  // Destroy existing charts if present
  if (priceInflationChart) priceInflationChart.destroy();
  if (budgetChart) budgetChart.destroy();

  // Price vs Inflation Chart
  const ctx1 = document.getElementById('priceInflationChart').getContext('2d');
  priceInflationChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Maize Price (₦/kg)',
          data: maize,
          yAxisID: 'y1',
          tension: 0.2,
          borderWidth: 2
        },
        {
          label: 'Inflation (%)',
          data: inflation,
          yAxisID: 'y2',
          tension: 0.2,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      stacked: false,
      scales: {
        y1: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Maize Price (₦)' }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Inflation (%)' },
          grid: { drawOnChartArea: false }
        }
      },
      plugins: { legend: { position: 'top' } }
    }
  });

  // Budget Chart (simple area/line)
  const ctx2 = document.getElementById('budgetChart').getContext('2d');
  budgetChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Agri Budget (₦)',
          data: budget,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { title: { display: true, text: 'Budget (₦)' } }
      }
    }
  });

  // Wire up AI insight generation and the what-if control
  const slider = document.getElementById('subsidySlider');
  const subsidyPct = document.getElementById('subsidyPct');
  const insightBtn = document.getElementById('generateInsightBtn');
  const insightOutput = document.getElementById('insightOutput');

  // show slider value
  slider.oninput = () => { subsidyPct.textContent = slider.value + '%' };

  // basic deterministic "AI" insight generator (replace with API call later)
  insightBtn.onclick = () => {
    const insight = generateInsightFromData({ months, maize, inflation, budget }, Number(slider.value));
    insightOutput.innerHTML = insight.html;
  };

  // optional: auto-generate on load
  const initial = generateInsightFromData({ months, maize, inflation, budget }, Number(slider.value));
  insightOutput.innerHTML = initial.html;
}
// if your dashboard_data.json contains months/maizePrice/inflation/budget arrays, pass it directly;
// otherwise build a small object using the same naming (example below)
const trendData = {
  months: data.months || ["Jan","Feb","Mar","Apr","May"],
  maizePrice: data.maizePrice || data.maizePrice || [],
  inflation: data.inflation || [],
  budget: data.budget || []
};
renderDashboardExtras(trendData);


/* ====== Basic "AI" logic (heuristic) ======
   - estimates % change in maize price vs inflation and budget
   - suggests policy/farmer actions
   - the what-if uses a simple elasticity assumption:
       assume 1% subsidy increase => 0.4% drop in fertilizer price => leads to X% yield/cost effect
   - these numbers are placeholders and must be explained in the demo
*/
function generateInsightFromData(data, subsidyPercent=0) {
  const { months=[], maize=[], inflation=[], budget=[] } = data;
  // compute recent % changes (last vs first)
  function pctChange(arr){
    if(!arr || arr.length<2) return 0;
    const first = Number(arr[0]) || 0;
    const last = Number(arr[arr.length-1]) || 0;
    if(first === 0) return 0;
    return ((last - first) / Math.abs(first)) * 100;
  }
  const maizeChange = pctChange(maize);
  const inflChange = pctChange(inflation);
  const budgetChange = pctChange(budget);

  // simple rule-based recommendations
  let rec = [];
  if (maize.length === 0) rec.push("No maize price data available to generate insights.");
  else {
    // scenario: maize rising faster than inflation => supply constraint or input cost issues
    if (maizeChange > inflChange + 2) {
      rec.push("Maize price is rising faster than inflation — likely due to input cost or supply constraint.");
      rec.push("Policy suggestion: consider targeted fertilizer or seed subsidy and improved market supply (e.g., smoothing imports) in the short term.");
    } else if (maizeChange < inflChange - 2) {
      rec.push("Maize price is growing slower than inflation — affordability might be decreasing.");
      rec.push("Monitor producer incomes; consider small cash transfers for poorest households.");
    } else {
      rec.push("Maize price movement roughly follows inflation — macro factors are dominant.");
      rec.push("Policy suggestion: coordinate fiscal measures and food market monitoring.");
    }
  }

  // budget signal
  if (budgetChange < 0) rec.push(`Agri budget fell by ${budgetChange.toFixed(1)}% — this may reduce extension and subsidy programs.`);

  // compute what-if effect (toy model)
  // assumptions: a subsidyPercent% increase reduces fertilizer cost by 0.4 * subsidyPercent (relative)
  // and fertilizer cost reduction translates to a maize price drop with pass-through = 0.25 (25%)
  const fertilizerCostReductionPct = 0.4 * subsidyPercent; // e.g., 10% subsidy -> 4% fertilizer cost reduction
  const expectedMaizeDropPct = fertilizerCostReductionPct * 0.25; // pass-through
  const lastMaizePrice = Number((data.maize && data.maize.length) ? data.maize[data.maize.length-1] : 0);
  const simulatedPrice = lastMaizePrice * (1 - expectedMaizeDropPct/100);

  // More actionable farmer-level advice
  rec.push(`If fertilizer subsidy rises by ${subsidyPercent}%, model estimates maize price may reduce by ~${expectedMaizeDropPct.toFixed(2)}%, from ₦${lastMaizePrice} to about ₦${simulatedPrice.toFixed(0)} (toy-model estimate).`);
  rec.push("Farmer tips: diversify input sources, bulk-purchase with farmer groups to reduce cost, and consider drought-resistant varieties if yields are unstable.");

  // Build html with bullets and a short explanation of assumptions
  const html = `
    <div class="insight-list">
      ${rec.map(r=>`<p>• ${r}</p>`).join('')}
    </div>
    <p style="font-size:12px;color:#666;margin-top:8px;">Note: This insight uses a simple heuristic model for demo purposes. Replace with real econometric analysis or a GPT/HuggingFace call for more accurate estimates.</p>
  `;

  return { html, score: 0.75 }; // score optional
}
