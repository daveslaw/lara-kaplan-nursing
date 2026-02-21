// Seed 20 sample patient records with growth entries and vaccination records
const BASE = 'http://localhost:3000'

// Vaccine IDs from live DB
const V = {
  hexaxim:    '7dbe6d39-9b52-4028-9c28-3dfe10dc0bbd',
  infanrix:   '0f5dd6dd-0ed2-4391-8888-bb75800cca21',
  rotarix:    'a072de27-bb84-44ea-bfcb-de70997602ce',
  prevenar13: '8a9ea4a7-366f-4630-ba86-4293d7ff5a9c',
  priorix:    '1baf90d9-5850-4b30-8095-a718f96095bd',
  varilrix:   'ecf5c760-802e-41d1-a74f-9d2dd0a0309f',
  menactra:   '85f03c39-6585-47c7-8f6a-82e785ca2a84',
  tetraxim:   '491b41cb-8040-49e4-b8b2-9d24c27a7ce3',
  omzyta:     '659556b4-4b8a-4aa5-a878-9c95b0a41c51',
  onvara:     '9c544b17-9fe9-4663-b84a-347287676546',
  vaxigrip:   '3c2699a5-22ae-42eb-8104-2dcefb265b7a',
  avaxim:     '4b961b61-0bb4-4713-b43c-d03a71880165',
  adacel:     'f8da0355-301e-418d-94f2-0ab4bb66de60',
}

// Add days to a date string
const addDays = (dateStr, days) => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
const addWeeks = (dateStr, weeks) => addDays(dateStr, weeks * 7)
const addMonths = (dateStr, months) => {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

// Patient data — mix of ages from newborn to ~2 years
const patients = [
  {
    patient: {
      client_name: 'Priya Naidoo',
      client_id_number: '9203154289086',
      partner_name: 'Rajan Naidoo',
      baby_name: 'Aryan Naidoo',
      baby_dob: '2025-11-15',
      place_of_birth: 'Mediclinic Sandton',
      home_address: '14 Jacaranda Avenue, Sandton, 2196',
      contact_number: '0823451234',
      email: 'priya.naidoo@gmail.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH4982301',
      main_member_name: 'Rajan Naidoo',
      main_member_id: '8811054289085',
      weeks_gestation: 38.5,
      birth_weight_grams: 3200,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 3,
    growth: [
      { weeks: 0, weight: 3200, length: 49, hc: 34 },
      { weeks: 6, weight: 4800, length: 55, hc: 37 },
      { weeks: 10, weight: 5900, length: 58, hc: 39 },
      { weeks: 14, weight: 6700, length: 61, hc: 40 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Fatima Mokoena',
      client_id_number: '9508264356082',
      partner_name: 'Sipho Mokoena',
      baby_name: 'Zara Mokoena',
      baby_dob: '2025-09-20',
      place_of_birth: 'Netcare Milpark',
      home_address: '8 Berea Road, Johannesburg, 2001',
      contact_number: '0715678901',
      email: 'fatima.mokoena@outlook.com',
      medical_aid_name: 'Momentum',
      medical_aid_number: 'MOM7734521',
      main_member_name: 'Sipho Mokoena',
      main_member_id: '8604275123081',
      weeks_gestation: 39.0,
      birth_weight_grams: 3450,
      mode_of_delivery: 'Caesarean section',
      num_pregnancies: 1,
      num_children: 1,
    },
    ageMonths: 5,
    growth: [
      { weeks: 0, weight: 3450, length: 51, hc: 35 },
      { weeks: 6, weight: 5100, length: 56, hc: 38 },
      { weeks: 14, weight: 6900, length: 62, hc: 40 },
      { weeks: 22, weight: 7800, length: 65, hc: 41 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Liezel van der Merwe',
      client_id_number: '9112085034081',
      partner_name: 'Francois van der Merwe',
      baby_name: 'Mia van der Merwe',
      baby_dob: '2025-07-10',
      place_of_birth: 'Morningside Clinic',
      home_address: '22 Rivonia Road, Morningside, 2196',
      contact_number: '0839012345',
      email: 'liezel@vandermerwe.co.za',
      medical_aid_name: 'Bonitas',
      medical_aid_number: 'BON2281943',
      main_member_name: 'Francois van der Merwe',
      main_member_id: '8709125034080',
      weeks_gestation: 40.0,
      birth_weight_grams: 3650,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 3,
      num_children: 3,
    },
    ageMonths: 7,
    growth: [
      { weeks: 0, weight: 3650, length: 52, hc: 35 },
      { weeks: 6, weight: 5300, length: 57, hc: 38 },
      { weeks: 14, weight: 7100, length: 63, hc: 41 },
      { weeks: 26, weight: 8500, length: 68, hc: 43 },
      { weeks: 30, weight: 8900, length: 70, hc: 43 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Nomsa Dlamini',
      client_id_number: '9306174589083',
      partner_name: 'Thabo Dlamini',
      baby_name: 'Lesego Dlamini',
      baby_dob: '2025-04-05',
      place_of_birth: 'Sunninghill Hospital',
      home_address: '5 Witkoppen Road, Paulshof, 2056',
      contact_number: '0607891234',
      email: 'nomsad@gmail.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH9234512',
      main_member_name: 'Thabo Dlamini',
      main_member_id: '8903185678082',
      weeks_gestation: 37.5,
      birth_weight_grams: 2980,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 10,
    growth: [
      { weeks: 0, weight: 2980, length: 48, hc: 33 },
      { weeks: 6, weight: 4500, length: 54, hc: 37 },
      { weeks: 14, weight: 6200, length: 60, hc: 40 },
      { weeks: 26, weight: 7800, length: 67, hc: 42 },
      { weeks: 40, weight: 8900, length: 72, hc: 44 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Sarah Mitchell',
      client_id_number: '9404154289082',
      partner_name: 'James Mitchell',
      baby_name: 'Oliver Mitchell',
      baby_dob: '2025-02-18',
      place_of_birth: 'Mediclinic Sandton',
      home_address: '31 Rivonia Boulevard, Sandton, 2146',
      contact_number: '0823456789',
      email: 'sarah.mitchell@icloud.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH3311822',
      main_member_name: 'James Mitchell',
      main_member_id: '8901014289081',
      weeks_gestation: 40.0,
      birth_weight_grams: 3820,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 1,
      num_children: 1,
    },
    ageMonths: 12,
    growth: [
      { weeks: 0, weight: 3820, length: 52, hc: 35 },
      { weeks: 6, weight: 5600, length: 58, hc: 38 },
      { weeks: 14, weight: 7200, length: 64, hc: 41 },
      { weeks: 26, weight: 8800, length: 69, hc: 43 },
      { weeks: 40, weight: 9800, length: 74, hc: 45 },
      { weeks: 52, weight: 10200, length: 76, hc: 46 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'varilrix'],
  },
  {
    patient: {
      client_name: 'Anele Zulu',
      client_id_number: '9701194589087',
      partner_name: 'Musa Zulu',
      baby_name: 'Simphiwe Zulu',
      baby_dob: '2024-12-01',
      place_of_birth: 'Netcare Union Hospital',
      home_address: '18 Jan Smuts Avenue, Parktown, 2193',
      contact_number: '0769012345',
      email: 'anele.zulu@webmail.co.za',
      medical_aid_name: 'Bonitas',
      medical_aid_number: 'BON4491029',
      main_member_name: 'Musa Zulu',
      main_member_id: '9403185589086',
      weeks_gestation: 38.0,
      birth_weight_grams: 3100,
      mode_of_delivery: 'Caesarean section',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 14,
    growth: [
      { weeks: 0, weight: 3100, length: 50, hc: 34 },
      { weeks: 6, weight: 4700, length: 55, hc: 37 },
      { weeks: 14, weight: 6400, length: 61, hc: 40 },
      { weeks: 26, weight: 8000, length: 67, hc: 42 },
      { weeks: 40, weight: 9200, length: 73, hc: 44 },
      { weeks: 52, weight: 10100, length: 77, hc: 46 },
      { weeks: 60, weight: 10800, length: 80, hc: 47 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'menactra'],
  },
  {
    patient: {
      client_name: 'Kavitha Pillay',
      client_id_number: '9002034289089',
      partner_name: 'Arun Pillay',
      baby_name: 'Kiran Pillay',
      baby_dob: '2024-09-14',
      place_of_birth: 'Mediclinic Morningside',
      home_address: '44 Witkoppen Road, Fourways, 2055',
      contact_number: '0832341234',
      email: 'kavitha.pillay@gmail.com',
      medical_aid_name: 'Momentum',
      medical_aid_number: 'MOM8821034',
      main_member_name: 'Arun Pillay',
      main_member_id: '8706024289088',
      weeks_gestation: 39.5,
      birth_weight_grams: 3550,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 17,
    growth: [
      { weeks: 0, weight: 3550, length: 51, hc: 35 },
      { weeks: 6, weight: 5200, length: 57, hc: 38 },
      { weeks: 14, weight: 6900, length: 63, hc: 41 },
      { weeks: 26, weight: 8400, length: 69, hc: 43 },
      { weeks: 40, weight: 9500, length: 74, hc: 45 },
      { weeks: 52, weight: 10400, length: 78, hc: 46 },
      { weeks: 68, weight: 11200, length: 82, hc: 47 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'varilrix', 'menactra'],
  },
  {
    patient: {
      client_name: 'Tandiwe Sithole',
      client_id_number: '9409264589081',
      partner_name: 'Bongani Sithole',
      baby_name: 'Amahle Sithole',
      baby_dob: '2024-06-22',
      place_of_birth: 'Sunninghill Hospital',
      home_address: '9 Kelvin Drive, Woodmead, 2191',
      contact_number: '0715671234',
      email: 'tandi.sithole@gmail.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH5521834',
      main_member_name: 'Bongani Sithole',
      main_member_id: '9101085689080',
      weeks_gestation: 40.0,
      birth_weight_grams: 3300,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 3,
      num_children: 3,
    },
    ageMonths: 20,
    growth: [
      { weeks: 0, weight: 3300, length: 50, hc: 34 },
      { weeks: 6, weight: 4900, length: 56, hc: 37 },
      { weeks: 14, weight: 6600, length: 62, hc: 40 },
      { weeks: 26, weight: 8100, length: 68, hc: 42 },
      { weeks: 40, weight: 9300, length: 73, hc: 44 },
      { weeks: 52, weight: 10200, length: 77, hc: 46 },
      { weeks: 78, weight: 11800, length: 84, hc: 47 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'varilrix', 'menactra', 'adacel'],
  },
  {
    patient: {
      client_name: 'Emma du Plessis',
      client_id_number: '9605014289083',
      partner_name: 'Deon du Plessis',
      baby_name: 'Liam du Plessis',
      baby_dob: '2024-03-10',
      place_of_birth: 'Life Fourways Hospital',
      home_address: '17 Cedar Road, Fourways, 2055',
      contact_number: '0827891234',
      email: 'emma.duplessis@gmail.com',
      medical_aid_name: 'Bonitas',
      medical_aid_number: 'BON5501234',
      main_member_name: 'Deon du Plessis',
      main_member_id: '9201014289082',
      weeks_gestation: 38.0,
      birth_weight_grams: 3420,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 23,
    growth: [
      { weeks: 0, weight: 3420, length: 51, hc: 35 },
      { weeks: 6, weight: 5000, length: 56, hc: 38 },
      { weeks: 14, weight: 6700, length: 62, hc: 41 },
      { weeks: 26, weight: 8200, length: 68, hc: 43 },
      { weeks: 40, weight: 9400, length: 73, hc: 45 },
      { weeks: 52, weight: 10500, length: 78, hc: 46 },
      { weeks: 78, weight: 12100, length: 84, hc: 48 },
      { weeks: 96, weight: 12900, length: 88, hc: 48 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'varilrix', 'menactra', 'adacel'],
  },
  {
    patient: {
      client_name: 'Thuli Ngcobo',
      client_id_number: '9811304589082',
      partner_name: 'Lungelo Ngcobo',
      baby_name: 'Siyanda Ngcobo',
      baby_dob: '2026-01-28',
      place_of_birth: 'Mediclinic Sandton',
      home_address: '3 Rosebank Road, Rosebank, 2196',
      contact_number: '0609871234',
      email: 'thuli.ngcobo@yahoo.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH8834521',
      main_member_name: 'Lungelo Ngcobo',
      main_member_id: '9605055489081',
      weeks_gestation: 39.0,
      birth_weight_grams: 3280,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 1,
      num_children: 1,
    },
    ageMonths: 0,
    growth: [
      { weeks: 0, weight: 3280, length: 49, hc: 34 },
      { weeks: 2, weight: 3150, length: 49, hc: 34 },
    ],
    vaccines: [],
  },
  {
    patient: {
      client_name: 'Ayesha Cassim',
      client_id_number: '9312204289085',
      partner_name: 'Imraan Cassim',
      baby_name: 'Idris Cassim',
      baby_dob: '2025-12-20',
      place_of_birth: 'Netcare Milpark',
      home_address: '27 Atholl Road, Craighall, 2024',
      contact_number: '0823339012',
      email: 'ayesha.cassim@gmail.com',
      medical_aid_name: 'Momentum',
      medical_aid_number: 'MOM3341082',
      main_member_name: 'Imraan Cassim',
      main_member_id: '8809064289084',
      weeks_gestation: 40.0,
      birth_weight_grams: 3700,
      mode_of_delivery: 'Caesarean section',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 2,
    growth: [
      { weeks: 0, weight: 3700, length: 52, hc: 35 },
      { weeks: 6, weight: 5400, length: 58, hc: 38 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Chantelle Botha',
      client_id_number: '9207174289087',
      partner_name: 'Kobus Botha',
      baby_name: 'Hannes Botha',
      baby_dob: '2025-06-15',
      place_of_birth: 'Morningside Clinic',
      home_address: '56 Rivonia Road, Bryanston, 2021',
      contact_number: '0835671234',
      email: 'chantelle.botha@gmail.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH6621031',
      main_member_name: 'Kobus Botha',
      main_member_id: '8901074289086',
      weeks_gestation: 39.5,
      birth_weight_grams: 4100,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 8,
    growth: [
      { weeks: 0, weight: 4100, length: 53, hc: 36 },
      { weeks: 6, weight: 5900, length: 59, hc: 39 },
      { weeks: 14, weight: 7800, length: 65, hc: 42 },
      { weeks: 26, weight: 9200, length: 70, hc: 44 },
      { weeks: 34, weight: 9900, length: 73, hc: 45 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Mpho Motsepe',
      client_id_number: '9504294589084',
      partner_name: 'Kgomotso Motsepe',
      baby_name: 'Botlhe Motsepe',
      baby_dob: '2025-10-05',
      place_of_birth: 'Sunninghill Hospital',
      home_address: '12 Witkoppen Extension, Paulshof, 2056',
      contact_number: '0716781234',
      email: 'mpho.motsepe@outlook.com',
      medical_aid_name: 'Bonitas',
      medical_aid_number: 'BON7721093',
      main_member_name: 'Kgomotso Motsepe',
      main_member_id: '9109135489083',
      weeks_gestation: 38.5,
      birth_weight_grams: 3150,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 3,
      num_children: 3,
    },
    ageMonths: 4,
    growth: [
      { weeks: 0, weight: 3150, length: 49, hc: 34 },
      { weeks: 6, weight: 4900, length: 55, hc: 37 },
      { weeks: 14, weight: 6500, length: 61, hc: 40 },
      { weeks: 18, weight: 7200, length: 63, hc: 41 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Naledi Mosia',
      client_id_number: '9608084589086',
      partner_name: 'Tebogo Mosia',
      baby_name: 'Koketso Mosia',
      baby_dob: '2025-08-30',
      place_of_birth: 'Netcare Union Hospital',
      home_address: '88 Jan Smuts Avenue, Parktown, 2193',
      contact_number: '0609121234',
      email: 'naledi.mosia@gmail.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH2219034',
      main_member_name: 'Tebogo Mosia',
      main_member_id: '9202155489085',
      weeks_gestation: 40.0,
      birth_weight_grams: 3380,
      mode_of_delivery: 'Caesarean section',
      num_pregnancies: 1,
      num_children: 1,
    },
    ageMonths: 6,
    growth: [
      { weeks: 0, weight: 3380, length: 50, hc: 34 },
      { weeks: 6, weight: 5100, length: 56, hc: 38 },
      { weeks: 14, weight: 6800, length: 62, hc: 40 },
      { weeks: 26, weight: 8300, length: 68, hc: 42 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13'],
  },
  {
    patient: {
      client_name: 'Roisin O\'Brien',
      client_id_number: '9003034289080',
      partner_name: 'Sean O\'Brien',
      baby_name: 'Aoife O\'Brien',
      baby_dob: '2024-11-18',
      place_of_birth: 'Mediclinic Sandton',
      home_address: '5 Melrose Arch, Melrose, 2196',
      contact_number: '0828901234',
      email: 'roisin.obrien@gmail.com',
      medical_aid_name: 'Momentum',
      medical_aid_number: 'MOM4421901',
      main_member_name: 'Sean O\'Brien',
      main_member_id: '8709034289079',
      weeks_gestation: 39.0,
      birth_weight_grams: 3250,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 15,
    growth: [
      { weeks: 0, weight: 3250, length: 50, hc: 34 },
      { weeks: 6, weight: 4800, length: 55, hc: 37 },
      { weeks: 14, weight: 6300, length: 61, hc: 40 },
      { weeks: 26, weight: 7900, length: 67, hc: 42 },
      { weeks: 40, weight: 9100, length: 72, hc: 44 },
      { weeks: 52, weight: 10200, length: 77, hc: 46 },
      { weeks: 60, weight: 10900, length: 80, hc: 47 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'menactra'],
  },
  {
    patient: {
      client_name: 'Zodwa Khoza',
      client_id_number: '9110164589083',
      partner_name: 'Bheki Khoza',
      baby_name: 'Nkosi Khoza',
      baby_dob: '2024-08-05',
      place_of_birth: 'Life Fourways Hospital',
      home_address: '33 Kelvin Drive, Sunninghill, 2157',
      contact_number: '0767451234',
      email: 'zodwa.khoza@yahoo.com',
      medical_aid_name: 'Bonitas',
      medical_aid_number: 'BON8801234',
      main_member_name: 'Bheki Khoza',
      main_member_id: '8806165489082',
      weeks_gestation: 38.0,
      birth_weight_grams: 3500,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 18,
    growth: [
      { weeks: 0, weight: 3500, length: 51, hc: 35 },
      { weeks: 6, weight: 5200, length: 57, hc: 38 },
      { weeks: 14, weight: 7000, length: 63, hc: 41 },
      { weeks: 26, weight: 8500, length: 69, hc: 43 },
      { weeks: 40, weight: 9700, length: 74, hc: 45 },
      { weeks: 52, weight: 10700, length: 79, hc: 46 },
      { weeks: 72, weight: 11900, length: 83, hc: 47 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'varilrix', 'menactra'],
  },
  {
    patient: {
      client_name: 'Yolanda Ferreira',
      client_id_number: '9301014289086',
      partner_name: 'Andre Ferreira',
      baby_name: 'Jacques Ferreira',
      baby_dob: '2024-05-02',
      place_of_birth: 'Morningside Clinic',
      home_address: '19 Dainfern Boulevard, Dainfern, 2191',
      contact_number: '0827341234',
      email: 'yolanda.ferreira@gmail.com',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH1129034',
      main_member_name: 'Andre Ferreira',
      main_member_id: '9012054289085',
      weeks_gestation: 40.0,
      birth_weight_grams: 3890,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 3,
      num_children: 3,
    },
    ageMonths: 21,
    growth: [
      { weeks: 0, weight: 3890, length: 53, hc: 36 },
      { weeks: 6, weight: 5700, length: 59, hc: 39 },
      { weeks: 14, weight: 7500, length: 65, hc: 42 },
      { weeks: 26, weight: 9000, length: 71, hc: 44 },
      { weeks: 40, weight: 10100, length: 76, hc: 46 },
      { weeks: 52, weight: 11200, length: 80, hc: 47 },
      { weeks: 84, weight: 12600, length: 86, hc: 48 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'varilrix', 'menactra'],
  },
  {
    patient: {
      client_name: 'Siya Mthembu',
      client_id_number: '9205134589080',
      partner_name: 'Nolwazi Mthembu',
      baby_name: 'Khanya Mthembu',
      baby_dob: '2026-02-01',
      place_of_birth: 'Netcare Milpark',
      home_address: '71 Commissioner Street, Kempton Park, 1619',
      contact_number: '0718231234',
      email: 'siya.mthembu@gmail.com',
      medical_aid_name: 'Bonitas',
      medical_aid_number: 'BON1190234',
      main_member_name: 'Siya Mthembu',
      main_member_id: '9205135489089',
      weeks_gestation: 38.5,
      birth_weight_grams: 3050,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 1,
      num_children: 1,
    },
    ageMonths: 0,
    growth: [
      { weeks: 0, weight: 3050, length: 49, hc: 33 },
    ],
    vaccines: [],
  },
  {
    patient: {
      client_name: 'Melissa Swanepoel',
      client_id_number: '9408074289084',
      partner_name: 'Petrus Swanepoel',
      baby_name: 'Anke Swanepoel',
      baby_dob: '2025-01-20',
      place_of_birth: 'Life Fourways Hospital',
      home_address: '23 Cedar Avenue, Sunninghill, 2157',
      contact_number: '0839561234',
      email: 'melissa.swanepoel@gmail.com',
      medical_aid_name: 'Momentum',
      medical_aid_number: 'MOM9931002',
      main_member_name: 'Petrus Swanepoel',
      main_member_id: '9104064289083',
      weeks_gestation: 39.0,
      birth_weight_grams: 3600,
      mode_of_delivery: 'Caesarean section',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 13,
    growth: [
      { weeks: 0, weight: 3600, length: 52, hc: 35 },
      { weeks: 6, weight: 5300, length: 57, hc: 38 },
      { weeks: 14, weight: 7000, length: 63, hc: 41 },
      { weeks: 26, weight: 8500, length: 69, hc: 43 },
      { weeks: 40, weight: 9600, length: 74, hc: 45 },
      { weeks: 52, weight: 10600, length: 78, hc: 46 },
      { weeks: 56, weight: 10900, length: 79, hc: 46 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix'],
  },
  {
    patient: {
      client_name: 'Phumzile Hadebe',
      client_id_number: '9507234589085',
      partner_name: 'Mthokozisi Hadebe',
      baby_name: 'Lungisa Hadebe',
      baby_dob: '2024-10-12',
      place_of_birth: 'Sunninghill Hospital',
      home_address: '6 Sandown Road, Sandton, 2146',
      contact_number: '0609451234',
      email: 'phumzile.hadebe@webmail.co.za',
      medical_aid_name: 'Discovery Health',
      medical_aid_number: 'DH7721034',
      main_member_name: 'Mthokozisi Hadebe',
      main_member_id: '9203235489084',
      weeks_gestation: 39.5,
      birth_weight_grams: 3350,
      mode_of_delivery: 'Normal vaginal delivery',
      num_pregnancies: 2,
      num_children: 2,
    },
    ageMonths: 16,
    growth: [
      { weeks: 0, weight: 3350, length: 50, hc: 34 },
      { weeks: 6, weight: 5000, length: 56, hc: 37 },
      { weeks: 14, weight: 6700, length: 62, hc: 40 },
      { weeks: 26, weight: 8200, length: 68, hc: 42 },
      { weeks: 40, weight: 9400, length: 73, hc: 44 },
      { weeks: 52, weight: 10400, length: 78, hc: 46 },
      { weeks: 64, weight: 11100, length: 81, hc: 47 },
    ],
    vaccines: ['hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'rotarix', 'prevenar13', 'hexaxim', 'prevenar13', 'priorix', 'menactra'],
  },
]

// Vaccination schedule mapping
const ageGroupForWeeks = (weeks) => {
  if (weeks === 0) return 'Birth'
  if (weeks === 6) return '6 Weeks'
  if (weeks === 10) return '10 Weeks'
  if (weeks === 14) return '14 Weeks'
  if (weeks <= 26) return '6 Months'
  if (weeks <= 40) return '9 Months'
  if (weeks <= 52) return '12 Months'
  if (weeks <= 68) return '15-18 Months'
  if (weeks <= 84) return '18 Months'
  return '2 Years'
}

const vaccineAgeGroups = {
  hexaxim: ['6 Weeks', '10 Weeks', '14 Weeks'],
  infanrix: ['6 Weeks', '10 Weeks', '14 Weeks'],
  rotarix: ['6 Weeks', '14 Weeks'],
  prevenar13: ['6 Weeks', '14 Weeks', '9 Months'],
  priorix: ['12 Months'],
  varilrix: ['15-18 Months'],
  menactra: ['12 Months'],
  tetraxim: ['18 Months'],
  omzyta: ['6 Weeks', '14 Weeks'],
  onvara: ['2 Years'],
  vaxigrip: ['6 Months'],
  avaxim: ['2 Years'],
  adacel: ['2 Years'],
}

const vaccineData = {
  hexaxim:    { name: 'Hexaxim',    nappi: '719637001', icd10: 'Z27.8', price: 75000, tariff: '88454' },
  infanrix:   { name: 'Infanrix Hexa', nappi: '707285001', icd10: 'Z27.8', price: 75000, tariff: '88454' },
  rotarix:    { name: 'Rotarix',    nappi: '714133001', icd10: 'Z25.8', price: 60000, tariff: '88454' },
  prevenar13: { name: 'Prevenar 13', nappi: '715858001', icd10: 'Z23.8', price: 113000, tariff: '88454' },
  priorix:    { name: 'Priorix',    nappi: '700772001', icd10: 'Z27.4', price: 60000, tariff: '88454' },
  varilrix:   { name: 'Varilrix',   nappi: '892939001', icd10: 'Z25.8', price: 66000, tariff: '88454' },
  menactra:   { name: 'Menactra',   nappi: '720708001', icd10: 'Z23.8', price: 95000, tariff: '88454' },
  tetraxim:   { name: 'Tetraxim',   nappi: '711258001', icd10: 'Z27.3', price: 46000, tariff: '88454' },
  omzyta:     { name: 'Omzyta',     nappi: '724016001', icd10: 'Z27.4', price: 52000, tariff: '88454' },
  onvara:     { name: 'Onvara',     nappi: '723131001', icd10: 'Z25.8', price: 66000, tariff: '88454' },
  vaxigrip:   { name: 'Vaxigrip Tetra', nappi: '3000826001', icd10: 'Z25.1', price: 15000, tariff: '88454' },
  avaxim:     { name: 'Avaxim 80', nappi: '700513001', icd10: 'Z24.6', price: 62000, tariff: '88454' },
  adacel:     { name: 'Adacel Quadra', nappi: null, icd10: 'Z27.3', price: 48000, tariff: '88454' },
}

async function post(url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`POST ${url} failed: ${JSON.stringify(json)}`)
  return json
}

async function main() {
  console.log(`Seeding ${patients.length} patients...\n`)
  let i = 1
  for (const { patient, growth, vaccines, ageMonths } of patients) {
    try {
      // Create patient
      const { patient: p } = await post('/api/patients', patient)
      const pid = p.id
      const dob = new Date(patient.baby_dob)

      // Add growth entries
      for (const g of growth) {
        const date = new Date(dob)
        date.setDate(date.getDate() + g.weeks * 7)
        const entryDate = date.toISOString().slice(0, 10)
        const ageWeeks = g.weeks
        const ageMonthsVal = Math.round(g.weeks / 4.33)
        await post(`/api/patients/${pid}/growth`, {
          measurement_date: entryDate,
          age_weeks: ageWeeks,
          age_months: ageMonthsVal,
          weight_grams: g.weight,
          length_cm: g.length,
          head_circumference_cm: g.hc,
        })
      }

      // Add vaccination records
      const vaccineCounts = {}
      for (const vKey of vaccines) {
        vaccineCounts[vKey] = (vaccineCounts[vKey] || 0) + 1
        const ageGroups = vaccineAgeGroups[vKey] || ['6 Weeks']
        const doseIndex = (vaccineCounts[vKey] - 1) % ageGroups.length
        const ageGroup = ageGroups[doseIndex]

        // Calculate approximate date for this age group
        const weekMap = {
          'Birth': 0, '6 Weeks': 6, '10 Weeks': 10, '14 Weeks': 14,
          '6 Months': 26, '9 Months': 39, '12 Months': 52,
          '15-18 Months': 68, '18 Months': 78, '2 Years': 104,
        }
        const weeksForAge = weekMap[ageGroup] || 6
        const vaxDate = new Date(dob)
        vaxDate.setDate(vaxDate.getDate() + weeksForAge * 7)
        const vd = vaxDate.toISOString().slice(0, 10)

        const vdata = vaccineData[vKey]
        const expiry = new Date(vaxDate)
        expiry.setFullYear(expiry.getFullYear() + 2)

        await post(`/api/patients/${pid}/vaccinations`, {
          vaccine_id: V[vKey],
          vaccine_name: vdata.name,
          age_group_label: ageGroup,
          administered_date: vd,
          batch_number: `LOT${Math.floor(10000 + Math.random() * 90000)}`,
          expiry_date: expiry.toISOString().slice(0, 10),
          site: ['Right thigh', 'Left thigh', 'Right arm', 'Left arm', 'Oral'][Math.floor(Math.random() * 5)],
          nappi_code: vdata.nappi,
          price_cents: vdata.price,
        })
      }

      console.log(`[${i++}/20] ✓ ${patient.client_name} — baby: ${patient.baby_name} (${growth.length} growth entries, ${vaccines.length} vaccines)`)
    } catch (err) {
      console.error(`[${i++}/20] ✗ ${patient.client_name}: ${err.message}`)
    }
  }
  console.log('\nDone!')
}

main()
