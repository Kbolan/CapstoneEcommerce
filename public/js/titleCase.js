function titleCaseForm() {
    var x = document.forms["myForm"]["appendedInputButtons"].value;
	document.forms["myForm"]["appendedInputButtons"].value = x.toTitleCase();
	
	// After installing the Parse SDK above, intialize it with your Parse application ID and key below
    Parse.initialize("iNsUaMNfWLEX4e0Q7nm97yDm3nPVGXa5uH5iZTN6", "Nhhm8HAZWHPejoUxQAN6U3QYLTRlvLsvnofZ6F26");
}

var purchase = [];
var purchaseTable = [];

function addItem(item, cart, total) {
		
	if (purchase.length == 0) {
		for (var i = 0; i < cart.length; i++) {
			if (!contains(purchase, item.get("item_name"))) {
				purchase.push(cart[i].get("item_name")); 
				purchaseTable.push({"isbn": cart[i].get("item_name"), "seller":cart[i].get("seller")}); 		
			}
		}
	}
	var TempPurchase = Parse.Object.extend("TempPurchase");
	var query = new Parse.Query(TempPurchase);
	query.equalTo("buyer", cart[0].get("buyer"));
	query.find({
	  success: function(results) {
		if (results.length > 0) {
			// update record 
			var object = results[0];
			object.set("books", purchase);
			object.set("buyer", cart[0].get("buyer"));
			object.set("seller", cart[0].get("seller"));
			object.set("total", total);												
			object.save(null, {
				success: function(tmp) {
					console.log('success save, found objects ' + results.length);
				}
			});
		} else {
			// save new record
			var tempPurchase = new TempPurchase();
			tempPurchase.set("books", purchase);
			tempPurchase.set("buyer", cart[0].get("buyer"));
			tempPurchase.set("seller", cart[0].get("seller"));			
			tempPurchase.set("total", total);			
			tempPurchase.save(null, {
				success: function(tmp) {
					console.log('successful save in new record');
				}
			});
		}
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}