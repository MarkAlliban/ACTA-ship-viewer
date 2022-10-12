function selectFighters(formFighters) {
	const fighterBoxes=[...document.querySelectorAll('[id*="fighters-'+formFighters+'-"]')];
	const fighterCost=fighterBoxes.reduce((a,c) => a+parseInt(c.value)*parseInt(c.dataset.cost),0);
	const fighterList=fighterBoxes.reduce((a,c) => c.value==0 ? a : a+c.dataset.name+' ('+c.value+')<br>','');
	const fighterTotal=parseInt(document.querySelector('#fighter-swappable-'+formFighters).value)+parseInt(document.querySelector('#fighter-unswappable-'+formFighters).value);
	let output=fighterList+document.querySelector('#fighter-veryfixed-'+formFighters).value;
	if(fighterCost<fighterTotal) output+='<span class="fighters-warning noprint">Too few fighters!<br>You can assign '+(fighterTotal-fighterCost)+' more</span>';
	if(fighterCost>fighterTotal) output+='<span class="fighters-warning noprint">Too many fighters!<br>Please assign '+(fighterCost-fighterTotal)+' fewer</span>';
	if(output.endsWith('<br>')) output=output.slice(0,-4);
	document.querySelector('#fighter-text-'+formFighters).innerHTML=output;
	if(fighterCost===fighterTotal) document.getElementById('fighter-select-'+formFighters).classList.toggle('active');
}
function selectMissile(ShipID,Arc,WeaponID) {
	let currentText=document.getElementById('weapon-'+ShipID+'-'+Arc+'-'+WeaponID+'-name').innerText;
	const currentTraits=document.getElementById('weapon-'+ShipID+'-'+Arc+'-'+WeaponID+'-traits').innerText;
	const currentType=currentText.trim().endsWith(")") ? currentText.trim().substring(currentText.length-5) : '';
	currentText=currentText.substring(0,currentText.length-currentType.length-1);
	let newType='',newRange='',newTraits='';
	if(currentType==='') {newType='(F)'; newRange='20'; newTraits='AP/DD/P/';}
	if(currentType===' (F)') {newType='(H)'; newRange='10'; newTraits='TD/SAP/';}
	if(currentType===' (H)') {newType='(AF)'; newRange='15'; newTraits='';}
	if(currentType==='(AF)') {newType='(LR)'; newRange='40'; newTraits='AP/P/';}
	if(currentType==='(LR)') {newType='(MW)'; newRange='30'; newTraits='AP/P/';}
	if(currentType==='(MW)') {newType='(HA)'; newRange='15'; newTraits='SAP/';}
	if(currentType==='(HA)') {newType=''; newRange='30'; newTraits='P/SAP/';}
	if(currentTraits.indexOf('SL*')>-1) newTraits+='SL*'; else if(currentTraits.indexOf('SL')>-1) newTraits+='SL';
	if(newTraits.endsWith('/')) newTraits=newTraits.substring(0,newTraits.length-1);
	document.getElementById('weapon-'+ShipID+'-'+Arc+'-'+WeaponID+'-name').innerHTML=currentText+' '+newType+' <i class="noprint missile-swapicon fa-solid fa-sync-alt""></i>';
	document.getElementById('weapon-'+ShipID+'-'+Arc+'-'+WeaponID+'-range').innerHTML=newRange;
	document.getElementById('weapon-'+ShipID+'-'+Arc+'-'+WeaponID+'-traits').innerHTML=newTraits;
}
function shipAllowNaming() {
	document.querySelectorAll('.ship-name').forEach(el => {['keydown','paste'].forEach(action => {el.addEventListener(action,function(event) {
		if(this.innerText.length>25 && event.keyCode!=8 && event.keyCode!=46 && event.keyCode!=37 && event.keyCode!=39) event.preventDefault();
	})})});
	document.querySelectorAll('.ship-cq').forEach(el => {['keydown','paste'].forEach(action => {el.addEventListener(action,function(event) {
		if(event.keyCode===undefined) event.preventDefault();
		if(this.innerText.length>0 && event.keyCode!=8 && event.keyCode!=46 && event.keyCode!=37 && event.keyCode!=39) event.preventDefault();
	})})});
	document.querySelectorAll('.ship-close').forEach(el => {el.addEventListener('click',function(event) {
		document.getElementById('ShipSheet'+event.target.dataset.shipid).style.display='none';
	})});
}
window.onload=() => {
	shipAllowNaming();
};
