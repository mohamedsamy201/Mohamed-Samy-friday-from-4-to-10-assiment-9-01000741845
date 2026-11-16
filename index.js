var cnameInput = document.getElementById("fullName");
var cphoneInput = document.getElementById("phone");
var cemailInput = document.getElementById("email");
var caddressInput = document.getElementById("address");
var cgroubInput = document.getElementById("group");
var cnotesInput = document.getElementById("notes");
var cfavoriteInput = document.getElementById("favorite");
var cemergencyInput = document.getElementById("emergency");
var cancel = document.getElementById("Cancel");
var html = document.getElementById("html");
var htmlSide= document.getElementById('htmlSide')
var secHtmlSideId =document.getElementById('secHtmlSideId')
var emptyState = document.getElementById("empty");
var searchInput = document.getElementById("sInput");
var openModal = document.getElementById('modal')
var edit = document.getElementById('noSaving')
var Varuppdate = document.getElementById('try')
var nofav= document.getElementById('nofav')
var noEmergency = document.getElementById('noEmergency') 
var totalCount= document.getElementById('totalCount')
var favCount = document.getElementById('favCount')
var emgCount = document.getElementById('emgCount')


var idToBeUpdated = null;

var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
display();

function closeModle() {
  cancel.click();
}


function addcontact() {
  var contact = {
    id: Date.now(), 
    name: cnameInput.value,
    phone: cphoneInput.value,
    email: cemailInput.value,
    address: caddressInput.value,
    groub: cgroubInput.value,
    notes: cnotesInput.value,
    isfav: cfavoriteInput.checked,
    isemrgency: cemergencyInput.checked
  };
  if (/^[\u0600-\u06FFa-zA-Z\s]{3,50}$/gm.test(contact.name)){
    cnameInput.classList.remove('is-invalid')
  }else{
    cnameInput.classList.add('is-invalid')
    return
  }
  if ( /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contact.email) ){
    cemailInput.classList.remove('is-invalid')
  }else{
    cemailInput.classList.add('is-invalid')
    return
  }
  if(/^(?:\+20|0020|0)?1[0125]\d{8}$/.test(contact.phone)){
     cphoneInput.classList.remove('is-invalid')
  }else{
    cphoneInput.classList.add('is-invalid')
    return
  }
   if (/^[\u0600-\u06FFa-zA-Z\s]{3,50}$/gm.test(contact.address)){
     caddressInput.classList.remove('is-invalid')
  }else{
    caddressInput.classList.add('is-invalid')
    return
   
  }
  if (contact.groub == ''){
    return
  }


  contacts.push(contact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  closeModle();
  display();
  clear();
  Swal.fire({
  title: "Success",
  text: `contact with ${contact.name} added successfully `,
  icon: "success"
});
}

function display(contactsList = contacts) {
  totalCount.innerHTML = contactsList.length;
  var favCounter = 0;
  var emergencyCounter = 0;
  
  for(var i = 0; i < contactsList.length; i++){
    if(contactsList[i].isfav){
      favCounter++;
    }
    if(contactsList[i].isemrgency){
      emergencyCounter++;
    }
  }
  
  favCount.innerHTML = favCounter;
  emgCount.innerHTML = emergencyCounter;

  var showList = contactsList.map(function (contact) {
    return ` <article class="contact-card">
    <div class="contact-top">
      <div class="contact-avatar">
       ${contact.name.trim().split(' ').slice(0,2).map(function(word){
        return word[0] ? word[0].toUpperCase() : ''
       }).join('')}
        ${contact.isfav == true ? `<span class="fav-badge"><i class="bi bi-star-fill"></i></span>` : ""}
        ${contact.isemrgency == true ? `<span class="emergncy-badge"><i class="bi bi-heart-pulse-fill"></i></span>` : ""}
      </div>

      <div class="contact-main">
        <h3 class="contact-name">${contact.name}</h3>
        <div class="info-row">
          <span class="info-icon ic-phone"><i class="bi bi-telephone-fill"></i></span>
          <span>${contact.phone}</span>
        </div>
      </div>
    </div>

    <div class="info-row">
      <span class="info-icon ic-mail"><i class="bi bi-envelope-fill"></i></span>
      <span>${contact.email}</span>
    </div>

    <div class="info-row">
      <span class="info-icon ic-place"><i class="bi bi-geo-alt-fill"></i></span>
      <span>${contact.address}</span>
    </div>

    <span class="group-tag">${contact.groub}</span>
    ${contact.isemrgency == true ? `<span class="test"><i class="bi bi-heart-pulse-fill"></i> Emergncy </span>` : ""}
    
    <div class="contact-actions">
      <div class="d-flex gap-2">
        <a href="tel:${contact.phone}" class="action-btn act-call" aria-label="Call"><i class="bi bi-telephone-fill"></i></a>
        <a href="mailto:${contact.email}" class="action-btn act-mail" aria-label="Email"><i class="bi bi-envelope-fill"></i></a>
      </div>

      <div class="d-flex gap-2">
        <!-- تمرير الـ id بدل الـ index -->
        <button type="button" class="action-btn act-star ${contact.isfav ? 'active' : ''}" aria-label="Favorite" onclick="toggleFav(${contact.id})"><i class="bi bi-star-fill"></i></button>
        <button type="button" class="action-btn act-heart" onclick="toggleEmrgency(${contact.id})" aria-label="Emergency"><i class="bi bi-heart"></i></button>
        <button type="button" class="action-btn act-edit" onclick="OpeneditModal(${contact.id})" aria-label="Edit"><i class="bi bi-pencil-fill"></i></button>
        <button type="button" class="action-btn act-delete" onclick="deleteContact(${contact.id})" aria-label="Delete"><i class="bi bi-trash3-fill"></i></button>
      </div>
    </div>
  </article>`;
  }).join("");

  html.innerHTML = showList;

  
  var hasFav = contactsList.some(function(contact) {
    return contact.isfav == true;
  });

  if (nofav) {
    if (hasFav) {
      nofav.classList.add("d-none");    
    } else {
      nofav.classList.remove("d-none");
    }
  }

  var sideShowList = contactsList.map(function (contact) {
    return `${contact.isfav == true ? `
      <div class="contact-top-side justify-content-between mx-auto my-2 p-2">
        <div class="d-flex gap-3"> 
          <div class="contact-avatar-side">
           ${contact.name.trim().split(' ').slice(0,2).map(function(word){
             return word[0] ? word[0].toUpperCase() : ''
           }).join('')}
          </div>
          <div class="contact-main">
            <h3 class="contact-name-side">${contact.name}</h3>
            <div>
              <span class="fs-6 text-secondary">${contact.phone}</span>
            </div>
          </div>
        </div>
        <span class="info-icon ic-place"><i class="bi bi-telephone-fill"></i></span>
      </div>` : ``}`;
  }).join("");
  
  if (htmlSide) htmlSide.innerHTML = sideShowList;

  var hasEmergncy = contactsList.some(function(contact) {
    return contact.isemrgency == true;
  });

 
    if (hasEmergncy) {
      noEmergency.classList.add("d-none");    
    } else {
      noEmergency.classList.remove("d-none");
    }
  

  var secSideShowList = contactsList.map(function (contact) {
    return `${contact.isemrgency == true ? `
      <div class="contact-top-side justify-content-between my-2 mx-auto p-2">
        <div class="d-flex gap-3"> 
          <div class="contact-avatar-side">
           ${contact.name.trim().split(' ').slice(0,2).map(function(word){
             return word[0] ? word[0].toUpperCase() : ''
           }).join('')}
          </div>
          <div class="contact-main">
            <h3 class="contact-name-side">${contact.name}</h3>
            <div>
              <span class="fs-6 text-secondary">${contact.phone}</span>
            </div>
          </div>
        </div>
        <span class="info-icon ic-place"><i class="bi bi-telephone-fill"></i></span>
      </div>` : ``}`;
  }).join("");
  
  if (secHtmlSideId) secHtmlSideId.innerHTML = secSideShowList;

  if (contactsList.length == 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }
}


function toggleFav(id) {
  var contact = contacts.find(function(c) { return c.id === id; });
  
    contact.isfav = !contact.isfav;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    display();
  
}

function toggleEmrgency(id) {
  var contact = contacts.find(function(c) { return c.id === id; });
  
    contact.isemrgency = !contact.isemrgency;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    display();
  
}


function deleteContact(id) {
  var index = contacts.findIndex(function(c) { return c.id === id; });
  
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    display();
  
}

function search() {
  var data = searchInput.value;
  var result = [];
  for (var i = 0; i < contacts.length; i++) {
    if (
      contacts[i].name.toLowerCase().includes(data.toLowerCase()) ||
      contacts[i].phone.toLowerCase().includes(data.toLowerCase()) ||
      contacts[i].email.toLowerCase().includes(data.toLowerCase())
    ) {
      result.push(contacts[i]);
    }
  }
  display(result);
}

function clear(){
  cnameInput.value = '';
  cphoneInput.value = '';
  cemailInput.value = '';
  caddressInput.value = '';
  cgroubInput.value = '';
  cnotesInput.value = '';
  cfavoriteInput.checked = false;
  cemergencyInput.checked = false;
}
function OpeneditModal(id){
  var contact = contacts.find(function(c) { return c.id === id; });
  if (!contact) return;

  idToBeUpdated = id; 
  openModal.click();
  
  cnameInput.value = contact.name;
  cphoneInput.value = contact.phone;
  cemailInput.value = contact.email;
  caddressInput.value = contact.address;
  cgroubInput.value = contact.groub;
  cnotesInput.value = contact.notes;
  cfavoriteInput.checked = contact.isfav;
  cemergencyInput.checked = contact.isemrgency;
  
  edit.classList.add('d-none');
  Varuppdate.classList.remove('d-none');
}

function uppdate(){
  var index = contacts.findIndex(function(c) { return c.id === idToBeUpdated; });
  
 
    contacts[index].name = cnameInput.value;
    contacts[index].phone = cphoneInput.value;
    contacts[index].email = cemailInput.value;
    contacts[index].address = caddressInput.value;
    contacts[index].groub = cgroubInput.value;
    contacts[index].notes = cnotesInput.value;
    contacts[index].isfav = cfavoriteInput.checked;
    contacts[index].isemrgency = cemergencyInput.checked;

    localStorage.setItem('contacts', JSON.stringify(contacts));
    closeModle();
    display();
    clear();
  
}