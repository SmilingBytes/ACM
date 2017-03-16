var money = [];
// Populate the database
function populateDB(tx) {
  // tx.executeSql('CREATE TABLE IF NOT EXISTS admin (a_id unique, password, name)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS customers '+
                    '(c_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
                    'name TEXT NOT NULL, '+
                    'info TEXT, '+
                    'money INTEGER NOT NULL)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS transactions '+
                    '(t_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
                    'c_id INTEGER NOT NULL, '+
                    'date TEXT NOT NULL, '+
                    'time TEXT NOT NULL, '+
                    'note TEXT, '+
                    'amount INTEGER NOT NULL)');

  if (sessionStorage.spass) {
    if(sessionStorage.spass == localStorage.pass){
      $(".only-admin").css = ("display", "block");
      document.getElementById("home").style.display = "block";
      tx.executeSql('SELECT * FROM customers ORDER BY c_id', [], function (tx, results) {
          var len = results.rows.length;
          var total_amount = 0;
          var payable = 0;
          var receivable = 0;
          var m = 0;
          var selectOutput = '<option>Select Customer</option>';
          var resultsList = " ";
          var receivableList = " ";
          var payableList = " ";
          var cList = "";

          for (var i=0; i<len; i++){
              money[i] = results.rows.item(i).money;
              selectOutput = selectOutput+' <option value="'+results.rows.item(i).c_id+'">'+results.rows.item(i).name+'</option>';
              total_amount = total_amount + results.rows.item(i).money;
              cList = cList + '<li><a href="#viewCustomer" onclick="userID('+results.rows.item(i).c_id+');" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><i class="fa fa-user fa-3x list-icon"></i><h2 class="customer_name">'+results.rows.item(i).name+'</h2><p class="customer_info">'+results.rows.item(i).info+'</p> <span class="ui-li-count">'+results.rows.item(i).money+'</span></a></li>';

              if(results.rows.item(i).money > 0){
                receivable += results.rows.item(i).money;
                receivableList = receivableList + '<li><a href="#viewCustomer" onclick="userID('+results.rows.item(i).c_id+');" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><i class="fa fa-user fa-3x list-icon"></i><h2 class="customer_name">'+results.rows.item(i).name+'</h2><p class="customer_info">'+results.rows.item(i).info+'</p> <span class="ui-li-count">'+results.rows.item(i).money+'</span></a></li>';
              }else if (results.rows.item(i).money < 0) {
                payable -=results.rows.item(i).money;
                payableList = payableList + '<li><a href="#viewCustomer" onclick="userID('+results.rows.item(i).c_id+');" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><i class="fa fa-user fa-3x list-icon"></i><h2 class="customer_name">'+results.rows.item(i).name+'</h2><p class="customer_info">'+results.rows.item(i).info+'</p> <span class="ui-li-count">'+results.rows.item(i).money+'</span></a></li>';
              }
              if (results.rows.item(i).money != 0) {
                resultsList = resultsList + '<li><a href="#viewCustomer" onclick="userID('+results.rows.item(i).c_id+');" data-ajax="false" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><i class="fa fa-user fa-3x list-icon"></i><h2 class="customer_name">'+results.rows.item(i).name+'</h2><p class="customer_info">'+results.rows.item(i).info+'</p> <span class="ui-li-count">'+results.rows.item(i).money+'</span></a></li>';
              }
          }

          localStorage["money"] = JSON.stringify(money);
          document.getElementById("c_id").innerHTML = selectOutput;
          document.getElementById("tcustomer").innerHTML = len;
          document.getElementById("tamount").innerHTML = total_amount;
          document.getElementById("tmoney").innerHTML = total_amount;
          document.getElementById("receivable").innerHTML = receivable;
          document.getElementById("payable").innerHTML = payable;
          document.getElementById("resultsList").innerHTML = resultsList;
          document.getElementById("receivableList").innerHTML = receivableList;
          document.getElementById("payableList").innerHTML = payableList;
      }, errorCB);
    }else { //login page
      window.location = "index.html#login";
    }
  }else if(!localStorage.id && !localStorage.pass){  // setup page
    window.location = "index.html#setup";
  }else{   //login page
    $("#nav-panel").css = ("display", "none");
    $("#search").css = ("display", "none");
    document.getElementById("ft").style.display  = "none";
    window.location = "index.html#login";
  }
}

// Transaction error callback
function errorCB(tx, err) {
  alert("Error processing SQL: "+err);
}

// Transaction success callback
function successCB() {

}

function onPause() {
  // TODO: This application has been suspended. Save application state here.
}

function onResume() {
  // TODO: This application has been reactivated. Restore application state here.
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  var db = window.openDatabase("ACM_DB", "1.0", "ACM Database", 200000);
  db.transaction(populateDB, errorCB, successCB);
  // Handle the Cordova pause and resume events
  // document.addEventListener( 'pause', onPause.bind( this ), false );
  // document.addEventListener( 'resume', onResume.bind( this ), false );
  // alert("DB ready!");
}



var db = window.openDatabase("ACM_DB", "1.0", "ACM Database", 200000);

var dt = new Date();
var mo = dt.getMonth();
var da = dt.getDate();
var ye = dt.getFullYear();
var min = dt.getMinutes();
var hou = dt.getHours();
var sep = '-';
mo += 1;
mo = mo.toString();
da = da.toString();
ye = ye.toString();
min = min.toString();
hou = hou.toString();
var dateTime =  da.concat(sep,mo,sep,ye,' * ',hou,':',min);
dateTime = dateTime.toString();

// Check alert for reloading the page
function checkAlert(){
  if(localStorage.success){
    reset();
    alert(localStorage.success);
    alertify.success(localStorage.success);
    window.localStorage.removeItem("success");
  }else if(localStorage.error){
    reset();
    alert(localStorage.error);
    alertify.error(localStorage.error);
    window.localStorage.removeItem("error");
  }
}

// Body init
function bodyLoad(){
  // checkLog();
  checkAlert();
}

// Admin Account Setup
function adminSetup(){
  var aid = document.getElementById("aname").value;
  var apass = document.getElementById("a_pass").value;
  var aname = document.getElementById("aname").value;
  if (!localStorage.id && !localStorage.pass) {
    localStorage.id = aid;
    localStorage.pass = apass;
    localStorage.name = aname;
    reset();
    sessionStorage.success = "Admin Setup Successfull.";
    window.location.reload();
    return false;
  }
}

//login checkup for admin access
function adminLogin(){
  var apass = document.getElementById("apass").value;
  if (localStorage.id && localStorage.pass) {
    if( apass == localStorage.pass ){
      sessionStorage.spass = localStorage.pass;
      //sessionStorage.success = "Login successfull";
      window.location.reload();
    }else{
      reset();
      alertify.error('Admin access restricted for <strong>WRONG PASSWORD</strong>');
      return false;
    }
  }
}

// Add Customer function
function addUser(tx) {
  var cname = document.getElementById("cname").value;
  var cinfo = document.getElementById("cinfo").value;
  var cmoney = document.getElementById("cmoney").value;

  tx.executeSql('INSERT INTO customers ( name, info, money) VALUES ("'+cname+'", "'+cinfo+'", '+cmoney+')');
}
function addedCustomer(){ //successfull Customer addition callback
  reset();
  localStorage.success = "Customer Addition Successfull.";
	window.location.reload();
  return true;
}
function addCustomer(){
  db.transaction(addUser, errorCB, addedCustomer);
}


// Add Money function
function addAmount(tx) {
  var c_id = document.getElementById("c_id").value;
  var note = document.getElementById("t_note").value;
  var amount = document.getElementById("t_money").value;
  c_id = Number(c_id);

  money = JSON.parse(localStorage["money"]);
  c_money = Number(money[c_id-1]);

  tx.executeSql('INSERT INTO transactions ( c_id, time, note, amount) VALUES ("'+c_id+'", "'+dateTime+'", "'+note+'", '+amount+')');

  var m = Number(c_money) + Number(amount);
  tx.executeSql('UPDATE customers '+
                  'SET money = '+m+' '+
                  'WHERE c_id = '+c_id+'');
}

function moneyAdded(){ //successfull Money addition callback
  reset();
  localStorage.success = "Customer Addition Successfull.";
	window.location.reload();
  return true;
}

function addMoney(){
  db.transaction(addAmount, errorCB, moneyAdded);
}



// Admin Logout function
function logOut(){
  window.sessionStorage.clear();
  sessionStorage.success = 'Successfull logout';
  window.location.reload();
}

function errorCB(tx, err) {
  alert("Error processing SQL: "+err);
}

// Transaction success callback
function successCB() {
  // alert("success!");
}
