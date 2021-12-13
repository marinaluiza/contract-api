const events: { [key: string]: string } = {
  "Triggered": "Triggered",
  "pTRIGGERED": "Triggered power",
  "Activated": "Activated",
  "pACTIVATED": "Activated power",
  "Suspended": "Suspended",
  "pSUSPENDED": "Suspended power",
  "Resumed": "Resumed",
  "pRESUMED": "Resumed power",
  "Exerted": "Discharged",
  "pEXERTED": "Discharged power",
  "Expired": "Expired",
  "pEXPIRED": "Expired power",
  "Terminated": "Terminated",
  "pTERMINATED": "Terminated power",
};
const states: { [key: string]: string } = {
  "Create": "Creation of",
  "pCREATE": "Creation of power",
  "Active": "Activation of",
  "pACTIVE": "Activation of power",
  "InEffect": "Effectuation of",
  "pIN_EFFECT": "Effectuation of power",
  "Suspension": "Suspension of",
  "pSUSPENSION": "Suspension of power",
  "UnsuccessfulTermination": "Unsuccessful termination of",
  "pUNSUCESSFUL_TERMINATION": "Unsuccessful termination of power",
  "SuccessfulTermination": "Unsuccessful termination of",
  "pSUCESSFUL_TERMINATION": "Unsuccessful termination of power",
};

export { events, states };
