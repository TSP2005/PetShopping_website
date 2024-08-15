
var Email;
var Password;
var login = false;

const imagecontainer=document.getElementById("pet_images");
const loadinganimation=document.createElement('div');
loadinganimation.className="content";

const circle1=document.createElement('div');
circle1.className="circle";
loadinganimation.appendChild(circle1);

const circle2=document.createElement('div');
circle2.className="circle";
loadinganimation.appendChild(circle2);

const circle3=document.createElement('div');
circle3.className="circle";
loadinganimation.appendChild(circle3);

const circle4=document.createElement('div');
circle4.className="circle";
loadinganimation.appendChild(circle4);

imagecontainer.appendChild(loadinganimation);




// Initial fetch to get pet images
fetch('/initial_images', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({})
})
    .then(response => response.json())
    .then(data => {
        loadinganimation.remove();
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            const receivedData = data.data;
            processData(receivedData);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });


   
function processData(data) {
    const petsImagesContainer = document.getElementById('pet_images');
    petsImagesContainer.innerHTML = "";
    const pet_result = document.getElementById('cart_items');
    pet_result.innerHTML = "";
    const totalCostView = document.getElementById('total_cost_view');
    totalCostView.innerHTML = "";
    for (const item of data) {
        const petResult = document.createElement('div');
        petResult.className = 'pets_result';

        const petImage = document.createElement('img');
        petImage.src =`static/images/${item[0]}.jpeg`; 
        console.log(petImage.src);// Decode base64-encoded pet_pic
        petImage.className = 'result_images';
        petImage.id = item[3]; // Assuming the pet ID is at index 3
        petResult.appendChild(petImage);

        const petName = document.createElement('p');
        petName.textContent = item[0]; // pet_name
        petName.className = 'result_pet_name';
        petName.id = `${item[3]}`; // Assuming the pet ID is at index 3
        petResult.appendChild(petName);

        const petCost = document.createElement('p');
        petCost.textContent = `MRP ${item[1]}`; // pet_cost
        petCost.className = 'result_pet_cost';
        petCost.id = item[3]; // Assuming the pet ID is at index 3
        petResult.appendChild(petCost);

        const buttons = document.createElement('div');
        buttons.className = 'addingbuttons';
        const adoptButton = document.createElement('button');
        adoptButton.textContent = 'Adopt Pet';
        adoptButton.className = 'pet_adopt_button';
        adoptButton.onclick = () => handlePetAdoption(item[3],item[0],item[1]); // Assuming the pet ID is at index 3
        buttons.appendChild(adoptButton);

        const addCart = document.createElement('button');
        addCart.innerHTML = 'cart';
        addCart.className = 'pet_adopt_button';
        addCart.id = `add_cart_${item[3]}`;
        addCart.onclick = () => addToCart(item[3]);
        buttons.appendChild(addCart);

        const addWhistlist = document.createElement('button');
        addWhistlist.innerHTML = 'whistlist';
        addWhistlist.className = 'pet_adopt_button';
        addWhistlist.id=`add_whistlist_${item[3]}`;
        addWhistlist.onclick = () => addToWhistlist(item[3],item[0],item[1]);
        buttons.appendChild(addWhistlist);
        petResult.appendChild(buttons);

        petsImagesContainer.appendChild(petResult);
    }
}



function addToCart(petId) {
    const email = Email;
    if (login) {
        fetch('/addtocart', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, petId })
        })
            .then(response => response.json())
            .then(status => {
                if (status.status === "success") {
                    document.getElementById(`add_cart_${petId}`).innerHTML = '<i class="fa-solid fa-check"></i>';
                    document.getElementById(`add_cart_${petId}`).className="added_cart";
                    
                } else {
                    window.alert("Error while adding to cart. Please try again later.");
                }
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        window.alert("Please sign in first");
    }
}


function addToWhistlist(petId) {
    const email = Email;
    if (login) {
      fetch('/addtowhistlist', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, petId })
      })
      .then(response => response.json())
      .then(status => {
        if (status.status === "success") {
          document.getElementById(`add_whistlist_${petId}`).innerHTML = '<i class="fa-solid fa-check"></i>';
          document.getElementById(`add_whistlist_${petId}`).className = "added_cart";
        } else {
          window.alert("Error while adding to wishlist. Please try again later.");
        }
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      window.alert("Please sign in first");
    }
  }

  function handlePetAdoption(petId, petname, petcost) {
    // Clear existing content
    const imageContainer = document.getElementById("pet_images");
    imageContainer.innerHTML = "";
    const cartItems = document.getElementById("cart_items");
    cartItems.innerHTML = "";
    const userOptions = document.getElementById("user_choices");
    userOptions.innerHTML = "";

    // Create a total data container
    const totaldata = document.createElement('div');
    totaldata.className = 'total_data_container';

    // Create adoption data container
    const adoptData = document.createElement('div');
    adoptData.id = 'adopt_pet_container';

    // Pet data container
    const petdata = document.createElement('div');
    petdata.className = "product-details";

    const pettitle = document.createElement('h1');
    pettitle.className = "productpettitle";
    pettitle.textContent = petname;
    petdata.appendChild(pettitle);

    const resultpetsData = document.createElement('div');
    resultpetsData.className = 'result_pet_data';
    resultpetsData.id = 'same_result_pet_data';

    // Fetch pet details
    fetch('/get_pet_details', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ petId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
            // Handle the error case appropriately
        } else {
            const receivedData = data.data;

            // Pet name
            const adoptPetName = document.createElement('p');
            adoptPetName.textContent = `petname: ${receivedData[0][2]}`;
            adoptPetName.className = "information";
            petdata.appendChild(adoptPetName);

            // Pet details
            const adoptPetDetails = document.createElement('p');
            adoptPetDetails.textContent = `Details: ${receivedData[0][0]}`;
            adoptPetDetails.className = "information";
            petdata.appendChild(adoptPetDetails);

            // Pet age
            const adoptPetAge = document.createElement('p');
            adoptPetAge.textContent = `Age : ${receivedData[0][1]} years`;
            adoptPetAge.className = "information";
            petdata.appendChild(adoptPetAge);
        }
    })
    .catch(error => {
        console.error(error);
        // Handle the error case appropriately
    });

    const options = document.createElement('div');
    options.className = 'control';

    const button = document.createElement('button');
    button.className = "btn";
    button.innerHTML = `<span class="price">${petcost}</span>
    <span class="shopping-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>
    <span class="buy">Get now</span>`;
    button.onclick=()=>location_selector(petId);
    options.appendChild(button);
    petdata.appendChild(options);
    adoptData.appendChild(petdata);

    const imagebox = document.createElement('div');
    imagebox.className = "product-image";

    const adoptPetImage = document.createElement("img");
    adoptPetImage.src = `static/images/${petname}.jpeg`;
    //adoptPetImage.className = '';
    imagebox.appendChild(adoptPetImage);

    const petdescription = document.createElement("div");
    petdescription.className = "info";

    const petdescriptiontitle = document.createElement('h2');
    petdescriptiontitle.className = "petdescriptiontitle";
    petdescriptiontitle.textContent = "Description";
    petdescription.appendChild(petdescriptiontitle);

    const descriptionitems = document.createElement('ul');
    descriptionitems.className = "descriptionitems";
    descriptionitems.innerHTML = `<li><strong>PetBreed : </strong>${petname}</li>
    <li><strong>Petcost : </strong>MRP ${petcost}</li>
    <li><strong>Petid: </strong>MRP ${petId}</li>`;
    petdescription.appendChild(descriptionitems);
    imagebox.appendChild(petdescription);

    adoptData.appendChild(imagebox);

    const petName = petname;
    fetch('/get_result_images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            const resultData = data.data;
            const petImageContainer = document.getElementById('same_result_pet_data');

            for (const item of resultData) {
                const petResult = document.createElement('div');
                petResult.className = 'pets_result';

                const petImage = document.createElement('img');
                petImage.src = `static/images/${item[0]}.jpeg`;
                petImage.className = 'result_images';
                petImage.id = item[3]; // Assuming the pet ID is at index 3
                petResult.appendChild(petImage);

                const petNameElement = document.createElement('p');
                petNameElement.textContent = item[0]; // pet_name
                petNameElement.className = 'result_pet_name';
                petNameElement.id = `${item[3]}`; // Assuming the pet ID is at index 3
                petResult.appendChild(petNameElement);

                const petCostElement = document.createElement('p');
                petCostElement.textContent = `MRP ${item[1]}`; // pet_cost
                petCostElement.className = 'result_pet_cost';
                petCostElement.id = item[3]; // Assuming the pet ID is at index 3
                petResult.appendChild(petCostElement);

                const buttons = document.createElement('div');
                buttons.className = 'addingbuttons';

                const adoptButton = document.createElement('button');
                adoptButton.textContent = 'Adopt Pet';
                adoptButton.className = 'pet_adopt_button';
                adoptButton.onclick = () => handlePetAdoption(item[3], item[0], item[1]); // Assuming the pet ID is at index 3
                buttons.appendChild(adoptButton);

                const addCart = document.createElement('button');
                addCart.innerHTML = 'cart';
                addCart.className = 'pet_adopt_button';
                addCart.id = `add_cart_${item[3]}`;
                addCart.onclick = () => addToCart(item[3]);
                buttons.appendChild(addCart);

                const addWhistlist = document.createElement('button');
                addWhistlist.innerHTML = 'whistlist';
                addWhistlist.className = 'pet_adopt_button';
                addWhistlist.id = `add_whistlist_${item[3]}`;
                addWhistlist.onclick = () => addToWhistlist(item[3], item[0], item[1]);
                buttons.appendChild(addWhistlist);

                petResult.appendChild(buttons);
                resultpetsData.appendChild(petResult);
            }
        }
    })
    .catch(error => {
        console.log(error);
    });

    // Create final buy button
    /*const finalBuyButton = document.createElement('button');
    finalBuyButton.textContent = 'Buy Now';
    finalBuyButton.className = 'btn';
    finalBuyButton.onclick = () => location_selector(petId); // Assuming this function exists to handle the final purchase
    adoptData.appendChild(finalBuyButton);*/

    // Append adoption data and result data to total data container
    totaldata.appendChild(adoptData);
    totaldata.appendChild(resultpetsData);

    // Append total data container to image container
    imageContainer.appendChild(totaldata);
}

  
  function handleFinalPurchase(locationId, petId, transactionId, paymentmode) {
    const petResult = document.getElementById('pet_images');
    petResult.innerHTML = "";
    const cartdata = document.getElementById('cart_items');
    cartdata.innerHTML = "";
    const totaldata = document.getElementById('total_cost_view');
    totaldata.innerHTML = "";
  
    const loadingAnimation = document.createElement('div');
    loadingAnimation.className = 'loading-animation';
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    loadingAnimation.appendChild(spinner);
    petResult.appendChild(loadingAnimation);
  
    fetch('/place_order', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ locationId, petId, transactionId, paymentmode ,Email})
    })
    .then(response => response.json())
    .then(status => {
      loadingAnimation.remove();
      if (status.status == "sucess") {
        const successAnimation = document.createElement('div');
        successAnimation.className = 'success-animation';
        const checkmark = document.createElement('div');
        checkmark.className = 'checkmark';
        successAnimation.appendChild(checkmark);
        petResult.appendChild(successAnimation);
  
        setTimeout(() => {
          successAnimation.remove();
          // Add any additional success handling here
        }, 3000);
      } else {
        const failureAnimation = document.createElement('div');
        failureAnimation.className = 'failure-animation';
        const crossmark = document.createElement('div');
        crossmark.className = 'crossmark';
        failureAnimation.appendChild(crossmark);
  
        const failureReason = document.createElement('p');
        failureReason.className = 'failure-reason';
        failureReason.textContent = `Reason: ${status.status}`;
        failureAnimation.appendChild(failureReason);
  
        petResult.appendChild(failureAnimation);
  
        setTimeout(() => {
          failureAnimation.remove();
          // Add any additional failure handling here
        }, 3000);
      }
    })
    .catch(error => {
      console.log(error);
      Nodata();
    });
  }

function location_selector(petId){
    fetch('/total_addresses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const pet_result = document.getElementById('pet_images');
        pet_result.innerHTML = "";
        const pets_choices=document.getElementById("user_choices");
        pets_choices.innerHTML="";
        const cartItemsContainer = document.getElementById('cart_items');
        cartItemsContainer.innerHTML = ""; // Clear previous content
    
        const totalCostView = document.getElementById('total_cost_view');
        totalCostView.innerHTML = "";

        let total_container=document.createElement('div');
        total_container.className="total_container";
        pet_result.appendChild(total_container)

        let totalAddresses = document.createElement('div');
        totalAddresses.className = "total_addresses";
        total_container.appendChild(totalAddresses);

        if (data.data =="error") {
            let totalAddressesTitle = document.createElement('img');
            totalAddressesTitle.src = 'static/images/i2.jpg';
            totalAddresses.className="nodata_image";
            console.log("im here");
            pet_result.appendChild(totalAddressesTitle);
        } else {
            data=data.data;
            console.log(data);
            data.forEach(row => {
                let addressContainer = document.createElement('div');
                addressContainer.className = "addressContainer";
                addressContainer.id = `addressContainer:${row[0]}`;
                
                totalAddresses.appendChild(addressContainer);
                // door number
                let doorNo = document.createElement('p');
                doorNo.className = "address_doorNo";
                doorNo.id = `doorNo:${row[0]}`;
                doorNo.textContent = `Door No: ${row[1]}`;
                addressContainer.appendChild(doorNo);

                // line break
                let lineBreak = document.createElement('br');
                addressContainer.appendChild(lineBreak);

                // locality
                let locality = document.createElement('p');
                locality.className = "address_locality";
                locality.id = `locality:${row[0]}`;
                locality.textContent = `Locality: ${row[2]}`;
                addressContainer.appendChild(locality);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // city
                let city = document.createElement('p');
                city.className = "address_city";
                city.id = `city:${row[0]}`;
                city.textContent = `City: ${row[3]}`;
                addressContainer.appendChild(city);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // pincode
                let pincode = document.createElement('p');
                pincode.className = "address_pincode";
                pincode.id = `pincode:${row[0]}`;
                pincode.textContent = `Pincode: ${row[4]}`;
                addressContainer.appendChild(pincode);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // state
                let state = document.createElement('p');
                state.className = "address_state";
                state.id = `state:${row[0]}`;
                state.textContent = `State: ${row[5]}`;
                addressContainer.appendChild(state);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // select option
                let selectButton = document.createElement('button');
                selectButton.className = "address_edit";
                selectButton.id = `address_edit:${row[0]}`;
                selectButton.textContent = "deliver here";
                selectButton.onclick = () => checkdelivery(row[0],petId);
                addressContainer.appendChild(selectButton);
                
                // line break
                addressContainer.appendChild(document.createElement('br'));

                
            });

            

            // button to add new addresses
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
});
}


function checkdelivery(locationId,petId){

    const petResult = document.getElementById('pet_images');
    petResult.innerHTML = "";
    const cartdata = document.getElementById('cart_items');
    cartdata.innerHTML = "";
    const totaldata = document.getElementById('total_cost_view');
    totaldata.innerHTML = "";
    const loadingAnimation = document.createElement('div');
    loadingAnimation.className = 'loading-animation';
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    loadingAnimation.appendChild(spinner);
    petResult.appendChild(loadingAnimation);
  

fetch('/check_delivery',{
    method:'POST',
    headers: {
        'content-type':'application/json'
    },
    body:JSON.stringify({Email,locationId,petId})
})
.then(response=>response.json())
.then(status=>{
    loadingAnimation.remove();
    if(status.status == "can't delivere to your adress"){
        
        console.log(status.status)
        
    }
    else{
        perform_transaction(locationId,petId)
    }
})
.catch(error=>{
    console.log(error);
    Nodata();
})
}

function perform_transaction(locationId, petId) {
    const petsImagesContainer = document.getElementById('pet_images');
    petsImagesContainer.innerHTML = "";
    const pet_result = document.getElementById('cart_items');
    pet_result.innerHTML = "";
    const totalCostView = document.getElementById('total_cost_view');
    totalCostView.innerHTML = "";
  
    const transaction_container = document.createElement('div');
    transaction_container.className = "transaction_container";
  
    const pet_data = document.createElement('div');
    pet_data.className = "transaction_pet_data";
  
    const transaction_details = document.createElement('div');
    transaction_details.className = "transaction_details";
  
    fetch('/get_pet_all_details', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ petId })
    })
    .then(response => response.json())
    .then(data => {
      data = data.data;
        
      const pet_image = document.createElement('img');
      pet_image.className = "transaction_pet_image";
      pet_image.src = `static/images/${data[0][2]}.jpeg`;
      pet_data.appendChild(pet_image);
  
      const pet_name = document.createElement('h3');
      pet_name.textContent = `${data[0][3]}`;
      pet_name.className = "transaction_pet_name";
      pet_data.appendChild(pet_name);
  
      const pet_cost = document.createElement('h4');
      pet_cost.textContent = `${data[0][1]}`;
      pet_cost.className = "transaction_pet_cost";
      pet_data.appendChild(pet_cost);
  
      const pet_description = document.createElement('h4');
      pet_description.className = "transaction_pet_description";
      pet_description.textContent = `${data[0][4]}`;
      pet_data.appendChild(pet_description);
  
      transaction_container.appendChild(pet_data);
    })
    .catch(error => {
      console.log(error.error);
      Nodata();
    });
  
    fetch('/get_location_details', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ locationId })
    })
    .then(response => response.json())
    .then(data => {
      data = data.data;
      const adressbar = document.createElement('div');
      adressbar.className = "transaction adresss";
  
      const d_no = document.createElement('p');
      d_no.className = "transaction d_no";
      d_no.textContent = `door no:${data[0][0]}`;
      adressbar.appendChild(d_no);
  
      const line = document.createElement('br');
      
      adressbar.appendChild(line);
      adressbar.appendChild(line);
  
      const locality = document.createElement('p');
      locality.className = "transaction localty";
      locality.textContent = `locality:${data[0][1]}`;
      adressbar.appendChild(locality);
  
      adressbar.appendChild(line.cloneNode());
      adressbar.appendChild(line.cloneNode());
  
      const city = document.createElement('p');
      city.className = "transaction city";
      city.textContent = `city:${data[0][2]}`;
      adressbar.appendChild(city);
  
      adressbar.appendChild(line.cloneNode());
      adressbar.appendChild(line.cloneNode());
  
      const pincode = document.createElement('p');
      pincode.className = "transaction pincode";
      pincode.textContent = `pincode:${data[0][3]}`;
      adressbar.appendChild(pincode);
  
      adressbar.appendChild(line.cloneNode());
      adressbar.appendChild(line.cloneNode());
  
      const state = document.createElement('p');
      state.className = "transaction state";
      state.textContent = `state:${data[0][4]}`;
      adressbar.appendChild(state);
  
      transaction_details.appendChild(adressbar);
  
      // Payment options
      const paymentsbar = document.createElement('div');
      paymentsbar.className = "paymentoptions";
      paymentsbar.id = "payment options";
  
      // UPI
      const upi = document.createElement('button');
      upi.className = "upibar";
      upi.textContent = "UPI";
      paymentsbar.append(upi);
      

      // Line
      const brick = document.createElement('br');
      brick.className = "payments_line";
      paymentsbar.appendChild(brick);
      paymentsbar.appendChild(brick.cloneNode());
     
  
      // Cash on Delivery
      const cod = document.createElement('button');
      cod.className = "codbar";
      cod.textContent = "Cash on Delivery";
      cod.onclick=()=>{
        paymentmode="COD";
        fetch('/transaction',{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({petId,Email,paymentmode})
        })
        .then(response=>response.json())
        .then(sucess=>{
            const transactionid=sucess.id;
            handleFinalPurchase(locationId,petId,transactionid,paymentmode);
        })
        .catch(error=>{
            console.log(error);
            Nodata();
        })
      }
      paymentsbar.appendChild(cod);
  
      upi.onclick = () => {
        // UPI ID label
        paymentsbar.innerHTML="";
        const upicontainer=document.createElement('div');
        upicontainer.className="upidatacontainer";

        const upilabel = document.createElement("label");
        upilabel.htmlFor = "upiid";
        upilabel.className = "upilabel";
        upilabel.textContent = "UPI ID";
        upicontainer.appendChild(upilabel);
  
        // UPI input
        const upiid = document.createElement('input');
        upiid.className = "upi input";
        upiid.id = "transaction upid";
        upicontainer.appendChild(upiid);
  
        // Submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = "Submit";
        submitButton.className = "submit-button";
        submitButton.onclick=()=>{
            paymentmode="UPI";
            fetch('/transaction',{
                method:'POST',
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify({petId,Email,paymentmode})
            })
            .then(response=>response.json())
            .then(sucess=>{
                const transactionid=sucess.id;
                handleFinalPurchase(locationId,petId,transactionid);
            })
            .catch(error=>{
                console.log(error);
                Nodata();
            })
        }
       

        upicontainer.appendChild(submitButton);
        paymentsbar.appendChild(upicontainer);
      }
  
      transaction_details.appendChild(paymentsbar);
     
    })
    .catch(error => {
      console.log(error);
      Nodata();
    });
  
    transaction_container.appendChild(transaction_details);
    petsImagesContainer.appendChild(transaction_container);
  }

function newdata(data){
    const petsImagesContainer = document.getElementById('pet_images');
    petsImagesContainer.innerHTML = "";
    const pet_result = document.getElementById('cart_items');
    pet_result.innerHTML = "";
    const totalCostView = document.getElementById('total_cost_view');
    totalCostView.innerHTML = "";
    for (const item of data) {
        const petResult = document.createElement('div');
        petResult.className = 'pets_result';

        const petImage = document.createElement('img');
        petImage.src =`static/images/${item[0]}.jpeg`; 
        console.log(petImage.src);// Decode base64-encoded pet_pic
        petImage.className = 'result_images';
        petImage.id = item[3]; // Assuming the pet ID is at index 3
        petResult.appendChild(petImage);

        const petName = document.createElement('p');
        petName.textContent = item[0]; // pet_name
        petName.className = 'result_pet_name';
        petName.id = `${item[3]}`; // Assuming the pet ID is at index 3
        petResult.appendChild(petName);

        const petCost = document.createElement('p');
        petCost.textContent = `MRP ${item[1]}`; // pet_cost
        petCost.className = 'result_pet_cost';
        petCost.id = item[3]; // Assuming the pet ID is at index 3
        petResult.appendChild(petCost);

        const buttons = document.createElement('div');
        buttons.className = 'addingbuttons';
        const adoptButton = document.createElement('button');
        adoptButton.textContent = 'Adopt Pet';
        adoptButton.className = 'pet_adopt_button';
        adoptButton.onclick = () => handlePetAdoption(item[3],item[0],item[1]); // Assuming the pet ID is at index 3
        buttons.appendChild(adoptButton);

        const addCart = document.createElement('button');
        addCart.innerHTML = 'cart';
        addCart.className = 'pet_adopt_button';
        addCart.id = `add_cart_${item[3]}`;
        addCart.onclick = () => addToCart(item[3]);
        buttons.appendChild(addCart);

        const addWhistlist = document.createElement('button');
        addWhistlist.innerHTML = 'whistlist';
        addWhistlist.className = 'pet_adopt_button';
        addWhistlist.id=`add_whistlist_${item[3]}`;
        addWhistlist.onclick = () => addToWhistlist(item[3],item[0],item[1]);
        buttons.appendChild(addWhistlist);
        petResult.appendChild(buttons);

        petsImagesContainer.appendChild(petResult);
    }
}

// Add event listener to category pet buttons
const categoryPetButtons = document.querySelectorAll('#category_pets');
categoryPetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const petName = button.value;
        fetch('/get_result_images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ petName })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Nodata();
                    console.log(data.error);
                } else {
                    const receivedData = data.data;
                    console.log(receivedData);
                    processData(receivedData);
                }
            })
            .catch(error => {
                Nodata();
                console.error('Error:', error);
            });
    });
});

function Nodata() {
    const cartItemsContainer = document.getElementById('cart_items');
        cartItemsContainer.innerHTML = "";
        const totalCostView = document.getElementById('total_cost_view');
        totalCostView.innerHTML = "";
    let noResult_image = document.createElement('img');
    let noresult_data = document.createElement('div');
    noresult_data.id = "noresult_data";
    const pet_result = document.getElementById('pet_images');
    pet_result.innerHTML = "";
  
    let noResult = document.createElement('P');
    noResult.className = 'no_results';
    noResult.innerHTML = "oops something went wrong";
  
    let noResult_home = document.createElement('a');
    noResult_home.href = "http://127.0.0.1:5000";
    noResult_home.className = "no_result_link";
  
    let noResult_button = document.createElement("button");
    noResult_button.textContent = "Go to home page";
    noResult_button.className = "no_result_button";
    noResult_home.appendChild(noResult_button);
  
    document.getElementById("pet_images").innerHTML = "";
  
    noResult_image.src = 'static/images/i2.jpg';
    noResult_image.className = 'no_result_images';
  
    document.getElementById("pet_images").appendChild(noresult_data);
    noresult_data.appendChild(noResult_image);
    noresult_data.appendChild(noResult);
    noresult_data.appendChild(noResult_home);
  }

document.getElementById("submit_1").onclick = function() {
    const petName = document.getElementById("search").value;
    fetch('/get_result_images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ petName })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Nodata();
                console.log(data.error);
            } else {
                const receivedData = data.data;
                console.log(receivedData);
                processData(receivedData);
            }
        })
        .catch(error => {
            Nodata();
            console.error('Error:', error);
        });
}

//login

// Function to handle account button click
document.getElementById("account").onclick = function() {
    const petImagesContainer = document.getElementById("pet_images");
    const petResult = document.getElementById('pet_images');
    petResult.innerHTML = "";
    const cartItemsContainer = document.getElementById('cart_items');
    cartItemsContainer.innerHTML = "";
    const totalCostView = document.getElementById('total_cost_view');
    totalCostView.innerHTML = "";
    const petsChoices = document.getElementById("user_choices");
    petsChoices.innerHTML = "";

    if (login) {
        // Clear existing content inside petImagesContainer
        petImagesContainer.innerHTML = "";

        // Create elements for authenticated user interface
        const homeButton = document.createElement("a");
        homeButton.href = "http://127.0.0.1:5000/";
        homeButton.className = "user_home";
        homeButton.id = "user_home_1";
        homeButton.innerHTML = 'Home';

        const ordersButton = document.createElement("button");
        ordersButton.className = "user_orders";
        ordersButton.id = "user_order";
        ordersButton.onclick=()=>displayorders();
        ordersButton.textContent = "Orders";

        const logoutButton = document.createElement("button");
        logoutButton.className = "user_logout";
        logoutButton.id = "user_logout";
        logoutButton.textContent = "Log Out";

        const locationsButton = document.createElement("button");
        locationsButton.className = "user_transactions";
        locationsButton.id = "user_locations";
        locationsButton.onclick=()=>locations()
        locationsButton.textContent = "addresses";

        // Append elements to petImagesContainer
        petImagesContainer.appendChild(homeButton);
        petImagesContainer.appendChild(ordersButton);
        petImagesContainer.appendChild(logoutButton);
        petImagesContainer.appendChild(locationsButton);

        logoutButton.onclick = function() {
            login = false;
            Email = "";
            Password = "";
            // Clear the container and display the logout message
            petImagesContainer.innerHTML = "";
            const msg = document.createElement("h1");
            msg.textContent = "You are now logged out";
            petImagesContainer.appendChild(msg);
        };

        


    } else {
        // Clear existing content inside petImagesContainer
        petImagesContainer.innerHTML = "";

        // Create login form elements
        const userCredentials = document.createElement('div');
        userCredentials.id = "user_credentials";

        const usernameLabel = document.createElement('label');
        usernameLabel.setAttribute('for', 'user_email');
        usernameLabel.id = 'username_label';
        usernameLabel.innerText = 'Email:';
        userCredentials.appendChild(usernameLabel);

        const usernameInput = document.createElement("input");
        usernameInput.type = 'text';
        usernameInput.placeholder = 'Email';
        usernameInput.className = 'user_credential';
        usernameInput.id = 'user_email';
        userCredentials.appendChild(usernameInput);
        userCredentials.appendChild(document.createElement("br"));
        userCredentials.appendChild(document.createElement("br"));

        const passwordLabel = document.createElement('label');
        passwordLabel.setAttribute('for', 'user_password');
        passwordLabel.id = 'password_label';
        passwordLabel.innerText = 'Password:';
        userCredentials.appendChild(passwordLabel);

        const passwordInput = document.createElement("input");
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Password';
        passwordInput.className = 'password_credential';
        passwordInput.id = 'user_password';
        userCredentials.appendChild(passwordInput);
        userCredentials.appendChild(document.createElement("br"));
        userCredentials.appendChild(document.createElement("br"));

        const submitButton = document.createElement('button');
        submitButton.className = "submit_button";
        submitButton.id = "login_submit_button";
        submitButton.textContent = "Login";
        submitButton.onclick=()=>{
            const email=document.getElementById("user_email").value;
            const password=document.getElementById("user_password").value;
            fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(status => {
            if (status.status === "failure") {
                // Display login error message
                const alert = document.createElement("p");
                alert.innerHTML = "Sorry, invalid username or password. Please try again.";
                alert.id = "user_failure_login";
                petImagesContainer.appendChild(alert);
            } else {
                // Login successful
                login = true;
                // Clear petImagesContainer and display success message
                Email = email;
                Password = password;
                petImagesContainer.innerHTML = "";
                const alert = document.createElement("p");
                alert.innerHTML = status.status;
                alert.id = "user_successful_login";
                petImagesContainer.appendChild(alert);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
        });
    }
        userCredentials.appendChild(submitButton);

        // New account button
        const createNewAccount = document.createElement('button');
        createNewAccount.className = "submit_button";
        createNewAccount.id = "newaccount_button";
        createNewAccount.textContent = 'Create a new account';
        userCredentials.appendChild(createNewAccount);

        petImagesContainer.appendChild(userCredentials);
        petImagesContainer.appendChild(document.createElement("br"));
        petImagesContainer.appendChild(document.createElement("br"));

        createNewAccount.onclick = function() {
            const petImagesContainer1 = document.getElementById("pet_images");
            petImagesContainer1.innerHTML = "";

            const newUserCredentials = document.createElement('div');
            newUserCredentials.id = "newuser_credentials";

            // Username label
            const userNameLabel = document.createElement('label');
            userNameLabel.htmlFor = 'newusername';
            userNameLabel.id = 'newusername_label';
            userNameLabel.innerText = 'Username:';
            newUserCredentials.appendChild(userNameLabel);

            // Username input
            const newUserName = document.createElement('input');
            newUserName.className = 'user_credential';
            newUserName.id = 'newusername';
            newUserName.placeholder = 'Username';
            newUserCredentials.appendChild(newUserName);
            newUserCredentials.appendChild(document.createElement('br'));
            newUserCredentials.appendChild(document.createElement('br'));

            // Email label
            const newEmailLabel = document.createElement("label");
            newEmailLabel.htmlFor = "newemailid";
            newEmailLabel.id = "newemailid_label";
            newEmailLabel.innerText = "Email ID:";
            newUserCredentials.appendChild(newEmailLabel);

            // Email input
            const newEmail = document.createElement("input");
            newEmail.className = 'user_credential';
            newEmail.id = 'newemailid';
            newEmail.placeholder = "Email ID";
            newEmail.type = "email";
            newUserCredentials.appendChild(newEmail);
            newUserCredentials.appendChild(document.createElement('br'));
            newUserCredentials.appendChild(document.createElement('br'));

            // Password label
            const newPasswordLabel = document.createElement("label");
            newPasswordLabel.id = "newpassword_label";
            newPasswordLabel.htmlFor = 'newpassword';
            newPasswordLabel.innerText = "Password:";
            newUserCredentials.appendChild(newPasswordLabel);

            // Password input
            const newPassword = document.createElement("input");
            newPassword.type = 'password';
            newPassword.id = "newpassword";
            newPassword.className = 'password_credential';
            newPassword.placeholder = 'Password';
            newUserCredentials.appendChild(newPassword);
            newUserCredentials.appendChild(document.createElement('br'));
            newUserCredentials.appendChild(document.createElement('br'));

            // Phone number label
            const phoneNumberLabel = document.createElement('label');
            phoneNumberLabel.htmlFor = 'phonenumber';
            phoneNumberLabel.id = 'phonenumberlabel';
            phoneNumberLabel.innerText = "Phone Number:";
            newUserCredentials.appendChild(phoneNumberLabel);

            // Phone number input
            const newPhoneNumber = document.createElement('input');
            newPhoneNumber.className = 'user_credential';
            newPhoneNumber.id = 'newphonenumber';
            newPhoneNumber.placeholder = 'Phone Number';
            newUserCredentials.appendChild(newPhoneNumber);
            newUserCredentials.appendChild(document.createElement('br'));
            newUserCredentials.appendChild(document.createElement('br'));

            // Submit button
            const newSubmitButton = document.createElement('button');
            newSubmitButton.id = 'newsubmitbutton';
            newSubmitButton.className = "submit_button";
            newSubmitButton.textContent = "Sign Up";
            newSubmitButton.onclick=()=>{
                newusername=document.getElementById('newusername').value;
                newemail=document.getElementById('newemailid').value;
                newpassword=document.getElementById('newpassword').value;
                newnumber=document.getElementById('newphonenumber').value;
                fetch('/create_account',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({newusername,newemail,newpassword,newnumber})
                })
                .then(response=>response.json())
                .then(status=>{
                    if(status.status=='sucess'){
                        login = true;
                // Clear petImagesContainer and display success message
                Email = newemail;
                Password = newpassword;
                petImagesContainer.innerHTML = "";
                const alert = document.createElement("p");
                alert.innerHTML = status.status;
                alert.id = "user_successful_login";
                petImagesContainer.appendChild(alert);
                    }
                    else{
                        const alert = document.createElement("p");
                        alert.innerHTML = "Sorry, emailid or password is already taken";
                        alert.id = "user_failure_login";
                        petImagesContainer.appendChild(alert); 
                    }
                })
                .catch(error=>{
                    console.log(error);
                }
                )


            }
            newUserCredentials.appendChild(newSubmitButton);

            petImagesContainer1.appendChild(newUserCredentials);
        }

        // Ad
        // Send login request to server

        
}
}

//const cartButton = document.getElementById("cart");
document.getElementById("cart").onclick = function() {
    
    if (login) {
        const email = Email;
        fetch('/cart_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(data.error)
                Nodata();
            } else {
                const receivedData = data.data;
                processCartData(receivedData);
            }
        })
        .catch(error => {
            console.log(error);
            Nodata();
        });
    } else {
        window.alert("Please sign in first");
    }
};

document.getElementById("whistlist").onclick = function() {
    
    if (login) {
        const email = Email;
        const cartItemsContainer = document.getElementById('cart_items');
        cartItemsContainer.innerHTML = "";
        fetch('/whistlist_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(data.error);
                Nodata();
                
            } else {
                const receivedData = data.data;
                processCartData(receivedData);
            }
        })
        .catch(error => {
            console.log(error);
            Nodata();
        });
    } else {
        window.alert("Please sign in first");
    }
};


function processCartData(data) {
    const petResultContainer = document.getElementById('pet_images');
    petResultContainer.innerHTML = "";

    const userChoices = document.getElementById("user_choices");
    userChoices.innerHTML = "";

    const cartItemsContainer = document.getElementById('cart_items');
    cartItemsContainer.innerHTML = "";

    const totalCostView = document.getElementById('total_cost_view');
    totalCostView.innerHTML = "";

    let totalCost = 0;

    const title = document.createElement('h1');
    title.textContent = "Your Cart";
    title.className = "cart_title";
    cartItemsContainer.appendChild(title);

    data.forEach(item => {
        const petResult = document.createElement('div');
        petResult.className = 'cart_pets_result card'; // Added 'card' class

        const petImageContainer = document.createElement('div');
        petImageContainer.className = 'imgBx inner pet_image_container'; // Added 'inner' class and 'product-image' class

        const petImage = document.createElement('img');
        petImage.src = `static/images/${item[0]}.jpeg`;
        petImageContainer.appendChild(petImage);

        const petInfoContainer = document.createElement('div');
        petInfoContainer.className = 'product-details'; // Added 'product-details' class

        const petName = document.createElement('h1');
        petName.textContent = item[0];
        petName.className = "title"; // Added 'title' class

        const petDescription = document.createElement('p');
        petDescription.textContent = `MRP ${item[1]}`;
        petDescription.className = "information"; // Added 'information' class

        const buyButton = document.createElement('button');
        buyButton.className = 'btn';
        buyButton.innerHTML = `<span class="price">$${item[1]}</span><span class="shopping-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></span><span class="buy">Get now</span>`;

        petInfoContainer.appendChild(petName);
        petInfoContainer.appendChild(petDescription);
        petInfoContainer.appendChild(buyButton);

        petResult.appendChild(petImageContainer);
        petResult.appendChild(petInfoContainer);

        cartItemsContainer.appendChild(petResult);

        totalCost += parseInt(item[1]);
    });

    const totalCostTitle = document.createElement('h2');
    totalCostTitle.textContent = 'Total Cost';
    totalCostTitle.className = 'total_cost_title';
    totalCostView.appendChild(totalCostTitle);

    const totalCostAmount = document.createElement('p');
    totalCostAmount.textContent = `${totalCost}`;
    totalCostAmount.className = 'total_cost_amount';
    totalCostView.appendChild(totalCostAmount);

    const totalCostButton = document.createElement('button');
    totalCostButton.textContent = "Checkout";
    totalCostButton.className = "cart_TotalCost footerLink"; // Added 'footerLink' class
    totalCostButton.onclick = () => buyCartItems();
    totalCostView.appendChild(totalCostButton);
}




function locations() {
    fetch('/total_addresses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const pet_result = document.getElementById('pet_images');
        pet_result.innerHTML = "";
        const pets_choices=document.getElementById("user_choices");
        pets_choices.innerHTML="";
        const cartItemsContainer = document.getElementById('cart_items');
        cartItemsContainer.innerHTML = ""; // Clear previous content
    
        const totalCostView = document.getElementById('total_cost_view');
        totalCostView.innerHTML = "";

        let total_container=document.createElement('div');
        total_container.className="total_container";
        pet_result.appendChild(total_container)

        let totalAddresses = document.createElement('div');
        totalAddresses.className = "total_addresses";
        total_container.appendChild(totalAddresses);

        if (data.data =="error") {
            let totalAddressesTitle = document.createElement('img');
            totalAddressesTitle.src = 'static/images/i2.jpg';
            totalAddresses.className="nodata_image";
            console.log("im here");
            pet_result.appendChild(totalAddressesTitle);
        } else {
            data=data.data;
            console.log(data);
            data.forEach(row => {
                let addressContainer = document.createElement('div');
                addressContainer.className = "addressContainer";
                addressContainer.id = `addressContainer:${row[0]}`;
                
                totalAddresses.appendChild(addressContainer);
                // door number
                let doorNo = document.createElement('p');
                doorNo.className = "address_doorNo";
                doorNo.id = `doorNo:${row[0]}`;
                doorNo.textContent = `Door No: ${row[1]}`;
                addressContainer.appendChild(doorNo);

                // line break
                let lineBreak = document.createElement('br');
                addressContainer.appendChild(lineBreak);

                // locality
                let locality = document.createElement('p');
                locality.className = "address_locality";
                locality.id = `locality:${row[0]}`;
                locality.textContent = `Locality: ${row[2]}`;
                addressContainer.appendChild(locality);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // city
                let city = document.createElement('p');
                city.className = "address_city";
                city.id = `city:${row[0]}`;
                city.textContent = `City: ${row[3]}`;
                addressContainer.appendChild(city);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // pincode
                let pincode = document.createElement('p');
                pincode.className = "address_pincode";
                pincode.id = `pincode:${row[0]}`;
                pincode.textContent = `Pincode: ${row[4]}`;
                addressContainer.appendChild(pincode);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // state
                let state = document.createElement('p');
                state.className = "address_state";
                state.id = `state:${row[0]}`;
                state.textContent = `State: ${row[5]}`;
                addressContainer.appendChild(state);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                // edit option
                let editButton = document.createElement('button');
                editButton.className = "address_edit";
                editButton.id = `address_edit:${row[0]}`;
                editButton.textContent = "Edit";
                editButton.onclick = () => editAddress(row[0]);
                addressContainer.appendChild(editButton);

                // line break
                addressContainer.appendChild(document.createElement('br'));

                
            });

            

            // button to add new addresses
            
            
        }
        let addAddressButton = document.createElement('button');
            addAddressButton.className = "add_address_button";
            addAddressButton.textContent = "Add New Address";
            addAddressButton.onclick = () => addNewAddress();
            total_container.appendChild(addAddressButton);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function addNewAddress() {
    // Implementation for adding a new address
    let newAddressForm = document.createElement('div');
    newAddressForm.className = 'new_address_form';

    let doorNoInput = document.createElement('input');
    doorNoInput.placeholder = 'Door No';
    doorNoInput.className = 'input_doorNo';
    doorNoInput.id = "adress_door_no";
    newAddressForm.appendChild(doorNoInput);

    let localityInput = document.createElement('input');
    localityInput.placeholder = 'Locality';
    localityInput.className = 'input_locality';
    localityInput.id = "adress_locality";
    newAddressForm.appendChild(localityInput);

    let cityInput = document.createElement('input');
    cityInput.placeholder = 'City';
    cityInput.className = 'input_city';
    cityInput.id = "adress_city";
    newAddressForm.appendChild(cityInput);

    let pincodeInput = document.createElement('input');
    pincodeInput.placeholder = 'Pincode';
    pincodeInput.className = 'input_pincode';
    pincodeInput.id = "adress_pincode";
    newAddressForm.appendChild(pincodeInput);

    let stateInput = document.createElement('input');
    stateInput.placeholder = 'State';
    stateInput.className = 'input_state';
    stateInput.id = "adress_state";
    newAddressForm.appendChild(stateInput);

    let saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {
        var d_no = document.getElementById('adress_door_no').value;
        var locality = document.getElementById('adress_locality').value;
        var city = document.getElementById('adress_city').value;
        var pincode = document.getElementById('adress_pincode').value;
        var state = document.getElementById('adress_state').value;

        // Save the new address (e.g., send to server)
        fetch('/add_adress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ d_no, locality, city, pincode, state,Email})
        })
        .then(response => response.json())
        .then(data => {
            console.log('Address saved:', data);
            locations(); // Refresh the list of addresses
        })
        .catch(error => {
            console.error('Error saving address:', error);
        });
    };
    newAddressForm.appendChild(saveButton);

    let imageContainer = document.getElementById("pet_images");
    imageContainer.innerHTML = '';
    imageContainer.appendChild(newAddressForm);
}

function processordersdata(data) {
    console.log(data);

    let ordersdata = document.createElement('div');
    ordersdata.className = "ordersdata";
    ordersdata.id = "orders_data";

    const petResultContainer = document.getElementById('pet_images');
    petResultContainer.innerHTML = "";

    const userChoices = document.getElementById("user_choices");
    userChoices.innerHTML = "";

    const cartItemsContainer = document.getElementById('cart_items');
    cartItemsContainer.innerHTML = "";

    const totalCostView = document.getElementById('total_cost_view');
    totalCostView.innerHTML = "";

    petResultContainer.appendChild(ordersdata);

    data.forEach(row => {
        let order = document.createElement('div');
        order.className = "orderindividual";
        order.id = `order:${row.order_id}`; // Accessing order_id correctly
        ordersdata.appendChild(order);

        // Pet picture
        let order_pic = document.createElement('img');
        order_pic.src = `static/images/${row.pet_name}.jpeg`; // Assuming image is named after order_id
        order_pic.className = "orderpic";
        order_pic.id = `orderpic:${row.order_id}`;
        order.appendChild(order_pic);

        // Pet name
        let order_name = document.createElement('p');
        order_name.className = "ordernamedisplay";
        order_name.textContent = row.pet_name; // Accessing pet_name correctly
        order_name.id = `order-name:${row.order_id}`;
        order.appendChild(order_name);

        // Handle other details on click
        order.onclick = () => vieworderfulldata(row);
    });
}

function displayorders() {
    

    fetch('get_orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email }) // Sending email correctly
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.data) {
            processordersdata(data.data);
        } else {
            Nodata();
        }
    })
    .catch(error => {
        console.log(error);
        Nodata();
    });
}
