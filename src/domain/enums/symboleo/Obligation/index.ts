const events: { [key: string]: string } = {
  "Triggered": "Triggered",
  "oTRIGGERED": "Triggered obligation",
  "Activated": "Activated",
  "oACTIVATED": "Activated obligation",
  "Suspended": "Suspended",
  "oSUSPENDED": "Suspended obligation",
  "Resumed": "Resumed",
  "oRESUMED": "Resumed obligation",
  "Discharged": "Discharged",
  "oDISCHARGED": "Discharged obligation",
  "Expired": "Expired",
  "oEXPIRED": "Expired obligation",
  "Fulfilled": "Fulfilled",
  "oFULFILLED": "Fulfilled obligation",
  "Violated": "Violated",
  "oVIOLATED": "Violated obligation",
  "Terminated": "Terminated",
  "oTERMINATED": "Terminated obligation",
};
const states: { [key: string]: string } = {
  "Create": "Creation of",
  "oCREATE": "Creation of obligation",
  "Discharge": "Discharge of",
  "oDISCHARGE": "Discharge of obligation",
  "Active": "Activation of",
  "oACTIVE": "Activation of obligation",
  "InEffect": "Effectuation of",
  "oIN_EFFECT": "Effectuation of obligation",
  "Suspension": "Suspension of",
  "oSUSPENSION": "Suspension of obligation",
  "Violation": "Violation of",
  "oVIOLATION": "Violation of",
  "Fulfillment": "Fulfillment of",
  "oFULFILLMENT": "Fulfillment of obligation",
  "UnsuccessfulTermination": "Unsuccessful termination of",
  "oUNSUCESSFUL_TERMINATION": "Unsuccessful termination of obligation",
};

export { events, states };
