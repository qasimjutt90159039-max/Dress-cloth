export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan"
];

export const CITIES_BY_PROVINCE = {
  "Punjab": [
    "Multan", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Sialkot",
    "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Rahim Yar Khan",
    "Gujrat", "Kasur", "Dera Ghazi Khan", "Sahiwal", "Okara", "Wah Cantonment",
    "Chiniot", "Kamoke", "Hafizabad", "Khanewal", "Muzaffargarh", "Mandi Bahauddin",
    "Burewala", "Vehari", "Jhelum", "Bahawalnagar", "Chakwal", "Mianwali"
  ],
  "Sindh": [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah (Shaheed Benazirabad)",
    "Mirpur Khas", "Jacobabad", "Shikarpur", "Khairpur", "Dadu", "Tando Adam",
    "Tando Allahyar", "Ghotki", "Badin", "Umerkot"
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Mingora (Swat)", "Kohat", "Dera Ismail Khan",
    "Bannu", "Swabi", "Charsadda", "Nowshera", "Mansehra", "Haripur"
  ],
  "Balochistan": [
    "Quetta", "Turbat", "Khuzdar", "Hub", "Chaman", "Gwadar", "Sibi",
    "Zhob", "Loralai", "Dera Murad Jamali"
  ],
  "Islamabad Capital Territory": [
    "Islamabad"
  ],
  "Azad Jammu & Kashmir": [
    "Muzaffarabad", "Mirpur", "Kotli", "Rawalakot", "Bhimber", "Bagh"
  ],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Hunza", "Chilas"
  ]
};

export const ALL_PAKISTANI_CITIES = Object.values(CITIES_BY_PROVINCE).flat().sort();
