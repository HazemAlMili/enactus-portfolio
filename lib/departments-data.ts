// Departments data - exported as const for optimal tree-shaking and caching
export const DEPARTMENTS = [
  { 
    id: "it", 
    name: "Information Technology", 
    color: "bg-blue-600", 
    desc: "Tech Wizards", 
    heads: [{ name: "Hazem Al-Melli", image: null }], 
    viceHeads: [{ name: "Selvia Bassem" }, { name: "Shady Hawwary" }], 
    members: [
      "Malak Yasser Hassan", "Mariam Eid", "Mario Maher", "Sherry Nezar", 
      "Doaa Ahmed Mohamed", "Hana Osama", "Maya Samy Saad", "Kholoud Hany Mohamed", 
      "Joumana Yasser", "Malak Maher Mohamed", "Malak Maher Marzok", "Menna Allah Tarek Faroa", 
      "Menna Alla Sherif", "Mohamed Essam", "Salma Refaay", "Youssef Bakry", 
      "Malak Ali Hassan", "Abdelrahman Hany", "Dalia Yasser", "Karim Mohamed", 
      "Rahma Emad Mohmed", "Zeinab Hossam", "Alia Mohamed", "Sara Ramadan Eid", 
      "Mirna Shenouda Nassef", "Ahmed Ezzeldin", "Malak Gamal Tawfik", "Malak Hussien Abas", 
      "Passant Amr Ahmed"
    ] 
  },
  { 
    id: "hr", 
    name: "Human Resource", 
    color: "bg-red-500", 
    desc: "People Power", 
    heads: [{ name: "Mariam Abdelhafiz", image: null }], 
    viceHeads: [], 
    members: [] 
  },
  { 
    id: "pm", 
    name: "Project Management", 
    color: "bg-yellow-500", 
    desc: "Project Masters", 
    heads: [{ name: "Aiam Hatem", image: null }], 
    viceHeads: [{ name: "Saif Abdelhakim" }, { name: "Nourhan Elsayed" }], 
    members: [
      "Marolla Ayman Toba Khalil", "Elaria Ashraf Ibrahim Sadaq", "Tasneem Mahmoud Mohamed Nosair", 
      "Fatma Azahraa Nassir", "Mariam Hissen Sayed", "Habiba Hatem Mohamed", 
      "Noura Adel Kamal", "Tasneem Mohammed Abdelsalam", "Habiba Mohamed Ahmed", 
      "Rana Adel Saied", "Basma Ramadan Shaaban Ibrahim", "Malak Nasser Abdullah", 
      "Donia Alsayed Fathy", "Rahma Ahmed Lotfy Ahmed", "Menna Ayman Radwan", 
      "Joudy Eslam Elsayed Ebrahim", "Lojain Haithem El Saeed", "Mahmoud Hussein Mahmoud Hussein", 
      "Abdelrahman Abdelzaher Hassan", "Hassan Sami", "Ahmed Mohamed Elsawy", 
      "Marwan Mhamed Elmoursy", "Mohamed Abo Zaid", "Salma Mahmoud Ismail", 
      "Abdelrahman Ashraf", "Abdelrahman Essam"
    ] 
  },
  { 
    id: "pr", 
    name: "Public Relation", 
    color: "bg-purple-500", 
    desc: "Public Relations", 
    heads: [{ name: "Mohap Saleh", image: null }], 
    viceHeads: [{ name: "Ahmed Refaay" }], 
    members: [
      "Hager Ahmed Nour Eldeen", "Nareman Abdo Omran", "Mohamed Ahmed Kamal", 
      "Mustafa Hassan Ahmed Abdelnaeem", "Kareem Mostafa", "Zeyad Rafik Abdelmoez", 
      "Basmala Yasser Abdulmqsoud", "Shahd Ibrahim Abdelraouf", "Veronica Wageh William", 
      "Mariam Hatem Mahmoud", "Malak Khaled Mohamed", "Omar Mohamed Ahmed", 
      "Shahd Mohamed Abdelaziz", "Moamen Mohamed Amros", "Abeer Talat Mokhtar", 
      "Nour Elhoda Tarek"
    ] 
  },
  { 
    id: "fr", 
    name: "Fundraising", 
    color: "bg-green-500", 
    desc: "Fundraising", 
    heads: [{ name: "Rawan El-Sayed", image: null }], 
    viceHeads: [{ name: "Khalid Selim" }], 
    members: [
      "Wesam Hamdy", "Rawan Mahmoud", "Youssef Mohamed", "Mohamed Anas", 
      "Rawan Essam", "Mohamed Ahmed", "Kareem Hamdy"
    ] 
  },
  { 
    id: "logistics", 
    name: "Logistics", 
    color: "bg-orange-500", 
    desc: "Operations", 
    heads: [{ name: "Mariam Waleed", image: null }], 
    viceHeads: [{ name: "Maryam Waleed Samir" }, { name: "Haidy Mostafa" }], 
    members: [
      "Malak Mohamed Salah", "Marwan Mohamed Ahmed Ali Gad", "Mohamed Yasser Ahmed", 
      "Abdelrahman Mohamed Abdelwahab", "Ahmed Mohamed Fares", "Mohamed Gamal Salah", 
      "Heidi Ebrahim", "Marina Maher Nasry Azer", "Ahmed Karim", "Zeyad Ahmed", 
      "Hamza Elbayoumy"
    ] 
  },   
  { 
    id: "er", 
    name: "Organization", 
    color: "bg-teal-500", 
    desc: "Organization", 
    heads: [{ name: "Rawan Mahmoud", image: null }], 
    viceHeads: [{ name: "Haneen Hossam" }, { name: "Mohamed Mahmoud" }], 
    members: [
      "Abdullah Ehab", "Esraa Mansour", "Hanna Ahmed", "Habiba Abdelnaby", 
      "Rahma Elsayd", "Menna Allah Essam", "Atef Hesham", "Seifelden Montaser", 
      "Jana Ahmed", "Juwayriya Sayed", "Bassem Farid", "Ahmed Amr", "Ahmed Tarek", 
      "Ali Abdelaziz", "Ghezlan Sameh", "Gamila Abdelraheer", "Malak Amr", 
      "Mariam Nasser", "Omar Saleh", "Rawda Shreif", "Saif Matwaly"
    ] 
  },
  { 
    id: "mkt", 
    name: "Marketing", 
    color: "bg-pink-500", 
    desc: "Marketing", 
    heads: [{ name: "Malak Fahmy", image: null }], 
    viceHeads: [{name: "Hasnaa Arabi"}, {name: "Merna Youssef"}], 
    members: [
      "Maryam sayed", "Mawadah ghatas", "Mohamed abdelaziz", "Zeina amr", 
      "Roaa ali", "Malek marwan", "Adam el halawani", "Esraa magdy", 
      "Mariam safwat", "Abdelrahman ehab", "Zeyad ahmed", "Kevin montasser", 
      "Omar usama", "Youssef mohamoud", "Fatma mousa", "Mahmoud alaa", 
      "Abdelrahman yousry", "Andrew hany"
    ] 
  },
  { 
    id: "mm", 
    name: "Multi-media", 
    color: "bg-indigo-500", 
    desc: "Multi-media", 
    heads: [{ name: "Malak Sherif", image: null }], 
    viceHeads: [{ name: "Bavly Samy" }, { name: "Marwan Badran" }], 
    members: [
      "Fares mohamed", "Ahmed Mohamed", "Hossam Eldien Mohamed", "Mohamed Ahmed", 
      "Mohamed Maher", "Yahya Ayman", "Abdullah Hatem", "Gerges Michelle", 
      "Omar Ahmed", "Malak Ali", "Rawan Fahd", "Nour Sherif", "Abdelrahman Sabry"
    ] 
  },
  { 
    id: "pres", 
    name: "Presentation", 
    color: "bg-cyan-500", 
    desc: "Presentation", 
    heads: [{ name: "Mariam Shady", image: null }, { name: "Mariam Mahmoud", image: null }], 
    viceHeads: [], 
    members: [
      "Salsabeel Mohammed", "Kenzy Hesham", "Raneem Shawkat", "Aya Hany", 
      "Jana Hamdy", "Lina Wael", "Maryam Salem", "Salma Mohammed"
    ] 
  },
] as const;

// Female names for avatar generation
export const FEMALE_NAMES = [
  "merna","hasnaa","rawan", "mariam", "malak", "nour", "jana", "salma", "wesam", "nada",
  "shahd", "menna", "habiba", "hana", "yasmin", "rokaya", "renad", "joudy",
  "basmala", "salsabeel", "kenzy", "raneem", "aya", "lina", "selvia", "sherry",
  "doaa", "maya", "kholoud", "joumana", "dalia", "rahma", "zeinab", "alia",
  "sara", "mirna", "passant", "nourhan", "marolla", "elaria", "tasneem",
  "fatma", "noura", "rana", "basma", "donia", "lojain", "esraa", "hanna",
  "juwayriya", "ghezlan", "gamila", "rawda", "haneen", "hager", "nareman",
  "veronica", "abeer", "maryam", "haidy", "heidi", "marina", "mawadah", "zeina", "roaa"
] as const;

export type Department = typeof DEPARTMENTS[number];
