export interface MedicalCode {
  code: string;
  description: string;
}

// Top ~120 most commonly denied CPT codes (PA-relevant procedures)
export const CPT_CODES: MedicalCode[] = [
  // Infusions & injections
  { code: "96413", description: "Chemotherapy infusion, up to 1 hour" },
  { code: "96415", description: "Chemotherapy infusion, each additional hour" },
  { code: "96365", description: "IV infusion, therapy/prophylaxis, up to 1 hour" },
  { code: "96366", description: "IV infusion, each additional hour" },
  { code: "96401", description: "Chemotherapy injection, subcutaneous/intramuscular" },
  { code: "J0222", description: "Dupilumab (Dupixent) injection, 1mg" },
  { code: "J0490", description: "Belimumab injection" },
  { code: "J0717", description: "Certolizumab pegol injection, 1mg" },
  { code: "J0718", description: "Certolizumab pegol (Cimzia), 200mg" },
  { code: "J1745", description: "Infliximab (Remicade) injection, 10mg" },
  { code: "J0135", description: "Adalimumab (Humira) injection, 1mg" },
  { code: "J3490", description: "Semaglutide (Ozempic/Wegovy) injection" },
  { code: "J9271", description: "Pembrolizumab (Keytruda) injection, 1mg" },
  { code: "J9022", description: "Atezolizumab (Tecentriq) injection, 10mg" },
  { code: "J9173", description: "Docetaxel injection, 1mg" },
  { code: "J9310", description: "Rituximab injection, 100mg" },
  { code: "J9264", description: "Paclitaxel protein-bound (Abraxane), 1mg" },
  { code: "J9176", description: "Elotuzumab injection, 1mg" },
  { code: "J0178", description: "Aflibercept (Eylea) injection, 1mg" },
  { code: "J9355", description: "Trastuzumab (Herceptin) injection, 10mg" },
  // Imaging
  { code: "72148", description: "MRI lumbar spine without contrast" },
  { code: "72156", description: "MRI cervical spine without and with contrast" },
  { code: "72141", description: "MRI cervical spine without contrast" },
  { code: "72146", description: "MRI thoracic spine without contrast" },
  { code: "70553", description: "MRI brain without and with contrast" },
  { code: "70551", description: "MRI brain without contrast" },
  { code: "71250", description: "CT thorax without contrast" },
  { code: "71270", description: "CT thorax with and without contrast" },
  { code: "74177", description: "CT abdomen and pelvis with contrast" },
  { code: "74178", description: "CT abdomen and pelvis without and with contrast" },
  { code: "78816", description: "PET scan whole body" },
  { code: "78815", description: "PET scan skull to mid-thigh" },
  { code: "93306", description: "Echocardiography, transthoracic, with Doppler" },
  { code: "93000", description: "Electrocardiogram (ECG/EKG)" },
  { code: "93351", description: "Echocardiography, stress" },
  // Surgery & procedures
  { code: "43239", description: "Upper GI endoscopy with biopsy" },
  { code: "45378", description: "Colonoscopy, diagnostic" },
  { code: "45385", description: "Colonoscopy with polypectomy" },
  { code: "27447", description: "Total knee arthroplasty" },
  { code: "27130", description: "Total hip arthroplasty" },
  { code: "63047", description: "Laminectomy, lumbar" },
  { code: "22551", description: "Cervical spine fusion, anterior" },
  { code: "23472", description: "Total shoulder arthroplasty" },
  { code: "49505", description: "Inguinal hernia repair" },
  { code: "47562", description: "Laparoscopic cholecystectomy" },
  { code: "58661", description: "Laparoscopic removal of adnexal structures" },
  { code: "55866", description: "Laparoscopic prostatectomy" },
  { code: "43280", description: "Laparoscopic fundoplication (GERD)" },
  { code: "43770", description: "Laparoscopic gastric banding" },
  { code: "43775", description: "Sleeve gastrectomy" },
  // Therapy
  { code: "97110", description: "Therapeutic exercises, 15 minutes" },
  { code: "97530", description: "Therapeutic activities, 15 minutes" },
  { code: "97001", description: "Physical therapy evaluation" },
  { code: "97165", description: "Occupational therapy evaluation, low complexity" },
  { code: "90837", description: "Psychotherapy, 60 minutes" },
  { code: "90834", description: "Psychotherapy, 45 minutes" },
  { code: "90853", description: "Group psychotherapy" },
  { code: "90791", description: "Psychiatric diagnostic evaluation" },
  // Durable medical equipment & devices
  { code: "E0601", description: "CPAP device" },
  { code: "E0607", description: "CPAP, home sleep test" },
  { code: "A4253", description: "Blood glucose test strips, per 50" },
  { code: "K0001", description: "Standard manual wheelchair" },
  { code: "K0005", description: "Ultralightweight wheelchair" },
  { code: "E1399", description: "Durable medical equipment, miscellaneous" },
  // Cardiology
  { code: "93452", description: "Left heart catheterization" },
  { code: "92928", description: "Percutaneous coronary stenting" },
  { code: "33249", description: "Implantable defibrillator insertion" },
  { code: "33208", description: "Pacemaker insertion" },
  // Genetic & lab
  { code: "81479", description: "Unlisted molecular pathology procedure" },
  { code: "88304", description: "Surgical pathology, Level III" },
  { code: "88307", description: "Surgical pathology, Level V" },
  { code: "86235", description: "Nuclear antigen antibody (ANA)" },
  { code: "84484", description: "Troponin, quantitative" },
  // Sleep
  { code: "95810", description: "Polysomnography (sleep study), attended" },
  { code: "95811", description: "Polysomnography with CPAP titration" },
  // Radiation
  { code: "77301", description: "Intensity modulated radiation therapy (IMRT) plan" },
  { code: "77385", description: "Intensity modulated radiation treatment, simple" },
  { code: "77386", description: "Intensity modulated radiation treatment, complex" },
  // Neurology
  { code: "95819", description: "EEG, awake and asleep" },
  { code: "95920", description: "Intraoperative neurophysiology testing" },
  { code: "64483", description: "Epidural steroid injection, lumbar" },
  { code: "64493", description: "Paravertebral facet joint injection" },
  // Vision / ophthalmic
  { code: "67028", description: "Intravitreal injection" },
  { code: "92025", description: "Corneal topography" },
  { code: "66984", description: "Cataract removal with lens implant" },
  // Dental / oral surgery
  { code: "41899", description: "Unlisted procedure, dentoalveolar structures" },
  // Allergy
  { code: "95165", description: "Allergen immunotherapy, per dose" },
  { code: "95117", description: "Allergen immunotherapy injections" },
];
