import{c as N,d as Q,r as i,j as t,X as D,g as U,z as m}from"./index-C7egHgm9.js";import{S as Y}from"./sparkles-tENxH3_x.js";import{L as _}from"./loader-2-CwqJeLuZ.js";import{S as K}from"./send-DFduCz_8.js";const J=N("Headphones",[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]]),Z=N("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]),ee=N("MessageCircle",[["path",{d:"m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z",key:"v2veuj"}]]),M="/apiVITE_API_URL=https://clownfish-app-wiznq.ondigitalocean.app/api",re=()=>{const{user:u}=Q(),[P,S]=i.useState(!1),[g,c]=i.useState([]),[d,y]=i.useState(""),[R,h]=i.useState(!1),[b,E]=i.useState([]),[O,p]=i.useState(!1),[o,A]=i.useState(!1),[w,x]=i.useState(null),[v,k]=i.useState(null),I=i.useRef(null),[T,$]=i.useState(null),[H,j]=i.useState(!1),F=i.useRef(null),[B,r]=i.useState([]);i.useEffect(()=>{const a=u!=null&&u.name?`👋 Hi ${u.name}! I'm Villy, your VillageCrunch shopping assistant!

🎯 **Quick Start:** Pick what you're interested in below, or ask me anything!`:`👋 Hi! I'm Villy, your VillageCrunch shopping assistant!

🎯 **Quick Start:** Pick what you're interested in below, or ask me anything!`;c([{type:"bot",text:a,timestamp:new Date}]),r([{label:"🌰 Makhana",value:"show me makhana"},{label:"🥜 Dry Fruits",value:"show dry fruits"},{label:"🍪 Thekua",value:"show thekua"},{label:"💰 Best Deals",value:"best offers"}])},[u]),i.useEffect(()=>{(async()=>{try{const e=await U({});E(e)}catch(e){console.error("Failed to load products:",e)}})()},[]),i.useEffect(()=>{var a;(a=F.current)==null||a.scrollIntoView({behavior:"smooth"})},[g]);const L=a=>{const e=a.target.files[0];if(e){if(e.size>5*1024*1024){m.error("Image size should be less than 5MB");return}x(e);const s=new FileReader;s.onloadend=()=>{k(s.result)},s.readAsDataURL(e)}},q=async()=>{var a;try{if(!u){m.error("Please login to connect with customer care"),c(n=>[...n,{type:"system",text:`⚠️ **Login Required**

To connect with our customer care team, please login to your account first.

You can:
• Click the login button at the top
• Register if you don't have an account
• Continue chatting with me (Villy) for general queries`,timestamp:new Date}]);return}A(!0),p(!1);const s=await(await fetch(`${M}/support/create`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({message:((a=g[g.length-1])==null?void 0:a.text)||"Customer requesting support",category:"other"})})).json();if(s.success){$(s.ticket._id);const n={type:"system",text:`🎧 **Connected to Customer Care**

You are now chatting with our customer care team. They will help you with your issue.

• You can upload images of the product
• Our agent will call you if needed
• Average response time: 2-5 minutes

Please describe your issue...`,timestamp:new Date};c(l=>[...l,n])}else throw new Error(s.message)}catch(e){console.error("Error connecting to agent:",e),m.error("Failed to connect to customer care. Please try again."),A(!1)}},z=a=>{const e=a.toLowerCase();if(o)return null;if(e.includes("issue")||e.includes("problem")||e.includes("complaint")||e.includes("defect")||e.includes("broken")||e.includes("damaged")||e.includes("wrong")||e.includes("missing")||e.includes("not received")||e.includes("bad quality")||e.includes("expired")||e.includes("stale")||e.includes("rotten")||e.includes("smell")||e.includes("refund")||e.includes("cancel")||e.includes("unhappy")||e.includes("disappointed"))return p(!0),r([{label:"📞 Connect Now",value:"agent",primary:!0},{label:"📋 Return Policy",value:"return policy"}]),`😟 **I'm really sorry!** Let me connect you with our team immediately.

**They can help with:**
✅ Instant refund
✅ Free replacement
✅ Direct callback

Click "Connect Now" below! ⚡`;if(e.includes("agent")||e.includes("human")||e.includes("talk")||e.includes("customer care")||e.includes("support"))return p(!0),r([{label:"👤 Connect to Agent",value:"agent",primary:!0}]),`👤 **Ready to connect you with our team!**

⚡ Response time: Under 5 minutes
📸 You can upload photos
☎️ Get callback if needed`;if(e.match(/^(hi|hello|hey|namaste|good morning|good afternoon|good evening)/)){const s=u!=null&&u.name?` ${u.name}`:"";return r([{label:"🌰 Makhana",value:"show makhana"},{label:"🥜 Dry Fruits",value:"dry fruits"},{label:"🍪 Thekua",value:"thekua"},{label:"🎁 Gift Ideas",value:"gifting"}]),`Hi${s}! 😊 Ready to shop?

Pick from below or tell me what you need! 👇`}if(e.includes("makhana")||e.includes("fox nut")){const s=b.filter(n=>{var l;return n.category==="makhana"||((l=n.name)==null?void 0:l.toLowerCase().includes("makhana"))});if(r([{label:"🌶️ Peri Peri",value:"peri peri makhana"},{label:"🧂 Classic",value:"classic makhana"},{label:"🌿 Natural",value:"natural makhana"},{label:"💪 Health Benefits",value:"makhana benefits"}]),s.length>0){let n=`🌟 **${s.length} Makhana Varieties Available**

`;return s.slice(0,3).forEach(l=>{n+=`**${l.name}**
💰 ₹${l.price} | 📦 ${l.weight}

`}),n+=`✅ Crunchy & Fresh
✅ High Protein
✅ Low Calorie`,n}return`🌟 **Makhana Collection**

🌶️ Peri Peri (Spicy)
🧂 Classic Salted
🌿 Natural Plain

💰 ₹199-299 | 100gm
🚚 Free delivery over ₹500`}if(e.includes("thekua")||e.includes("sweet")||e.includes("traditional")||e.includes("bihar")){const s=b.filter(n=>n.category==="thekua");if(r([{label:"🍪 See All",value:"all thekua"},{label:"🎁 For Gifting",value:"thekua gift"},{label:"📦 Bulk Order",value:"bulk thekua"}]),s.length>0){let n=`🍪 **Authentic Bihar Thekua**

`;return s.slice(0,2).forEach(l=>{n+=`**${l.name}** - ₹${l.price}
`}),n+=`
✅ Traditional recipe
✅ Made with jaggery
✅ Perfect for festivals`,n}return`🍪 **Traditional Thekua**

✨ Authentic Bihar recipe
🍯 Pure jaggery sweetness
🎊 Perfect for Chhath Puja

💰 From ₹199 | 250gm`}if(e.includes("dry fruit")||e.includes("almond")||e.includes("cashew")||e.includes("walnut")||e.includes("pistachio")||e.includes("badam")||e.includes("kaju")){r([{label:"🥜 Almonds",value:"almonds"},{label:"🌰 Cashews",value:"cashews"},{label:"🥜 Walnuts",value:"walnuts"},{label:"🎁 Gift Box",value:"dry fruits gift"}]);const s=b.filter(n=>n.category==="dry-fruits");if(s.length>0){let n=`🥜 **Premium Dry Fruits**

`;return s.slice(0,3).forEach(l=>{n+=`**${l.name}** - ₹${l.price}
`}),n+=`
✅ 100% Natural
✅ Premium Quality
✅ Health Benefits`,n}return`🥜 **Premium Dry Fruits**

🌰 Almonds - Brain food
🥜 Cashews - Heart healthy
🌰 Walnuts - Omega-3 rich
🥜 Pistachios - Energy boost

💰 From ₹249 | Best quality`}return e.includes("price")||e.includes("cost")||e.includes("offer")||e.includes("discount")||e.includes("deal")?(r([{label:"🌰 Makhana ₹199",value:"makhana price"},{label:"🍪 Thekua ₹199",value:"thekua price"},{label:"🥜 Dry Fruits ₹249",value:"dry fruits price"}]),`💰 **Best Prices!**

🌰 Makhana: ₹199-299
🍪 Thekua: ₹199-249
🥜 Dry Fruits: ₹249+

🎉 **Offers:**
✅ Free shipping over ₹500
✅ 10% off first order (FIRST10)
✅ Bulk discounts available`):e.includes("deliver")||e.includes("shipping")||e.includes("ship")||e.includes("how long")?(r([{label:"📦 Track Order",value:"track order"},{label:"🚚 Shipping Charges",value:"shipping charges"}]),`🚚 **Fast Delivery!**

📍 Metro Cities: 2-3 days
📍 Other Cities: 3-5 days

✅ FREE over ₹500
✅ Real-time tracking
✅ Same-day dispatch`):e.includes("quality")||e.includes("fresh")||e.includes("natural")?(r([{label:"📦 How We Pack",value:"packaging"},{label:"🌿 100% Natural?",value:"ingredients"}]),`✨ **Quality Guaranteed**

✅ 100% Natural
✅ No Preservatives
✅ Fresh & Hygienic
✅ Quality Checked

🛡️ Not satisfied? Full refund!`):e.includes("order")||e.includes("buy")||e.includes("how to")||e.includes("payment")||e.includes("cod")||e.includes("upi")?(r([{label:"🛍️ Start Shopping",value:"show products"},{label:"💳 Payment Options",value:"payment methods"}]),`🛒 **Easy Ordering!**

1️⃣ Browse & Add to cart
2️⃣ Enter delivery address
3️⃣ Choose payment method
4️⃣ Confirm order

💳 **Payments:**
UPI | Cards | COD | Net Banking`):e.includes("return")||e.includes("refund")||e.includes("replace")||e.includes("exchange")?(r([{label:"🔄 Start Return",value:"agent"},{label:"📋 Policy Details",value:"return policy details"}]),`🔄 **Easy Returns**

✅ 7-day return
✅ Free pickup
✅ Instant refund
✅ No questions asked

**Process:**
Contact us → We pickup → Refund in 3-5 days`):e.includes("benefit")||e.includes("health")||e.includes("nutrition")||e.includes("protein")||e.includes("weight loss")?(r([{label:"🌰 Makhana Benefits",value:"makhana health"},{label:"🥜 Almonds Benefits",value:"almond health"},{label:"🌰 Cashew Benefits",value:"cashew health"}]),`💪 **Health Benefits**

**Makhana:**
✅ High protein
✅ Low calorie
✅ Weight loss friendly

**Almonds:**
✅ Brain booster
✅ Heart healthy

**Cashews:**
✅ Energy rich
✅ Immunity booster`):e.includes("gift")||e.includes("festival")||e.includes("occasion")||e.includes("diwali")||e.includes("wedding")?(r([{label:"🎁 Gift Boxes",value:"gift boxes"},{label:"🪔 Festival Special",value:"festival gifts"},{label:"💼 Corporate Gifting",value:"corporate gifts"}]),`🎁 **Perfect Gifting!**

🪔 Festival hampers
💍 Wedding favors
🏢 Corporate gifts
🎂 Birthday specials

✅ Premium packaging
✅ Personalized cards
✅ Bulk discounts`):e.includes("bulk")||e.includes("wholesale")||e.includes("large order")?(r([{label:"📞 Talk to Team",value:"agent"},{label:"💰 Get Quote",value:"bulk quote"}]),`📦 **Bulk Orders**

💰 Special pricing for ₹5000+
🚚 Free delivery
📦 Custom packaging

**Perfect for:**
🏢 Corporate events
💍 Weddings
🎊 Festivals

Connect with our team for quotes!`):e.includes("thank")||e.includes("thanks")?(r([{label:"🛍️ Browse Products",value:"show products"},{label:"💰 Check Offers",value:"offers"}]),`😊 You're welcome!

Anything else I can help with?`):e.includes("help")||e.includes("contact")?(p(!0),r([{label:"👤 Talk to Agent",value:"agent",primary:!0},{label:"📞 Call Us",value:"phone number"},{label:"📧 Email",value:"email address"}]),`📞 **We're Here to Help!**

🤖 **Ask me about:**
Products, Prices, Delivery

👤 **Talk to team for:**
Orders, Returns, Issues

📞 +91-XXXXXXXXXX
📧 support@villagecrunch.com`):(r([{label:"🌰 Makhana",value:"makhana"},{label:"🥜 Dry Fruits",value:"dry fruits"},{label:"🍪 Thekua",value:"thekua"},{label:"💰 Offers",value:"offers"},{label:"👤 Talk to Agent",value:"agent"}]),`🤔 **Not sure? Try these!**

💬 "Show me makhana"
💬 "Dry fruits prices"
💬 "Delivery time"
💬 "Best offers"

Or pick from quick options below! 👇`)},V=a=>{y(a),setTimeout(()=>{C()},100)},C=async()=>{if(!d.trim()&&!w||H)return;j(!0);const a={type:"user",text:d,image:v,timestamp:new Date};c(n=>[...n,a]);const e=d,s=w;if(y(""),x(null),k(null),o&&T){h(!0);try{const n=new FormData;n.append("message",e),s&&n.append("image",s);const f=await(await fetch(`${M}/support/${T}/message`,{method:"POST",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},body:n})).json();if(f.success)m.success("Message sent to customer care"),setTimeout(()=>{const G={type:"agent",text:"Thank you for sharing the details. Our team is reviewing your case. "+(s?"We've received your image. ":"")+"If we need more information, we'll call you shortly. Average wait time: 3-5 minutes.",timestamp:new Date};c(W=>[...W,G]),h(!1)},2e3);else throw new Error(f.message)}catch(n){console.error("Error sending message:",n),m.error("Failed to send message. Please try again."),h(!1)}finally{j(!1)}return}j(!1),h(!0),setTimeout(()=>{const n=z(e);if(n){const l={type:"bot",text:n,timestamp:new Date};c(f=>[...f,l])}h(!1)},800)},X=a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),C())};return t.jsxs(t.Fragment,{children:[!P&&t.jsxs("button",{onClick:()=>S(!0),className:"fixed bottom-6 right-6 bg-gradient-to-r from-desi-gold to-yellow-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 group","aria-label":"Open AI Chat",children:[t.jsx(ee,{className:"w-6 h-6"}),t.jsx("span",{className:"absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex items-center justify-center animate-pulse",children:"Villy"}),t.jsx("span",{className:"absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",children:"Ask me anything! 💬"})]}),P&&t.jsxs("div",{className:"fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-scale-in border-2 border-desi-gold/20",children:[t.jsxs("div",{className:"bg-gradient-to-r from-desi-gold to-yellow-600 text-white p-4 rounded-t-2xl flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center space-x-3",children:[t.jsxs("div",{className:"relative",children:[t.jsx("div",{className:"w-10 h-10 bg-white rounded-full flex items-center justify-center",children:t.jsx(Y,{className:"w-6 h-6 text-desi-gold"})}),t.jsx("div",{className:"absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"})]}),t.jsxs("div",{children:[t.jsxs("h3",{className:"font-bold",children:["Villy ",o&&"→ Customer Care"]}),t.jsx("p",{className:"text-xs opacity-90",children:o?"🟢 Connected to Agent":"Your AI Shopping Assistant"})]})]}),t.jsx("button",{onClick:()=>S(!1),className:"hover:bg-white/20 p-2 rounded-full transition","aria-label":"Close chat",children:t.jsx(D,{className:"w-5 h-5"})})]}),t.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50",children:[g.map((a,e)=>t.jsx("div",{className:`flex ${a.type==="user"?"justify-end":"justify-start"}`,children:t.jsxs("div",{className:`max-w-[80%] p-3 rounded-2xl ${a.type==="user"?"bg-desi-gold text-white rounded-br-none":a.type==="system"?"bg-blue-50 text-blue-900 rounded-lg border-2 border-blue-200":a.type==="agent"?"bg-green-50 text-green-900 rounded-bl-none border-2 border-green-200":"bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100"}`,children:[a.image&&t.jsx("img",{src:a.image,alt:"Uploaded",className:"w-full rounded-lg mb-2 max-h-48 object-cover"}),t.jsx("p",{className:"text-sm whitespace-pre-line",children:a.text}),t.jsx("p",{className:"text-xs opacity-60 mt-1",children:a.timestamp.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})},e)),O&&!o&&t.jsx("div",{className:"flex justify-center",children:t.jsxs("button",{onClick:q,className:"bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition flex items-center space-x-2 shadow-lg",children:[t.jsx(J,{className:"w-5 h-5"}),t.jsx("span",{className:"font-semibold",children:"Connect to Customer Care"})]})}),R&&t.jsx("div",{className:"flex justify-start",children:t.jsx("div",{className:`p-3 rounded-2xl rounded-bl-none shadow-md ${o?"bg-green-50 border-2 border-green-200":"bg-white border border-gray-100"}`,children:t.jsx(_,{className:`w-5 h-5 animate-spin ${o?"text-green-600":"text-desi-gold"}`})})}),t.jsx("div",{ref:F})]}),t.jsxs("div",{className:"p-4 bg-white border-t border-gray-200 rounded-b-2xl",children:[v&&t.jsxs("div",{className:"mb-3 relative inline-block",children:[t.jsx("img",{src:v,alt:"Preview",className:"w-24 h-24 object-cover rounded-lg"}),t.jsx("button",{onClick:()=>{k(null),x(null)},className:"absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600",children:t.jsx(D,{className:"w-4 h-4"})})]}),B.length>0&&t.jsx("div",{className:"flex flex-wrap gap-2 mb-3 overflow-x-auto",children:B.map((a,e)=>t.jsx("button",{onClick:()=>V(a.value),className:`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all transform hover:scale-105 ${a.primary?"bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg hover:shadow-xl":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:a.label},e))}),t.jsxs("div",{className:"flex items-center space-x-2",children:[o&&t.jsxs(t.Fragment,{children:[t.jsx("input",{type:"file",ref:I,accept:"image/*",onChange:L,className:"hidden"}),t.jsx("button",{onClick:()=>{var a;return(a=I.current)==null?void 0:a.click()},className:"p-2 rounded-full hover:bg-gray-100 transition text-gray-600",title:"Upload product image",children:t.jsx(Z,{className:"w-5 h-5"})})]}),t.jsx("input",{type:"text",value:d,onChange:a=>y(a.target.value),onKeyPress:X,placeholder:o?"Describe your issue...":"Ask me anything...",className:"flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-desi-gold transition"}),t.jsx("button",{onClick:C,disabled:!d.trim()&&!w,className:`p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${o?"bg-green-500 hover:bg-green-600 text-white":"bg-desi-gold hover:bg-yellow-600 text-white"}`,"aria-label":"Send message",children:t.jsx(K,{className:"w-5 h-5"})})]}),t.jsx("p",{className:"text-xs text-gray-500 mt-2 text-center",children:o?"🟢 Connected • Agent will respond shortly":"Villy AI • Instant responses"})]})]})]})};export{re as default};
