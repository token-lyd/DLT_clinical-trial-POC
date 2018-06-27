var factory = getFactory();
var namespace = 'org.acme.ClinicalTrial';

/**
 * PhaseOneTrail transaction processor function.
 * @param {org.acme.ClinicalTrial.PhaseOneTrail} tx The phase one clinical trial transaction instance.
 * @transaction
 */

 async function PhaseOneTrail(tx) {
 	if(tx.drug.isApproved == false || tx.drug.isRegistered == false) {
 		throw new Error("This drug is neither registered or approved.");
 	}

 	const phaseone = factory.newConcept(namespace, 'PhaseOne');
 	phaseone.startdate = tx.startdate;
 	phaseone.enddate = tx.enddate;
 	phaseone.volunteers = tx.volunteers;
 	phaseone.purpose = tx.purpose;
 	phaseone.dosage = tx.dosage;

 	tx.drug.p1 = phaseone;

 	let assetRegistry = await getAssetRegistry('org.acme.ClinicalTrial.Drug');
    await assetRegistry.update(tx.drug);
 }

 /**
 * PhaseTwoTrail transaction processor function.
 * @param {org.acme.ClinicalTrial.PhaseTwoTrail} tx The phase two clinical trial transaction instance.
 * @transaction
 */

 async function PhaseTwoTrail(tx) {
 	if(tx.drug.p1.isSuccess == false) {
 		throw new Error("Phase one of clinical trial is unsuccessful. Could not proceed to phase two. Please check with your Investigator.");
 	}

 	const phasetwo = factory.newConcept(namespace, 'PhaseTwo');
 	phasetwo.startdate = tx.startdate;
 	phasetwo.enddate = tx.enddate;
 	phasetwo.volunteers = tx.volunteers;
 	phasetwo.purpose = tx.purpose;
 	phasetwo.dosage = tx.dosage;

 	tx.drug.p2 = phasetwo;

 	let assetRegistry = await getAssetRegistry(namespace + '.Drug');
    await assetRegistry.update(tx.drug);
 }

 /**
 * PhaseThreeTrail transaction processor function.
 * @param {org.acme.ClinicalTrial.PhaseThreeTrail} tx The phase three clinical trial transaction instance.
 * @transaction
 */

 async function PhaseThreeTrail(tx) {
 	if(tx.drug.p2.isSuccess == false) {
 		throw new Error("Phase two of clinical trial is unsuccessful. Please check with your Investigator.");
 	}

 	const phasethree = factory.newConcept(namespace, 'PhaseThree');
 	phasethree.startdate = tx.startdate;
 	phasethree.enddate = tx.enddate;
 	phasethree.volunteers = tx.volunteers;
 	phasethree.purpose = tx.purpose;
 	phasethree.dosage = tx.dosage;

 	tx.drug.p3 = phasethree;

 	let assetRegistry = await getAssetRegistry(namespace + '.Drug');
    await assetRegistry.update(tx.drug);
 }

 /**
 * SetupDemo transaction processor function.
 * @param {org.acme.ClinicalTrial.SetupDemo} tx.
 * @transaction
 */

 async function SetupDemo(tx) {
 	// create a company
 	var company = factory.newResource(namespace, 'Company', 'c1');
  	company.companyName = 'XYZ pharma';
  	company.companyDescription = 'test description';
  	company.companyAddress = 'street 1, Delhi';
  	company.manufacturingFacilitiesAddress = 'street 1, Delhi';
  	company.regulatoryStatus = 'reg status number';
  	company.intellectualStatus = 'int patent number';
  	company.patentInformation = 'test patent information';
  	let companyRegistry = await getParticipantRegistry(namespace + '.Company');
  	await companyRegistry.add(company);

  	// add a investigator
  	var investigator = factory.newResource(namespace, 'Investigator', 'i1');
  	investigator.firstName = 'Mike';
  	investigator.lastName = 'Halloway';
  	investigator.age = 40;
  	let investigatorRegistry = await getParticipantRegistry(namespace + '.Investigator');
  	await investigatorRegistry.add(investigator);

  	// add volunteers
  	var people = ['Paul', 'Andy', 'Hannah', 'Sam', 'Caroline', 'Matt', 'Fenglian', 'Mark', 'James', 'Dave', 'Rob', 'Kai', 'Ellis', 'LesleyAnn'];
  	people = people.map((person, index) => {
  		let v = factory.newResource(namespace, 'Volunteer', `v${index}`);
  		v.firstName = person;
  		v.lastName = person;
  		v.age = 30
  		v.consentGiven = true;
  		v.diseaseSufferingFrom = 'test disease 1, test disease 2, test disease 3';

  		return v;
  	});
  	let volunteerRegistry = await getParticipantRegistry(namespace + '.Volunteer');
  	await volunteerRegistry.addAll(people);

  	// create a drug
  	var drug = factory.newResource(namespace, 'Drug', 'drug1');
  	drug.companyId = factory.newRelationship(namespace, 'Company', 'c1');
  	drug.investigator = factory.newRelationship(namespace, 'Investigator', 'i1');
  	drug.drugName = "test drug name";
  	drug.drugDescription = "test description";
  	drug.productDevelopment = "121212";
  	drug.strainDetails = "strain1234";
  	drug.drugSubstance = "substance121212";
  	drug.drugProduct = "product33255";
  	drug.isApproved = true; // if set to false, the phase tx will fail
  	drug.isRegistered = true; // if set to false, the phase tx will fail
  	let protocol = factory.newConcept(namespace, 'Protocol');
  	protocol.protocolDescription = "protocol description goes here. test description.";
  	protocol.data = "document link goes here";
  	drug.protocol = protocol;
  	let p1 = factory.newConcept(namespace, 'PhaseOne');
  	p1.startdate = new Date();
 	p1.enddate = new Date();
 	p1.volunteers = [];
 	p1.purpose = "purpose of phase 1 goes here."
 	drug.p1 = p1;
 	
  	let p2 = factory.newConcept(namespace, 'PhaseTwo');
  	p2.startdate = new Date();
 	p2.enddate = new Date();
 	p2.volunteers = [];
 	p2.purpose = "purpose of phase 2 goes here."
 	drug.p2 = p2;

  	let p3 = factory.newConcept(namespace, 'PhaseThree');
  	p3.startdate = new Date();
 	p3.enddate = new Date();
 	p3.volunteers = [];
 	p3.purpose = "purpose of phase 3 goes here."
 	drug.p3 = p3;

  	let assetRegistry = await getAssetRegistry(namespace + '.Drug');
    await assetRegistry.add(drug);
 }