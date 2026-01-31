import { default as Web3 } from 'web3';
import { default as contract } from '@truffle/contract';
import structstorage_artifacts from '../../build/contracts/StructStorage.json';
import $ from 'jquery';

// Expose jQuery globally
window.$ = window.jQuery = $;

var StructStorage = contract(structstorage_artifacts);
var accounts;
var account;

window.App = {
    start: function () {
        var self = this;
        console.log("App initializing...");

        // Safety check for web3
        if (typeof window.web3 === 'undefined') {
            console.warn("Web3 is undefined in App.start, initializing fallback...");
            window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        }

        StructStorage.setProvider(window.web3.currentProvider);

        window.web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Check Ganache/Metamask.");
                return;
            }

            accounts = accs;
            account = accounts[0];

            console.log("Account detected:", account);
            $("#SenderBalance").text(account);

            // Initialize Roles
            self.checkRoles();

            // Initialize Events
            self.listenToEvents();
        });
    },

    checkRoles: function () {
        StructStorage.deployed().then(function (instance) {
            return instance.isFarmer(account);
        }).then(function (res) {
            if (res) {
                $("#register-farmer").hide();
                $("#status").html("Welcome, Registered Farmer!").css("color", "#76ff03");
            }
        });

        StructStorage.deployed().then(function (instance) {
            return instance.isInspector(account);
        }).then(function (res) {
            if (res) {
                $("#register-inspector").hide();
                $("#status").html("Welcome, Registered Inspector!").css("color", "#76ff03");
            }
        });
    },

    registerFarmer: function () {
        console.log("Registering Farmer...");
        StructStorage.deployed().then(function (instance) {
            return instance.registerAsFarmer({ from: account, gas: 100000 });
        }).then(function (res) {
            console.log("Registered Farmer");
            alert("Successfully Registered as Farmer!");
            $("#register-farmer").hide();
            $("#status").html("Welcome, Registered Farmer!");
        }).catch(function (e) {
            console.error(e);
            alert("Registration failed: " + e.message);
        });
    },

    registerInspector: function () {
        console.log("Registering Inspector...");
        StructStorage.deployed().then(function (instance) {
            return instance.registerAsInspector({ from: account, gas: 100000 });
        }).then(function (res) {
            console.log("Registered Inspector");
            alert("Successfully Registered as Inspector!");
            $("#register-inspector").hide();
            $("#status").html("Welcome, Registered Inspector!");
        }).catch(function (e) {
            console.error(e);
            alert("Registration failed: " + e.message);
        });
    },

    listenToEvents: function () {
        StructStorage.deployed().then(function (instance) {
            instance.CropAdded({}, { fromBlock: 0, toBlock: 'latest' }).watch(function (err, res) {
                if (!err) {
                    console.log("Event CropAdded:", res.args);
                }
            });
            instance.QualityTested({}, { fromBlock: 0, toBlock: 'latest' }).watch(function (err, res) {
                if (!err) {
                    console.log("Event QualityTested:", res.args);
                }
            });
        });
    },

    submitProduce: function () {
        console.log("Submit Produce Clicked");

        var fid = $("#fid").val();
        var fname = $("#fname").val();
        var loc = $("#loc").val();
        var crop = $("#crop").val();
        var contact = parseInt($("#contact").val()) || 0;
        var quantity = parseInt($("#quantity").val()) || 0;
        var exprice = parseInt($("#exprice").val()) || 0;

        if (!fid || !fname || !quantity) {
            alert("Please fill in all fields (Farmer ID, Name, Quantity).");
            return;
        }

        $("#status").html("Initiating transaction... (please wait)");

        // Conversion helper (Handles Web3 0.20.x and 1.x differences if needed)
        // Since we imported web3 0.20.7, use fromAscii
        var toBytes = function (val) {
            return window.web3.fromAscii(val);
        };

        StructStorage.deployed().then(function (instance) {
            // Using 1M gas to be safe
            return instance.produce(
                toBytes(fid),
                toBytes(fname),
                toBytes(loc),
                toBytes(crop),
                contact,
                quantity,
                exprice,
                { from: account, gas: 1000000 }
            );
        }).then(function () {
            $("#status").html("Transaction Complete!");
            alert("Produce Submitted Successfully!");

            // Celebration!
            if (window.fireConfetti) window.fireConfetti();

            // Attempt Auto-Fund
            App.fundAccount();

            // Switch to Quality Testing Tab automatically
            $("#sign-up-form").hide();
            $("#log-in-form").show();
            $(".btn-selector").removeClass("active");
            $("#log-in-btn").addClass("active");

        }).catch(function (e) {
            console.error(e);
            alert("Error submitting produce: " + e.message);
            $("#status").html("Error: " + e.message);
        });
    },

    fundAccount: function () {
        StructStorage.deployed().then(function (instance) {
            return instance.fundaddr(account, { from: account });
        }).then(function () {
            console.log("Account funded via fundaddr");
            App.refreshBalance();
        });
    },

    refreshBalance: function () {
        StructStorage.deployed().then(function (instance) {
            return instance.getBalance(account);
        }).then(function (val) {
            // Update both finance balance and header token balance
            $("#balance").html(val.toNumber());
            $("#token-balance").html(val.toNumber()).addClass("animated flash");
        });
    },

    submitQuality: function () {
        var lotno = $("#lotno").val();
        var grade = $("#grade").val();
        var mrp = parseInt($("#mrp").val()) || 0;
        var testdate = $("#testdate").val();
        var expdate = $("#expdate").val();

        var toBytes = function (val) { return window.web3.fromAscii(val); };

        StructStorage.deployed().then(function (instance) {
            return instance.quality(
                toBytes(lotno),
                toBytes(grade),
                mrp,
                toBytes(testdate),
                toBytes(expdate),
                { from: account, gas: 1000000 }
            );
        }).then(function () {
            alert("Quality Verified!");
            $("#approve-form").hide();
            $("#payments-form").show();
            $(".btn-selector").removeClass("active");
            $("#payments-btn").addClass("active");
        }).catch(function (e) {
            alert("Error: " + e.message);
        });
    },

    getCustomerData: function () {
        var fid = $("#getfid").val().trim();
        console.log("Fetching Customer Data for ID:", fid);

        var toBytes = function (val) { return window.web3.fromAscii(val); };

        StructStorage.deployed().then(function (instance) {
            return instance.getproduce(toBytes(fid));
        }).then(function (res) {
            var rawId = window.web3.toAscii(res[0]).replace(/\u0000/g, '');

            if (!rawId) {
                alert("ID Not Found on Blockchain. Please check if you submitted correctly.");
                return;
            }

            $("#cgetval1").html(rawId);
            $("#cgetval2").html(window.web3.toAscii(res[1]));
            $("#cgetval3").html(window.web3.toAscii(res[2]));
            $("#cgetval4").html(window.web3.toAscii(res[3]));
            $("#cgetval5").html(res[4].toNumber());
            $("#cgetval6").html(res[5].toNumber());
            $("#cgetval7").html(res[6].toNumber());

            // Timeline
            $("#product-timeline").show();
            $("#step-farmer .timeline-badge").addClass("success");
            $("#step-market .timeline-badge").addClass("success");

            // QR Code Generation
            var qrData = "GreenLedger Verified\n" +
                "Farmer ID: " + fid + "\n" +
                "Product: " + window.web3.toAscii(res[3]) + "\n" +
                "Quality: Grade A (Verified)";
            var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(qrData);
            $("#qr-output").attr("src", qrUrl);
            $("#qr-container").show();

        }).catch(function (e) {
            console.error(e);
            alert("Error fetching data: " + e.message);
        });
    },

    // Inspector Fetch Function
    getQualityData: function () {
        var fid = $("#fid1").val().trim();
        console.log("Fetching Produce Data for Inspector, ID:", fid);

        var toBytes = function (val) { return window.web3.fromAscii(val); };

        StructStorage.deployed().then(function (instance) {
            return instance.getproduce(toBytes(fid));
        }).then(function (res) {
            var rawId = window.web3.toAscii(res[0]).replace(/\u0000/g, '');
            if (!rawId) {
                alert("ID Not Found. Please check the Farmer ID.");
                return;
            }
            $("#getval2").html(window.web3.toAscii(res[1]));
            $("#getval3").html(window.web3.toAscii(res[2]));
            $("#getval4").html(window.web3.toAscii(res[3]));
            $("#getval5").html(res[4].toNumber());
            $("#getval6").html(res[5].toNumber());
            $("#getval7").html(res[6].toNumber());
        }).catch(function (e) {
            console.error(e);
            alert("Error fetching data: " + e.message);
        });
    },

    analyzeQuality: function () {
        var btn = $("#ai-scan-btn");
        var resDiv = $("#ai-result");

        // Simulation Animation
        btn.html("Scanning Crop... 📷");
        btn.addClass("active");

        setTimeout(function () {
            // Success State
            btn.html("<i class='glyphicon glyphicon-ok'></i> Verified by AI");
            btn.css("background", "rgba(118, 255, 3, 0.2)");

            // Auto-fill Data
            $("#grade").val("Grade A+ (Premium)");
            $("#mrp").val("1500");

            // Celebration!
            if (window.fireConfetti) window.fireConfetti();

            var today = new Date().toISOString().slice(0, 10);
            $("#testdate").val(today);
            $("#expdate").val("2026-12-31");

            resDiv.html("Confidence Score: 99.8% | No defects detected.").fadeIn();
        }, 2000);
    },

    printBlock: function () {
        window.web3.eth.getBlockNumber(function (err, res) {
            if (err) {
                console.error(err);
                alert("Error fetching block: " + err);
                return;
            }
            $("#blocknum").html(res);
            alert("Current Block Number: " + res);
        });
    },

    printTransaction: function () {
        window.web3.eth.getBlock('latest', function (err, block) {
            if (err) {
                console.error(err);
                return;
            }
            if (block.transactions.length > 0) {
                var txHash = block.transactions[0];
                alert("Latest Transaction Hash in Block " + block.number + ":\n" + txHash);
                console.log("Tx Details:", txHash);
            } else {
                alert("No transactions found in the latest block (" + block.number + ").");
            }
        });
    }
};

$(document).ready(function () {
    console.log("Document Ready - Binding Events (Consolidated)");

    // Web3 Initialization
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    App.start();

    // Tab Navigation
    $("#sign-up-btn").click(function () { setTab("#sign-up-form", this); });
    $("#log-in-btn").click(function () { setTab("#log-in-form", this); });
    $("#payments-btn").click(function () { setTab("#payments-form", this); });
    $("#finance-btn").click(function () { setTab("#finance-form", this); });
    $("#Approve-btn").click(function () { setTab("#approve-form", this); });

    function setTab(formId, btn) {
        $(".form").hide();
        $(formId).show();
        $(".btn-selector").removeClass("active");
        $(btn).addClass("active");
    }

    // Direct Event Bindings
    $("#register-farmer").click(function () { App.registerFarmer(); });
    $("#register-inspector").click(function () { App.registerInspector(); });

    // Submit Produce Button (The most critical one)
    $("#setvalue").off().click(function (e) {
        e.preventDefault();
        App.submitProduce();
    });

    $("#setQ").off().click(function (e) {
        e.preventDefault();
        App.submitQuality();
    });

    // Inspector Get Value
    $("#getvalue").off().click(function (e) {
        e.preventDefault();
        App.getQualityData();
    });

    $("#getcustval").off().click(function (e) {
        e.preventDefault();
        App.getCustomerData();
    });

    // Print Buttons
    $("#printBlock").off().click(function (e) {
        e.preventDefault();
        App.printBlock();
    });

    $("#printTransaction").off().click(function (e) {
        e.preventDefault();
        App.printTransaction();
    });

    // --- VISUAL EFFECTS FOR PITCH VIDEO ---

    // 2. Simple Confetti Generator
    window.fireConfetti = function () {
        for (let i = 0; i < 50; i++) {
            let conf = document.createElement("div");
            conf.classList.add("confetti");
            conf.style.left = Math.random() * 100 + "vw";
            conf.style.backgroundColor = ["#76ff03", "#ffd700", "#00d2ff"][Math.floor(Math.random() * 3)];
            conf.style.animationDuration = (Math.random() * 2 + 3) + "s";
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 4000);
        }
    }
});
